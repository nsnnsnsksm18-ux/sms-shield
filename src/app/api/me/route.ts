import { getMe, getMarkup } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

export const preferredRegion = ["fra1", "cdg1", "arn1"];
export const runtime = "nodejs";

export async function GET() {
  try {
    const me = await getMe();
    return Response.json({
      balance: me.wallet?.balance ?? 0,
      name: me.name ?? "",
      markup: getMarkup(),
    });
  } catch (error) {
    return apiError(error);
  }
}
