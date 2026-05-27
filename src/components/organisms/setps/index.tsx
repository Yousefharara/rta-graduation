import { useEffect, useState } from "react";
import "./setps.css";

const steps = [
  "قيد المراجعة",
  "تم الموافقه",
  "تم تجهيز المساعدة",
  "جاري التوزيع",
  "تم التوصيل",
];

const currentStep = 2;

const StepsAid = () => {
  const [isMobile, setIsMobiel] = useState<boolean>(false);

  const handleResize = () => {
    setIsMobiel(window.innerWidth < 768);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      dir="ltr"
      className="relative flex justify-start items-start flex-col gap-8 z-0 md:items-center md:flex-row md:justify-between md:w-full"
    >
      {/* الخط الخلفي */}
      <div className="absolute left-5 top-0 h-full w-1 bg-zinc-300 -z-10 md:top-5 md:left-0 md:h-1 md:w-full" />

      {/* الخط النشط */}
      <div
        className="absolute left-5 h-auto top-0 w-1 bg-secondary -z-10 transition-all md:h-1 md:left-0 md:top-5 md:w-auto"
        style={{
          width: !isMobile
            ? `${(currentStep / (steps.length - 1)) * 100}%`
            : undefined,
          height: isMobile
            ? `${(currentStep / (steps.length - 1)) * 100}%`
            : undefined,
        }}
      />

      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-row text-start w-auto items-center gap-4 md:flex-col md:text-center md:w-full"
        >
          {/* الدائرة */}
          <div
            className={`w-10 h-10 min-w-10 rounded-full flex items-center justify-center text-white font-bold
            md:min-w-auto
        ${index <= currentStep ? "bg-secondary step-shadow" : "bg-zinc-300"}`}
          >
            {index + 1}
          </div>

          {/* النص */}
          <p
            className={`text-sm mt-0 font-medium md:mt-3
        ${index <= currentStep ? "text-primary" : "text-zinc-400"}`}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StepsAid;
