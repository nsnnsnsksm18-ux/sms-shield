import { getPlatforms, platformSummary } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const platforms = await getPlatforms();
    return Response.json({
      platforms: platforms.map(platformSummary),
    });
  } catch (error) {
    return apiError(error);
  }
}
