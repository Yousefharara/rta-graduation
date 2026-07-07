import { Helmet } from "react-helmet-async";
import ContactForm from "../../organisms/contactForm";
import { Mail, Phone } from "lucide-react";

const ContactusPage = () => {
  return (
    <>
      <Helmet>
        <title>تواصل معنا RTA</title>
      </Helmet>

      <section className="flex flex-col gap-8 mb-8">
        <article className="min-h-80 flex flex-col justify-center items-center gap-4 bg-[#E0E9FD]">
          <h2 className="text-5xl font-semibold text-[#004AC6]">تواصل معنا</h2>
          <p className="text-center text-[#213145]">
            نحن هنا للإجابة على استفساراتكم وضمان وصول المساعدات لكل من يحتاجها
            بكل شفافية وموثوقية.
          </p>
        </article>
        <article
          className="flex flex-col justify-between mx-auto gap-4 md:flex-row"
          style={{ width: "min(1200px, 95%)" }}
        >
          <div className="basis-3/5">
            <h3>أرسل لنا رسالة</h3>
            <ContactForm />
          </div>
          <div className="bg-[#004AC6] p-8 flex flex-col gap-4 text-white h-fit rounded-lg">
            <h3 className="text-3xl font-medium">معلومات الاتصال المباشر</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex gap-4 items-center">
                <div className="flex justify-center items-center rounded-md p-3 bg-[#195CCC]">
                  <Mail className="" size={18} />
                </div>
                <div>
                  <small>البريد الالكتروني</small>
                  <p>contact@relieftrackaid.org</p>
                </div>
              </li>
              <li className="flex gap-4 items-center">
                <div className="flex justify-center items-center rounded-md p-3 bg-[#195CCC]">
                  <Phone size={18} />
                </div>
                <div>
                  <small>رقم الهاتف</small>
                  <p dir="ltr">+970 800 123 4567</p>
                </div>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </>
  );
};

export default ContactusPage;
