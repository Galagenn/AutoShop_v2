import Link from "next/link";

export default function CtaBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-6 md:p-8 mt-10">
      <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top_left,rgba(214,255,0,0.12),transparent_50%)]" />
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold">Разместите своё авто сегодня 🚘</h3>
          <p className="text-white/70 mt-2">Быстрая модерация, премиум-подача объявления и заинтересованные покупатели.</p>
        </div>
        <Link href="/sell" className="btn-primary shadow-[0_0_40px_4px_rgba(214,255,0,0.12)]">Добавить объявление</Link>
      </div>
    </div>
  )
}


