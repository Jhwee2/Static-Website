import json
import os
from openai import OpenAI
from anthropic import Anthropic


# Environment variables for AWS Lambda
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
VECTOR_STORE_ID = os.environ.get("VECTOR_STORE_ID")

# Initialize clients globally for efficiency (AWS Lambda reuses these between invocations)
openai_client = OpenAI(api_key=OPENAI_API_KEY)  # Use the environment variable
anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)  # Use the environment variable

def hybrid_search_and_answer(user_query):
    """
    Main RAG function: retrieves context from OpenAI vector store,
    then generates answer using Claude Haiku.

    Returns dict with answer, context, and metadata.
    """
    print(f"1. Searching OpenAI Vector Store for: '{user_query}'...")

    # --- STEP A: RETRIEVAL (OpenAI) ---
    try:
        results = openai_client.vector_stores.search(
            vector_store_id=VECTOR_STORE_ID,  # Use the environment variable
            query=user_query,
            max_num_results=2
        )
    except Exception as e:
        raise Exception(f"Error connecting to OpenAI: {str(e)}")

    # --- STEP B: EXTRACTION ---
    context_text = ""
    sources = []
    if results.data:
        for res in results.data:
            context_text += res.content[0].text + "\n\n"
            # Capture source metadata if available
            sources.append({
                "id": getattr(res, 'id', 'unknown'),
                "score": getattr(res, 'score', None)
            })
    else:
        context_text = "No specific context found in the database."

    print(f"2. Found context ({len(context_text)} chars). Sending to Claude Haiku...")

    # --- STEP C: GENERATION (Anthropic Claude Haiku) ---
    try:
        response = anthropic_client.messages.create(
            model="claude-haiku-4-5-20251001",  # Cheapest Anthropic model
            max_tokens=1024,
            system=f"You are a helpful assistant. Answer the user's question using ONLY the context provided below.\n\nCONTEXT:\n{context_text}",
            messages=[
                {"role": "user", "content": user_query}
            ]
        )

        answer = response.content[0].text

        return {
            "answer": answer,
            "context_provided": bool(results.data),
            "sources": sources,
            "model": "claude-haiku-4-5"
        }
    except Exception as e:
        raise Exception(f"Error connecting to Anthropic: {str(e)}")


def lambda_handler(event, context):
    """
    AWS Lambda handler for API Gateway integration.
    Expects query parameter 'query' or JSON body with 'query' field.
    """
    # CORS headers for Amplify website
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  # Update with your Amplify domain for production
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }

    try:
        # Handle preflight OPTIONS request
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': ''
            }

        # Extract query from event
        user_query = None

        # Try query parameters first (GET request)
        if event.get('queryStringParameters') and event['queryStringParameters'].get('query'):
            user_query = event['queryStringParameters']['query']

        # Try body (POST request) - accept both 'query' and 'message'
        elif event.get('body'):
            body = json.loads(event['body'])
            user_query = body.get('query') or body.get('message')  # Accept both formats

        if not user_query:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'error': 'Missing required parameter: query',
                    'message': 'Please provide a query parameter or JSON body with query field'
                })
            }

        # Execute RAG pipeline
        result = hybrid_search_and_answer(user_query)

        # Return in the format expected by frontend (reply field)
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'reply': result['answer'],  # Frontend expects 'reply' field
                'metadata': {
                    'context_provided': result.get('context_provided'),
                    'sources': result.get('sources'),
                    'model': result.get('model')
                }
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }


# For local testing
if __name__ == "__main__":
    # Test the function locally
    result = hybrid_search_and_answer("Jared favorite food")
    print(json.dumps(result, indent=2))
