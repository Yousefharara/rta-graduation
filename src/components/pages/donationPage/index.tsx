import "./style.css";
import DonationForm from "../../organisms/donationForm";
import { MapPin } from "lucide-react";
import donationHero from "@/assets/images/Donatino-hero.png";
import foodAid from "@/assets/images/Food-Aid.png";
import medicalAid from "@/assets/images/Medical-Aid.png";
import waterAid from "@/assets/images/Water-Projects.png";
import { AvatarGroup } from "@/components/molecules/rowForm/avatarGroup";

const DonationPage = () => {
  return (
    <section className="bg-[#F8F9FF]">
      <div
        className=" mx-auto py-10 flex flex-col gap-12"
        style={{ width: "min(1250px, 90%)" }}
      >
        <article className="flex flex-col justify-between gap-8 md:flex-row">
          <section className="flex flex-col gap-4">
            <h3 className="text-[#004AC6]">عطاؤك يصنع الفرق</h3>
            <h2
              className="font-medium"
              style={{ fontSize: "clamp(22px, 5vw, 52px)" }}
            >
              شارك في كتابه قصة أمل جديده
            </h2>
            <p>
              تبرعك اليوم ليس مجرد رقم، بل هو وجبة لطفل جائع، دواء لمريض، وخيمة
              تأوي عائلة. مع Relief Track Aid، نضمن وصول كل قرش إلى مستحقيه
              بشفافية تامة.
            </p>
            <div className="p-4 bg-[#E0E9FD] border border-neutral-300 rounded-lg flex items-center gap-3">
              <AvatarGroup />
              <small className="small">
                15,000+ متبرع ساهموا في اغاثه المتضرين هذا الشهر
              </small>
            </div>
          </section>
          <section>
            <div className="donation-hero relative w-full h-full overflow-hidden rounded-md">
              <img
                className=" w-full h-full object-cover"
                src={donationHero}
                alt=""
              />
              <div className="absolute bottom-5 right-5 text-white z-10">
                <p className="text-2xl font-medium">شكرا لقلوبكم المعطاءة</p>
                <small className="text-sm">
                  حملة الشتاء تم تأمين التدفئة ل 1,200 عائلة
                </small>
              </div>
            </div>
          </section>
        </article>

        {/* // ! Grid Form */}
        <article>
          <DonationForm />
        </article>

        <article>
          <h2 className="justify-center items-center w-full text-3xl text-center mb-10 font-semibold">
            أثر تبرعاتكم في الميدان
          </h2>
          <div
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
            className="grid gap-4"
          >
            <section className="rounded-lg bg-[#F8F9FF]  border border-zinc-300 shadow-sm">
              <div className="w-full h-56 overflow-hidden rounded-t-lg ">
                <img
                  src={foodAid}
                  alt=""
                  className="w-full h-full rounded-t-lg object-cover"
                />
              </div>
              <div className="p-4 ">
                <small className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#B5C6FF]" />
                  غزة
                </small>
                <h3 className="font-semibold text-2xl">توزيع وجبات ساخنة</h3>
                <p>
                  بفضل تبرعاتكم، تمكنا من توزيع 5,000 وجبة غذائية متكاملة
                  للأطفال والعائلات المتضررة.
                </p>
              </div>
            </section>

            <section className="rounded-lg bg-[#F8F9FF]  border border-zinc-300 shadow-sm">
              <div className="w-full h-56 overflow-hidden rounded-t-lg ">
                <img
                  src={medicalAid}
                  alt=""
                  className="w-full h-full rounded-t-lg object-cover"
                />
              </div>
              <div className="p-4 ">
                <small className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#B5C6FF]" />
                  خانيونس
                </small>
                <h3 className="font-semibold text-2xl">العيادات المتنقلة</h3>
                <p>
                  تأمين الأدوية والرعاية الصحية لـ 300 مريض يومياً من خلال
                  العيادات المجهزة بدعمكم.
                </p>
              </div>
            </section>

            <section className="rounded-lg bg-[#F8F9FF]  border border-zinc-300 shadow-sm">
              <div className="w-full h-56 overflow-hidden rounded-t-lg ">
                <img
                  src={waterAid}
                  alt=""
                  className="w-full h-full rounded-t-lg object-cover"
                />
              </div>
              <div className="p-4 ">
                <small className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#B5C6FF]" />
                  الشمال
                </small>
                <h3 className="font-semibold text-2xl">حفر أبار المياه</h3>
                <p>
                  توفير مياه شرب نظيفة ومستدامة لأكثر من 10 قرى نائية كانت تعاني
                  من الجفاف الحاد.
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
};

export default DonationPage;
