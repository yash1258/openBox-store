import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateDailyReport, getDailyReport, getReportsInRange } from "@/lib/jobs/dailyReport";

// POST /api/admin/reports - Generate daily report
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/reports - Starting...");
    
    // Check authentication
    const session = await getSession();
    if (!session) {
      console.log("POST /api/admin/reports - Unauthorized");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("POST /api/admin/reports - Session OK, parsing body...");
    const body = await request.json();
    const date = body.date ? new Date(body.date) : new Date();

    console.log("POST /api/admin/reports - Generating report for:", date);
    // Generate report
    const report = await generateDailyReport(date);
    
    console.log("POST /api/admin/reports - Report generated successfully");
    return NextResponse.json({
      success: true,
      data: report,
      meta: {
        message: `Report generated for ${date.toDateString()}`,
      },
    });
  } catch (error) {
    console.error("Generate report error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate report", details: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/admin/reports - Get reports
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const range = searchParams.get("range"); // "7d", "30d", "all"

    if (date) {
      // Get specific date report
      const report = await getDailyReport(new Date(date));
      if (!report) {
        return NextResponse.json(
          { success: false, error: "Report not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: report,
      });
    }

    // Get range of reports
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30); // Default to last 30 days
    }

    const reports = await getReportsInRange(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: reports,
      meta: {
        count: reports.length,
        range: `${startDate.toDateString()} - ${endDate.toDateString()}`,
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get reports" },
      { status: 500 }
    );
  }
}
