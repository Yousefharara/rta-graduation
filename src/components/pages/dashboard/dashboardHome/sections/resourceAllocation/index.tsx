import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getAidTypes } from "@/redux/slices/aidTypes";
import { getBeneficiaryAids } from "@/redux/slices/beneficiaryAidSlice";
import "./style.css";

const COLORS = [
  { color: "var(--color-primary)" },
  { color: "#28A745" },
  { color: "#1B365D" },
  { color: "#F59E0B" },
  { color: "#7C3AED" },
  { color: "#0D9488" },
  { color: "#E11D48" },
  { color: "#74777F" },
  { color: "#0891B2" },
  { color: "#D97706" },
];

const RsourceAllocation = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { aidTypes } = useAppSelector((state) => state.aidTypes);
  const { beneficiaryAids } = useAppSelector((state) => state.beneficiaryAids);

  useEffect(() => {
    if (!accessToken) return;
    if (aidTypes.length === 0) dispatch(getAidTypes(accessToken));
    if (beneficiaryAids.length === 0) dispatch(getBeneficiaryAids(accessToken));
  }, [dispatch, accessToken, aidTypes.length, beneficiaryAids.length]);

  const data = useMemo(() => {
    const delivered = beneficiaryAids.filter(
      (a) => a.status === "delivered",
    );
    const total = delivered.length;
    if (total === 0) return [];

    const counts: Record<number, number> = {};
    delivered.forEach((a) => {
      counts[a.aid_type_id] = (counts[a.aid_type_id] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([aidTypeId, count]) => {
        const type = aidTypes.find(
          (t) => Number(t.id) === Number(aidTypeId),
        );
        return {
          name: type?.name || `نوع ${aidTypeId}`,
          percentage: Math.round((count / total) * 100),
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [beneficiaryAids, aidTypes]);

  return (
    <section className="flex flex-col rounded-lg border border-zinc-300">
      <div className="w-full bg-primary/20 border-b border-b-zinc-300 py-4 px-12">
        توزيع الموارد حسب الفئة
      </div>
      {data.length === 0 ? (
        <div className="py-8 px-12 text-zinc-500 text-center">
          لا توجد مساعدات موزعة بعد
        </div>
      ) : (
        <article className="flex flex-col gap-4 py-4 px-12">
          {data.map((item, index) => {
            const { color } = COLORS[index % COLORS.length];
            return (
              <div key={item.name}>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <p>{item.name}</p>
                  <small>{item.percentage}%</small>
                </div>
                <div
                  className="slider-color w-full h-2 rounded-full"
                  style={{
                    backgroundColor: "rgb(0 0 0 / 0.08)",
                  }}
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </article>
      )}
    </section>
  );
};

export default RsourceAllocation;
