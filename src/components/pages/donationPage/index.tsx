import React from "react";
import "./style.css";
import DonationForm from "../../organisms/donationForm";
import { MapPin } from "lucide-react";

const DonationPage = () => {
  return (
    <section className="bg-[#F8F9FF]">
      <div className=" mx-auto py-10 flex flex-col gap-12" style={{ width: "min(1250px, 90%)" }}>
        <article className="flex flex-col justify-between gap-8 md:flex-row">
          <section className="flex flex-col gap-4">
            <h3 className="text-[#004AC6]">عطاؤك يصنع الفرق</h3>
            <h2 className="font-medium" style={{fontSize: "clamp(22px, 5vw, 52px)"}}>شارك في كتابه فصه أمل جديده</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est,
              adipisci ipsum qui saepe eveniet harum consectetur earum hic
              laborum mollitia!
            </p>
            <div className="p-4 bg-[#E0E9FD] border border-neutral-300 rounded-lg">
              <div></div>
              <small className="small">15,000+ متبرع ساهموا في اغاثه المتضرين هذا الشهر</small>
            </div>
          </section>
          <section>
            <div className="donation-hero relative w-full h-full overflow-hidden rounded-md">
              <img
                className=" w-full h-full object-cover"
                src="/Donatino hero.png"
                alt=""
              />
              <div className="absolute bottom-5 right-5 text-white z-10">
                <p className="text-2xl font-medium">شكرا لقلوبكم المعطاءة</p>
                <small className="text-sm">حملة الشتاء تم تأمين التدفئة ل 1,200 عائلة</small>
              </div>
            </div>
          </section>
        </article>

{/* // ! Grid Form */}
        <article>
            <DonationForm />
        </article>

        <article>
            <h2>أثر تبرعاتكم في الميدان</h2>
            <div>
                <section className="rounded-lg bg-[#F8F9FF] border border-zinc-300 shadow-sm">
                    <div className="w-full overflow-hidden rounded-t-lg ">
                        <img src="./" alt="" className="w-full h-full rounded-t-lg object-cover" />
                    </div>
                    <div>
                        <small>
                            <MapPin />
                            الشمال
                        </small>
                        <h3>حفر أبار المياه</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, reprehenderit?</p>
                    </div>
                </section>
            </div>
        </article>
      </div>
    </section>
  );
};

export default DonationPage;
