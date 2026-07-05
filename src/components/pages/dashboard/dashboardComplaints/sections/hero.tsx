import { MessageSquareText, MessageCircle, CircleCheck } from "lucide-react";
import { useAppSelector } from "@/redux/store";

const DashboardComplaintsHero = () => {
  const { complaints } = useAppSelector((state) => state.complaints);

  const total = complaints.length;
  const open = complaints.filter((c) => c.status === "open").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  const cards = [
    {
      label: "جميع الشكاوى",
      value: total,
      icon: <MessageSquareText className="text-zinc-600" />,
      bg: "bg-[#E0E3E5]",
    },
    {
      label: "شكاوى مفتوحة",
      value: open,
      icon: <MessageCircle className="text-amber-600" />,
      bg: "bg-amber-100",
    },
    {
      label: "شكاوى تم حلها",
      value: resolved,
      icon: <CircleCheck className="text-green-600" />,
      bg: "bg-green-100",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">إدارة الشكاوى</h1>
      <article
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            className="px-6 py-4 rounded-md border border-zinc-400 bg-white flex flex-col gap-1"
          >
            <div className={`${card.bg} p-3 rounded-md w-fit`}>{card.icon}</div>
            <p className="font-medium text-zinc-700">{card.label}</p>
            <small className="font-bold text-xl">{card.value}</small>
          </div>
        ))}
      </article>
    </section>
  );
};

export default DashboardComplaintsHero;
