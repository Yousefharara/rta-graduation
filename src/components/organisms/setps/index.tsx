import './setps.css'

const steps = [
    "قيد المراجعة",
  "تم الموافقه",
  "تم تجهيز المساعدة",
  "جاري التوزيع",
  "تم التوصيل",
];

const currentStep = 2;

const StepsAid = () => {
  return (
    // <div className="flex flex-col gap-6">
    //     {steps.map((step, index) => (
    //         <div key={index} className="flex items-start gap-4">

    //             <div className="flex flex-col items-center">
    //                 <div
    //                     className={`w-10 h-10 rounded-full flex items-center justify-center text-white
    //                             ${index <= currentStep
    //                             ? "bg-blue-600"
    //                             : "bg-zinc-300"
    //                         }`}
    //                 >
    //                     {index + 1}
    //                 </div>

    //                 {index !== steps.length - 1 && (
    //                     <div
    //                         className={`w-1 h-16 ${index < currentStep
    //                             ? "bg-blue-600"
    //                             : "bg-zinc-300"
    //                             }`}
    //                     />
    //                 )}
    //             </div>

    //             <div>
    //                 <p
    //                     className={`font-medium ${index <= currentStep
    //                         ? "text-black"
    //                         : "text-zinc-400"
    //                         }`}
    //                 >
    //                     {step}
    //                 </p>
    //             </div>
    //         </div>
    //     ))}
    // </div>
    <div dir="ltr" className="relative flex items-center justify-between w-full z-0">
      {/* الخط الخلفي */}
      <div className="absolute top-5 left-0 w-full h-1 bg-zinc-300 -z-10" />

      {/* الخط النشط */}
      <div
        className="absolute top-5 left-0 h-1 bg-secondary -z-10 transition-all"
        style={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
      />

      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center w-full"
        >
          {/* الدائرة */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
        ${index <= currentStep ? "bg-secondary step-shadow" : "bg-zinc-300"}`}
          >
            {index + 1}
          </div>

          {/* النص */}
          <p
            className={`mt-3 text-sm font-medium
        ${index <= currentStep ? "text-primary font-medium" : "text-zinc-400"}`}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StepsAid;
