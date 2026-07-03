import { useAppSelector } from "@/redux/store";
import { PATHS } from "@/routes/paths";
import { Mail, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const { role } = useAppSelector((state) => state.auth);

  return (
    <footer className="mx-auto bg-[#213145] w-full">
      <section
        className="flex flex-col gap-12 text-[#B5C6FF] p-8 mt-12 mx-auto"
        style={{ width: "min(1450px, 100%)" }}
      >
        <article
          className="grid gap-4 place-items-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-semibold">Relife Track Aid</h3>
            <p className="text-sm text-wrap">
              منصة تقنية إنسانية تهدف لإعادة تعريف الكفاءة في توزيع المساعدات
              الدولية والمحلية، مع التركيز على الكرامة الإنسانية والعدالة
              الرقمية.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-white text-2xl font-medium">روابط سريعة</h3>

            <ul className="flex flex-col gap-3">
              <Link className="hover:underline" to={PATHS.HOME}>
                الصفحة الرئيسية
              </Link>
              <Link className="hover:underline" to={PATHS.ABOUT}>
                حولة المنصة
              </Link>
              {role === "beneficiary" && (
                <Link className="hover:underline" to={PATHS.TRACK_AID.ROOT}>
                  بدء التتبع
                </Link>
              )}
              {role === "guest" && (
                <Link className="hover:underline" to={PATHS.DONATION}>
                  تبرع الان
                </Link>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white text-2xl font-medium">تواصل معنا</h4>
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <p>info@rta-relife.org</p>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall size={18} />
              <p dir="ltr">+970 59 000 0000</p>
            </div>
          </div>
        </article>
        <div className="w-full h-0.5 bg-gray-700"></div>
        <article className="text-center w-full">
          <p>© 2026 جميع الحقوق محفوظة لمنصة RTA - Relief Track Aid</p>
        </article>
      </section>
    </footer>
  );
};

export default Footer;
