import "./style.css";
const RsourceAllocation = () => {
  return (
    <section className="flex flex-col rounded-lg border border-zinc-300">
      <div className="w-full bg-primary/20 border-b border-b-zinc-300 py-4 px-12">
        توزيع الموارد حسب الفئة
      </div>
      <article className="flex flex-col gap-4 py-4 px-12">
        <div>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <p>الغذاء والتغذية</p>
            <small>45%</small>
          </div>
          <div className="slider-color slider-food w-full h-2 bg-primary/10 rounded-full "></div>
        </div>

        <div>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <p>الإمدادات الطبية</p>
            <small>30%</small>
          </div>
          <div className="slider-color slider-medical w-full h-2 bg-primary/10 rounded-full "></div>
        </div>

        <div>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <p>المياه النظيفة والصرف الصحي</p>
            <small>15%</small>
          </div>
          <div className="slider-color slider-water w-full h-2 bg-primary/10 rounded-full "></div>
        </div>

        <div>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <p>الدعم العملياتي</p>
            <small>10%</small>
          </div>
          <div className="slider-color slider-support w-full h-2 bg-primary/10 rounded-full "></div>
        </div>
      </article>
    </section>
  );
};

export default RsourceAllocation;
