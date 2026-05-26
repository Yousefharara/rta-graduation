
const steps = [
    "تم استلام الطلب",
    "قيد المراجعة",
    "تم تجهيز المساعدة",
    "تم التوصيل",
];

const currentStep = 2;

const StepsAid = () => {

    return (
        <div className="flex flex-col gap-6">
            {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">

                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                                    ${index <= currentStep
                                    ? "bg-blue-600"
                                    : "bg-zinc-300"
                                }`}
                        >
                            {index + 1}
                        </div>

                        {index !== steps.length - 1 && (
                            <div
                                className={`w-1 h-16 ${index < currentStep
                                    ? "bg-blue-600"
                                    : "bg-zinc-300"
                                    }`}
                            />
                        )}
                    </div>

                    <div>
                        <p
                            className={`font-medium ${index <= currentStep
                                ? "text-black"
                                : "text-zinc-400"
                                }`}
                        >
                            {step}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StepsAid;
