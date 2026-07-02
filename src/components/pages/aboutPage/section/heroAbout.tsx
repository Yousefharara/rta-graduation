import Button from "@/components/atoms/button";
import Container from "@/components/atoms/container";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

const HeroAbout = () => {
  const navigate = useNavigate();
  return (
    <section className=" bg-[#EFF4FF] py-20">
      <Container className="flex flex-col gap-4 justify-center max-h-72 ">
        <div className="bg-primary text-white rounded-4xl py-1 px-4 w-fit">
          Relife Track Aid
        </div>

        <h2
          className="font-semibold"
          style={{ fontSize: "clamp(18px, 5vw, 38px)" }}
        >
          عن المنصة
        </h2>
        <p className="md:max-w-3xl font-medium text-lg">
          نحن نجمع بين التكنولوجيا والتعاطف لضمان وصول كل مساهمة إلى وجهتها
          الصحيحة. Relief Track Aid هي نظامك الموثوق لتتبع وإدارة المساعدات
          الإنسانية بكل شفافية.
        </p>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(PATHS.TRACK_AID.ROOT, {replace: true})}>بدء التتبع</Button>
          <Button variant="outline">تعرف على أثرنا</Button>
        </div>
      </Container>
    </section>
  );
};

export default HeroAbout;
