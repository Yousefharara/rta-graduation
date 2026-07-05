import { Package, PackageCheck, Warehouse } from "lucide-react";
import { useAppSelector } from "@/redux/store";

const DashboardAidsHero = () => {
  const { aids } = useAppSelector((state) => state.aids);

  const totalAids = aids.length;
  const totalQuantity = aids.reduce((sum, aid) => sum + aid.quantity, 0);
  const totalRemaining = aids.reduce(
    (sum, aid) => sum + aid.remaining_quantity,
    0,
  );

  const cards = [
    {
      label: "إجمالي المساعدات",
      value: totalAids,
      icon: <Warehouse className="text-zinc-600" />,
      bg: "bg-[#E0E3E5]",
    },
    {
      label: "إجمالي الكمية",
      value: totalQuantity,
      icon: <Package className="text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "الكمية المتبقية",
      value: totalRemaining,
      icon: <PackageCheck className="text-green-600" />,
      bg: "bg-green-100",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">المساعدات</h1>
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

export default DashboardAidsHero;
