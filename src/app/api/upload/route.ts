import { NextRequest } from "next/server";
import { requireApiKey, successResponse, errorResponse } from "@/lib/api-auth";
import { uploadImage } from "@/lib/upload";

// POST /api/upload - Upload an image
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authError = await requireApiKey(request);
    if (authError) return authError;

    const body = await request.json();
    const { image, folder } = body;

    if (!image) {
      return errorResponse("No image provided", "VALIDATION_ERROR", 400);
    }

    // Validate base64 image
    if (!image.startsWith("data:image/")) {
      return errorResponse("Invalid image format", "VALIDATION_ERROR", 400);
    }

    // Upload image
    const result = await uploadImage(image, { folder });

    return successResponse(result, { message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Failed to upload image", "UPLOAD_ERROR", 500);
  }
}
