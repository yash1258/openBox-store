import { NextRequest, NextResponse } from "next/server";
import { generateDailyReport } from "@/lib/jobs/dailyReport";

// This endpoint is called by Vercel Cron or manually
// It generates the daily report for yesterday (since it runs at 9 AM)
export async function GET(request: NextRequest) {
  try {
    // Security check - verify cron secret or admin access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Check if it's a legitimate cron job or admin request
    const isCronJob = authHeader === `Bearer ${cronSecret}`;
    const isManualTrigger = request.headers.get("x-manual-trigger") === "true";
    
    if (!isCronJob && !isManualTrigger) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate report for yesterday (since we run at 9 AM)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    console.log(`[CRON] Generating daily report for ${yesterday.toDateString()}...`);
    
    const report = await generateDailyReport(yesterday);
    
    console.log(`[CRON] Daily report generated successfully:`, {
      date: report.date,
      orders: report.orders,
      revenue: report.revenue,
    });

    return NextResponse.json({
      success: true,
      data: report,
      meta: {
        message: `Daily report generated for ${yesterday.toDateString()}`,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[CRON] Failed to generate daily report:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate daily report",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
