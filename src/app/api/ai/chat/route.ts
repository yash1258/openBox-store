import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callOpenRouter, Message } from "@/lib/ai/openrouter";
import { AI_TOOLS } from "@/lib/ai/tools";
import {
  getLiveStats,
  getInventorySummary,
  getDailyReport,
  searchProducts,
  getTrendingProducts,
  getRecentOrders,
  getSalesComparison,
} from "@/lib/ai/tools";

// POST /api/ai/chat - Chat with AI assistant
export async function POST(request: NextRequest) {
  console.log("[AI CHAT] Received request");
  
  try {
    // Check authentication
    const session = await getSession();
    console.log("[AI CHAT] Session check:", session ? "Authenticated" : "Not authenticated");
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Prepare messages
    const messages: Message[] = [
      ...history,
      { role: "user", content: message }
    ];

    // Call OpenRouter with tools
    const response = await callOpenRouter(messages, AI_TOOLS);
    
    const assistantMessage = response.choices[0]?.message;
    
    // Check if AI wants to use tools
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolResults = [];
      
      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        let result;
        try {
          switch (functionName) {
            case "get_live_stats":
              result = await getLiveStats();
              break;
            case "get_inventory_summary":
              result = await getInventorySummary(args.includeLowStock);
              break;
            case "get_daily_report":
              result = await getDailyReport(args.date);
              break;
            case "search_products":
              result = await searchProducts(args.query, args.status, args.limit);
              break;
            case "get_trending_products":
              result = await getTrendingProducts(args.limit);
              break;
            case "get_recent_orders":
              result = await getRecentOrders(args.days, args.limit);
              break;
            case "get_sales_comparison":
              result = await getSalesComparison(args.period1, args.period2);
              break;
            default:
              result = { error: "Unknown tool" };
          }
        } catch (error) {
          console.error(`Tool ${functionName} error:`, error);
          result = { error: "Failed to execute tool" };
        }
        
        toolResults.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(result),
        });
      }
      
      // Add tool results to messages and get final response
      const toolMessages: Message[] = [
        { role: "assistant", content: assistantMessage.content || "", tool_calls: assistantMessage.tool_calls },
        ...toolResults.map((r: any) => ({
          role: "tool" as const,
          content: r.content,
          tool_call_id: r.tool_call_id,
        })),
      ];
      
      const finalResponse = await callOpenRouter([...messages, ...toolMessages], AI_TOOLS);
      const finalMessage = finalResponse.choices[0]?.message;
      
      return NextResponse.json({
        success: true,
        data: {
          message: finalMessage?.content || "I apologize, but I couldn't process that request.",
          toolsUsed: toolResults.map((t: any) => t.name),
        },
        meta: {
          tokensUsed: finalResponse.usage?.total_tokens,
        },
      });
    }
    
    // No tools used, return direct response
    return NextResponse.json({
      success: true,
      data: {
        message: assistantMessage?.content || "I apologize, but I couldn't process that request.",
        toolsUsed: [],
      },
      meta: {
        tokensUsed: response.usage?.total_tokens,
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// GET /api/ai/suggestions - Get suggested queries for the user
export async function GET(request: NextRequest) {
  console.log("[AI SUGGESTIONS] Received request");
  
  try {
    // Check authentication
    const session = await getSession();
    console.log("[AI SUGGESTIONS] Session check:", session ? "Authenticated" : "Not authenticated");
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const suggestions = [
      {
        category: "Sales",
        queries: [
          "How many orders today?",
          "What was yesterday's revenue?",
          "Compare this week vs last week",
          "Show me recent orders",
        ]
      },
      {
        category: "Inventory",
        queries: [
          "What's low in stock?",
          "How many products available?",
          "What's the total inventory value?",
          "Search for iPhone products",
        ]
      },
      {
        category: "Insights",
        queries: [
          "What products are trending?",
          "How's my conversion rate?",
          "Show today's stats",
          "What's my best selling product?",
        ]
      },
    ];

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Get suggestions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
