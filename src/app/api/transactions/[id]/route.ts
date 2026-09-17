import { getTransaction } from "@/lib/ferpay";
import { apiError } from "@/lib/api-error";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tx = await getTransaction(id);
    return Response.json(tx);
  } catch (error) {
    return apiError(error);
  }
}
