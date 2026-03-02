// OpenRouter client configuration
// OpenRouter provides access to multiple LLMs (Claude, GPT-4, etc.)

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";

interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[];
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      tool_calls?: ToolCall[];
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for OpenBox Store, an e-commerce platform for selling open-box and pre-owned tech products.

Your job is to help sellers manage their store by answering questions about:
- Sales and revenue data
- Inventory and stock levels
- Product performance
- Customer behavior and trends
- Daily reports and analytics

You have access to tools that can:
- Get live store statistics (today's sales, visitors, etc.)
- Fetch inventory information (stock levels, low stock alerts)
- Retrieve daily reports (revenue, orders, conversion rates)
- Search products in the catalog
- Get trending products

Guidelines:
1. Be helpful, concise, and professional
2. Use the available tools to get accurate data
3. Provide actionable insights when possible
4. If you don't have access to certain data, say so clearly
5. Format currency in INR (₹)
6. Keep responses brief but informative
7. For complex queries, break down the answer into bullet points

Current date: ${new Date().toDateString()}
`;

// Call OpenRouter API
export async function callOpenRouter(
  messages: Message[],
  tools?: any[],
  temperature: number = 0.7
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
      "X-Title": "OpenBox Store AI Assistant",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      tools: tools || [],
      temperature,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  return response.json();
}

// Simple chat without tools
export async function chatWithAI(userMessage: string, history: Message[] = []): Promise<string> {
  const messages: Message[] = [
    ...history,
    { role: "user", content: userMessage }
  ];

  const response = await callOpenRouter(messages);
  
  return response.choices[0]?.message?.content || "I apologize, but I couldn't process your request.";
}

// Export types
export type { Message, ToolCall, OpenRouterResponse };
