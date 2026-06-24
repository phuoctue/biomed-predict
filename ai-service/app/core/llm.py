from __future__ import annotations

from typing import Any
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


def build_prompt(payload: dict[str, Any], purpose: str) -> str:
    return (
        f"You are a medical AI assistant for drug-safety screening.\n"
        f"Purpose: {purpose}\n"
        f"Return concise, clinically-aware output in Vietnamese.\n"
        f"Input JSON: {payload}"
    )


async def call_llm(prompt: str) -> str:
    provider = settings.llm_provider.lower()
    logger.info(f"=== LLM Call Started ===")
    logger.info(f"Provider: {provider}")
    logger.info(f"Model: {settings.llm_model}")
    logger.info(f"API Key present: {bool(settings.llm_api_key)}")

    if provider == "openai" and settings.llm_api_key:
        try:
            from langchain_core.messages import HumanMessage
            from langchain_openai import ChatOpenAI

            client = ChatOpenAI(
                api_key=settings.llm_api_key,
                base_url=settings.llm_base_url,
                model=settings.llm_model,
                temperature=settings.llm_temperature,
            )
            response = await client.ainvoke([HumanMessage(content=prompt)])
            return response.content
        except Exception:
            return fallback_response(prompt)

    if provider == "groq" and settings.llm_api_key:
        try:
            logger.info("Using Groq provider...")
            from langchain_core.messages import HumanMessage
            from langchain_groq import ChatGroq

            client = ChatGroq(
                api_key=settings.llm_api_key,
                model=settings.llm_model,
                temperature=settings.llm_temperature,
            )
            logger.info("Groq client created, sending request...")
            response = await client.ainvoke([HumanMessage(content=prompt)])
            logger.info(f"Groq response received: {response.content[:200]}...")
            return response.content
        except Exception as e:
            logger.error(f"Groq API call failed: {e}")
            return fallback_response(prompt)

    logger.warning(f"No valid LLM provider configured. Provider={provider}, Has API key={bool(settings.llm_api_key)}")
    return fallback_response(prompt)


def fallback_response(prompt: str) -> str:
    return (
        "LLM provider is not configured. "
        "This is a safe fallback response from MediAI AI Service.\n\n"
        f"Prompt preview: {prompt[:300]}"
    )
