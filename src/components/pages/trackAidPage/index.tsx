import { useAppSelector } from "@/redux/store";
import TrackAidForm from "../../organisms/trackAidForm";
import { Shield } from "lucide-react";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TrackAidPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("user in track");
      navigate(PATHS.TRACK_AID.USER); 
    }
  }, [navigate, user]);

  return (
    <section className="bg-[#E0E9FD] py-20">
      <div
        className="flex flex-col gap-8 mx-auto "
        style={{ width: "min(500px, 90%)" }}
      >
        <article className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-semibold">تتبع طلبك</h1>
          <p className="text-center">
            بكل سهولة وشفافية، يمكنك متابعة حالة طلب المساعدة الإنسانية الخاص بك
            في أي وقت.
          </p>
        </article>

        <article className="bg-white border border-neutral-300 rounded-lg p-8 shadow-md flex flex-col gap-6">
          <TrackAidForm />

          <div className="bg-[#E0E9FD] p-4 rounded-md">
            <div className="flex items-center gap-3">
              <Shield size={18} strokeWidth={0} fill="#004AC6" />
              <p className="text-[#004AC6] font-medium">خصوصيتك أولويتنا</p>
            </div>
            <small>
              يتم تشفير جميع البيانات المدخلة وحمايتها وفق أعلى معايير الأمان
              السيبراني العالمية لضمان سرية معلومات المستفيدين.
            </small>
          </div>
        </article>
      </div>
    </section>
  );
};

export default TrackAidPage;
