import { Megaphone, Play, CircleCheck } from "lucide-react";
import { useAppSelector } from "@/redux/store";

const DashboardCampaignsHero = () => {
  const { campaigns } = useAppSelector((state) => state.campaigns);

  const total = campaigns.length;
  const active = campaigns.filter((c) => c.status === "active").length;
  const closed = campaigns.filter((c) => c.status === "closed").length;

  const cards = [
    {
      label: "جميع الحملات",
      value: total,
      icon: <Megaphone className="text-zinc-600" />,
      bg: "bg-[#E0E3E5]",
    },
    {
      label: "حملات نشطة",
      value: active,
      icon: <Play className="text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "حملات منتهية",
      value: closed,
      icon: <CircleCheck className="text-green-600" />,
      bg: "bg-green-100",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">إدارة الحملات</h1>
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

export default DashboardCampaignsHero;
