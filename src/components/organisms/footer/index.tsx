import { Mail, PhoneCall } from "lucide-react";

const Footer = () => {
  return (
    <section className="flex flex-col gap-12 bg-[#213145] text-[#B5C6FF] p-8">
      <article
        className="grid gap-4 place-items-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold">Relife Track Aid</h3>
          <p className="text-sm">
            منصة تقنية إنسانية تهدف لإعادة تعريف الكفاءة في توزيع المساعدات
            الدولية والمحلية، مع التركيز على الكرامة الإنسانية والعدالة الرقمية.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white text-2xl font-medium">روابط سريعة</h3>

          <ul className="flex flex-col gap-3">
            <li>كيفيه التبرع</li>
            <li>تقارير الشفافيه</li>
            <li>الأسئله الشائعه</li>
            <li>سياسه الخصوصيه</li>
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
        <p>
          © 2026 جميع الحقوق محفوظة لمنصة RTA - Relief Track Aid
        </p>
      </article>
    </section>
  );
};

export default Footer;
