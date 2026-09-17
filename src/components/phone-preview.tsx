import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BUBBLES = [
  {
    from: "WhatsApp",
    text: "WhatsApp kodun: 482917. Bu kodu kimseyle paylaşma.",
    code: "482917",
  },
  {
    from: "Telegram",
    text: "Telegram code: 119304",
    code: "119304",
  },
];

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-primary/18 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#07161a] shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-3 text-[10px] text-white/50">
          <span>09:41</span>
          <span className="h-3.5 w-20 rounded-full bg-black" />
          <span>5G</span>
        </div>
        <div className="px-4 pb-5 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-teal-200/70">Aktif hat</p>
              <p className="font-mono text-sm tracking-wide text-white">
                +90 532 441 08 17
              </p>
            </div>
            <Badge className="bg-teal-400/15 text-teal-200">4:12</Badge>
          </div>
          <div className="space-y-2.5">
            {BUBBLES.map((sms) => (
              <div
                key={sms.code}
                className="rounded-2xl rounded-tl-sm border border-white/8 bg-white/6 p-3"
              >
                <div className="mb-1 flex items-center gap-1.5 text-[11px] text-teal-200/80">
                  <MessageCircle className="size-3" />
                  {sms.from}
                </div>
                <p className="text-[13px] leading-5 text-white/90">{sms.text}</p>
                <p className="mt-2 font-mono text-lg tracking-[0.3em] text-teal-300">
                  {sms.code}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-white/35">
            Kod 4–9 sn içinde düşer · kopyala, yapıştır
          </p>
        </div>
      </div>
    </div>
  );
}
