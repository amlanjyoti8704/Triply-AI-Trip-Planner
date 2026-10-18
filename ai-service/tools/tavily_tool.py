"""
Hotel/general web search tool using Tavily API.
Returns formatted search results for the travel planning pipeline.
"""

import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def tavily_search(query: str) -> str:
    """Search the web using Tavily and return formatted results."""

    try:
        response = client.search(query=query, max_results=5)
    except Exception as e:
        return f"Error searching: {str(e)}"

    results = []

    for i, r in enumerate(response.get("results", []), 1):
        title = r.get("title", "Unknown")
        url = r.get("url", "")
        snippet = r.get("content", "").strip()
        # Keep only the first 300 characters to avoid wall-of-text
        if len(snippet) > 300:
            snippet = snippet[:300].rsplit(" ", 1)[0] + "..."

        results.append(f"{i}. **{title}**\n   {url}\n   {snippet}")

    if not results:
        return "No search results found."

    return "\n\n".join(results)
