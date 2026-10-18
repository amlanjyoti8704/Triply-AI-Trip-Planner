"""
Hotel/general web search tool using Tavily API.
Returns formatted search results for the travel planning pipeline.
"""

import os
from tavily import TavilyClient
from dotenv import load_dotenv

_root_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
load_dotenv(_root_env)
load_dotenv()

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("TAVILY_API_KEY")
        _client = TavilyClient(api_key=api_key)
    return _client



def tavily_search(query: str, max_retries: int = 3) -> str:
    """Search the web using Tavily and return formatted results with automatic retry."""
    import time
    response = None
    last_err = None

    for attempt in range(max_retries):
        try:
            response = get_client().search(query=query, max_results=5)
            if response and "results" in response:
                break
        except Exception as e:
            last_err = e
            time.sleep(1)

    if not response or "results" not in response:
        return f"Error searching: {str(last_err)}"

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
