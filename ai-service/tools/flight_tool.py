"""
Flight search tool wrapper that delegates to the comprehensive transit tool.
Preserves backward compatibility while delivering both flight and train options.
"""

from tools.transit_tool import search_transit


def search_flights(query: str) -> str:
    """Search for flights and train options for the given travel query."""
    return search_transit(query)
