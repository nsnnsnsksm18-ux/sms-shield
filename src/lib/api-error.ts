import { NextResponse } from "next/server";
import { FerPayError } from "@/lib/ferpay";

export function apiError(error: unknown) {
  if (error instanceof FerPayError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status >= 400 && error.status < 600 ? error.status : 502 },
    );
  }
  console.error(error);
  return NextResponse.json({ error: "Beklenmeyen sunucu hatası" }, { status: 500 });
}
