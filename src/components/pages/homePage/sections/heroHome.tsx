import Button from "@/components/atoms/button";
import hero from "@/assets/home/Humanitarian Aid.png";

const HeroHome = () => {
  return (
    <section className="flex flex-col justify-between items-center gap-8 my-10 lg:flex-row">
      <article className="flex text-center flex-col gap-4 basis-[48%] lg:text-start">
        <h2
          className="leading-normal sm:leading-15  font-semibold"
          style={{ fontSize: "clamp(22px, 5vw, 48px)" }}
        >
          منصة RTA: نحو توزيع عادل وشفاف للمساعدات في غزة
        </h2>
        <p style={{ fontSize: "clamp(15px, 3vw, 18px)" }}>
          نظام ذكي يربط المانحين بالمستحقين، لضمان وصول كل مساعدة إلى أهلها
          بكرامة و شفافية كاملة عبر تقنيات التتبع المتقدمة.
        </p>
        <Button className="self-end" variant="default">
          ساهم معنا الآن
        </Button>
      </article>
      <article className="basis-1/2 h-full overflow-hidden rounded-lg">
        <img className="object-cover w-full h-full" src={hero} alt="" />
      </article>
    </section>
  );
};

export default HeroHome;
