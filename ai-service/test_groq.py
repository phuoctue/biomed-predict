import asyncio, os
from dotenv import load_dotenv
load_dotenv('../.env')

from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq

async def main():
    try:
        api_key = os.getenv('LLM_API_KEY')
        model = os.getenv('LLM_MODEL', 'llama-3.1-70b-versatile')
        print(f"Using Groq with model: {model}, key starts with: {api_key[:5] if api_key else 'None'}")
        
        client = ChatGroq(
            api_key=api_key,
            model=model,
            temperature=0.2
        )
        res = await client.ainvoke([HumanMessage(content="Test JSON { \"hello\": \"world\" }")])
        print("SUCCESS:", res.content)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
