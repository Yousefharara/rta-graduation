const DashboardAidOrdersFooter = () => {
  return (
    <section
      className="gap-6 min-h-40 grid"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
    >
      <article className="flex flex-col shrink gap-2 py-4 px-2 bg-white rounded-md border border-zinc-400">
        <h2 className="text-2xl font-semibold text-primary">
          خوارزمية الأولوية العادلة
        </h2>
        <p>
          يتم احتساب الأولوية بناءً على عوامل متعددة تشمل: الدخل الحالي، عدد
          أفراد الأسرة، الحالة الصحية، وتاريخ استلام المساعدات السابق لضمان
          التوزيع العادل والمستند إلى الحاجة الفعلية.
        </p>
        <div className="flex items-center gap-2">
          <small className="text-primary font-medium">
            تعرف على معايير الحساب
          </small>
          <svg
            width="5"
            height="10"
            viewBox="0 0 5 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 10L0 5L5 0V10Z" fill="#004AC6" />
          </svg>
        </div>
      </article>

      <article className="rounded-md grow bg-white flex flex-col border border-zinc-400 justify-center gap-2 px-4 py-2">
        <h2 className="text-2xl font-semibold">تحديثات المخزون الميداني</h2>
        <p>
          يتم ربط الطلبات تلقائياً بالمخزون المتوفر في أقرب مركز توزيع للمستفيد.
        </p>
      </article>
    </section>
  );
};

export default DashboardAidOrdersFooter;
