import React from "react";
import TrackAidForm from "../../organisms/trackAidForm";
import { Shield } from "lucide-react";

const TrackAidPage = () => {
  return (
    <section className="bg-[#E0E9FD] py-20">
      <div
        className="flex flex-col gap-8 mx-auto "
        style={{ width: "min(500px, 90%)" }}
      >
        <article className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-semibold">تتبع طلبك</h1>
          <p className="text-center">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
            iste dicta, dolorem asperiores ullam molestiae.
          </p>
        </article>

        <article className="bg-white border border-neutral-300 rounded-lg p-8 shadow-md flex flex-col gap-6">
          <TrackAidForm />

          <div className="bg-[#E0E9FD] p-4 rounded-md">
          <div className="flex items-center gap-3">
            <Shield size={18} strokeWidth={0} fill="#004AC6"/>
            <p className="text-[#004AC6] font-medium">خصوصيتك أولويتنا</p>
          </div>
          <small>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi
            dolore vitae consequatur architecto quas in.
          </small>
        </div>
        </article>

        
      </div>
    </section>
  );
};

export default TrackAidPage;
