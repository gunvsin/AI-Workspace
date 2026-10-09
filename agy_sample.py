import asyncio
import os
import google.antigravity as agy

async def main():
    ollama_endpoint = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    config = agy.LocalOpenAIAgentConfig(
        model="gemma2",  # Updated to match the registry name
        base_url=f"{ollama_endpoint}/v1"
    )
    print(f"Connecting to endpoint: {ollama_endpoint}")
    async with agy.Agent(config=config) as agent:
        response = await agent.chat("Hello! Confirm you are running inside a Docker network.")
        text_content = await response.text()
        print("\n--- Agent Response ---")
        print(text_content)

if __name__ == "__main__":
    asyncio.run(main())
