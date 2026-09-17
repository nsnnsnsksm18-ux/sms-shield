import { buyNumber, FerPayError, mapMessage } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      platform?: string;
      country?: string;
      service?: string;
    };
    if (!body.platform || !body.country || !body.service) {
      return Response.json(
        { error: "platform, country ve service gerekli" },
        { status: 400 },
      );
    }
    const result = await buyNumber({
      platform: body.platform,
      country: body.country,
      service: body.service,
      quantity: 1,
    });
    if (result.message && result.message !== "sms.success") {
      throw new FerPayError(
        mapMessage(result.message) || result.message,
        400,
        result.message,
      );
    }
    return Response.json(result);
  } catch (error) {
    return apiError(error);
  }
}
