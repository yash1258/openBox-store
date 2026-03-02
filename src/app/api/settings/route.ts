import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// GET /api/settings - Get store settings
export async function GET(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const settings = await prisma.settings.findFirst();

  // Don't expose API keys in response
  const safeSettings = settings
    ? {
        id: settings.id,
        shopName: settings.shopName,
        whatsapp: settings.whatsapp,
        address: settings.address,
        hasApiKeys: settings.apiKeys && settings.apiKeys.length > 0,
      }
    : { shopName: "", whatsapp: "", address: "", hasApiKeys: false };

  return successResponse(safeSettings);
}

// PUT /api/settings - Update store settings
export async function PUT(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const existing = await prisma.settings.findFirst();

    if (existing) {
      const updateData: Record<string, unknown> = {};
      if (body.shopName !== undefined) updateData.shopName = body.shopName;
      if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp;
      if (body.address !== undefined) updateData.address = body.address;

      const settings = await prisma.settings.update({
        where: { id: existing.id },
        data: updateData,
      });

      return successResponse(
        { shopName: settings.shopName, whatsapp: settings.whatsapp, address: settings.address },
        { message: "Settings updated successfully" }
      );
    } else {
      const settings = await prisma.settings.create({
        data: {
          shopName: body.shopName || "My OpenBox Store",
          whatsapp: body.whatsapp || "",
          address: body.address || "",
        },
      });

      return successResponse(
        { shopName: settings.shopName, whatsapp: settings.whatsapp, address: settings.address },
        { message: "Settings created" }
      );
    }
  } catch (error) {
    console.error("Error updating settings:", error);
    return errorResponse("Failed to update settings", "UPDATE_ERROR", 500);
  }
}
