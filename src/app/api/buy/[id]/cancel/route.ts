import { cancelBuy } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await cancelBuy(id);
    return Response.json(result);
  } catch (error) {
    return apiError(error);
  }
}
