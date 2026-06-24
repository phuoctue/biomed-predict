import asyncio, logging, os
from dotenv import load_dotenv
load_dotenv('../.env')

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

async def main():
    try:
        client = ChatOpenAI(
            api_key=os.getenv('LLM_API_KEY'),
            base_url=os.getenv('LLM_BASE_URL'),
            model=os.getenv('LLM_MODEL', 'gpt-4o-mini'),
            temperature=0.2
        )
        res = await client.ainvoke([HumanMessage(content="Test")])
        print("SUCCESS:", res.content)
    except Exception as e:
        print("ERROR:", e)

asyncio.run(main())
