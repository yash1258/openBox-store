import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";

// Generate a random API key
function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "ob_";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// POST /api/settings/api-key - Generate a new API key
export async function POST(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const label = body.label || "AI Agent";

    // Get or create settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          shopName: "My OpenBox Store",
          whatsapp: "",
          address: "",
        },
      });
    }

    // Generate new API key
    const newKey = generateApiKey();

    // Get existing keys
    const existingKeysJson = settings.apiKeys || "[]";
    const existingKeys: string[] = typeof existingKeysJson === "string" ? JSON.parse(existingKeysJson) : existingKeysJson;
    existingKeys.push(newKey);

    // Update settings with new key
    await prisma.settings.update({
      where: { id: settings.id },
      data: { apiKeys: JSON.stringify(existingKeys) },
    });

    return successResponse(
      {
        apiKey: newKey,
        label,
        created: new Date().toISOString(),
      },
      {
        message: "API key generated. Save this key - it won't be shown again!",
        warning: "Store this key securely. It will not be displayed again.",
      }
    );
  } catch (error) {
    console.error("Error generating API key:", error);
    return errorResponse("Failed to generate API key", "CREATE_ERROR", 500);
  }
}

// DELETE /api/settings/api-key - Revoke an API key
export async function DELETE(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return errorResponse("API key is required", "VALIDATION_ERROR");
    }

    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return errorResponse("Settings not found", "NOT_FOUND", 404);
    }

    const existingKeysJson = settings.apiKeys || "[]";
    const existingKeys: string[] = typeof existingKeysJson === "string" ? JSON.parse(existingKeysJson) : existingKeysJson;
    const newKeys = existingKeys.filter((k) => k !== apiKey);

    if (newKeys.length === existingKeys.length) {
      return errorResponse("API key not found", "NOT_FOUND", 404);
    }

    await prisma.settings.update({
      where: { id: settings.id },
      data: { apiKeys: JSON.stringify(newKeys) },
    });

    return successResponse({ message: "API key revoked successfully" });
  } catch (error) {
    console.error("Error revoking API key:", error);
    return errorResponse("Failed to revoke API key", "DELETE_ERROR", 500);
  }
}

// GET /api/settings/api-key - List API keys (without exposing them)
export async function GET(request: NextRequest) {
  const authError = await requireApiKey(request);
  if (authError) return authError;

  const settings = await prisma.settings.findFirst();
  const keysJson = settings?.apiKeys || "[]";
  const keys: string[] = typeof keysJson === "string" ? JSON.parse(keysJson) : keysJson;

  return successResponse({
    count: keys.length,
    keys: keys.map((_, i) => ({
      id: i + 1,
      label: `Key ${i + 1}`,
      masked: `ob_*********************`,
    })),
  });
}
