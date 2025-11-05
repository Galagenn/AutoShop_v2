import Link from "next/link";

type Message = { id: string; from: string; text: string; time: string };

export default function MessagesPreview({ messages }: { messages: Message[] }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Сообщения</h3>
        <Link href="/messages" className="text-sm text-white/70 hover:text-white">Перейти в чат</Link>
      </div>
      <div className="space-y-3">
        {messages.length === 0 && <div className="text-white/60 text-sm">Новых сообщений нет</div>}
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-3 rounded-lg border border-[#1f1f1f] p-3 hover:bg-white/5">
            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">{m.from[0]}</div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium truncate">{m.from}</div>
                <div className="text-xs text-white/50 shrink-0">{m.time}</div>
              </div>
              <div className="text-sm text-white/70 truncate">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


