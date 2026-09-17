import { getPlatforms, platformSummary } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

export const preferredRegion = ["fra1", "cdg1", "arn1"];
export const runtime = "nodejs";

export async function GET() {
  try {
    const platforms = await getPlatforms();
    return Response.json({
      platforms: platforms.map(platformSummary),
      live: true,
    });
  } catch (error) {
    return apiError(error);
  }
}
