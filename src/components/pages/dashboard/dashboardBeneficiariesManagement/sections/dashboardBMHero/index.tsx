import Button from "@/components/atoms/button";
import { PATHS } from "@/routes/paths";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardBMHero = () => {

    const navigate = useNavigate();

    return (
        <section className="flex flex-col gap-12"> 
            <article className="flex items-center gap-4 justify-between flex-wrap-reverse">
                <div>
                <h2 className="font-semibold" style={{fontSize: "clamp(22px, 5vw, 38px"}}>إدارة المستفيدين</h2>
                <p style={{fontSize: "clamp(14px, 5vw, 22px)"}}>إدارة وتتبع بيانات العائلات والأفراد المسجلين في النظام.</p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => navigate(PATHS.DASHBOARD.BENEFICIARY_REGISTER)}>
                <UserPlus />
                <small className="text-lg">إضافة مستفيد جديد</small>
            </Button>
            </article>

            <article className="grid gap-4" style={{gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"}}>
                <div className="rounded-md text-white px-4 py-2 flex flex-col gap-2 bg-primary">
                    <p className="">إجمالي المسجلين</p>
                    <small className="text-3xl font-semibold">1,248</small>
                </div>
                <div className="rounded-md px-4 py-2 flex flex-col gap-2 bg-[#D3E4FE]">
                    <p className="">عائلات نازحة</p>
                    <small className="text-3xl font-semibold">842</small>
                </div>
                <div className="rounded-md px-4 py-2 flex flex-col gap-2 bg-[#D3E4FE]">
                    <p className="">في انتظار التحقق</p>
                    <small className="text-3xl font-semibold">56</small>
                </div>
                <div className="rounded-md px-4 py-2 flex flex-col gap-2 bg-[#6CF8BB]">
                    <p className="">أولوية قصوى</p>
                    <small className="text-3xl font-semibold">112</small>
                </div>
            </article>
        </section>
    );
}

export default DashboardBMHero;
