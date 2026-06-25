
const StatisticsAbout = () => {
  return (
    <section
      className="bg-white rounded-2xl border border-zinc-300 grid gap-6 py-6 px-12"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
    >

        <article className="flex flex-col gap-3 justify-center items-center">
            <h3 className="text-4xl font-bold text-primary">500K+</h3>
            <p className="font-medium">وجبة تم تسليمها</p>
        </article>
        <article className="flex flex-col gap-3 justify-center items-center">
            <h3 className="text-4xl font-bold text-primary">120+</h3>
            <p className="font-medium">منظمه شريكة</p>
        </article>
        <article className="flex flex-col gap-3 justify-center items-center">
            <h3 className="text-4xl font-bold text-primary">2.5M</h3>
            <p className="font-medium">قيمة المساعدات ($)</p>
        </article>
        <article className="flex flex-col gap-3 justify-center items-center">
            <h3 className="text-4xl font-bold text-primary">15K</h3>
            <p className="font-medium">متطوع ميداني</p>
        </article>
    </section>
  );
};

export default StatisticsAbout;
