import { getMe, getMarkup } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

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
