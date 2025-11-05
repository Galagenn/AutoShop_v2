import type { Metadata } from "next";
import SellForm from "./SellForm";

export const metadata: Metadata = {
  title: "Добавить авто — AutoShop",
  description: "Заполните форму и опубликуйте объявление",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center">
      <section className="py-8 w-full">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">Добавить авто</h1>
          <SellForm />
        </div>
      </section>
    </div>
  );
}