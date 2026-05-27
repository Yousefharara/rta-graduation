import {
  Box,
  Check,
  MapPin,
  MessageSquare,
  Package2,
  Phone,
} from "lucide-react";
import map from "@/assets/trackAid/map.png";
import avatar from "@/assets/trackAid/Driver.png";
import './description.css'

const TrackAidUserDescription = () => {
  return (
    <section className="description-grid grid gap-8" >
      <article className="flex flex-col gap-3 p-8 bg-white border border-zinc-300 rounded-lg" style={{"gridArea": "item1"}}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Box className="text-primary" size={18} />
            <p>محتويات المساعدة</p>
          </div>
          <p className="px-4 py-1 bg-secondary/20 font-semibold rounded-full flex justify-center items-center">
            طرد غذائي متكامل
          </p>
        </div>

        <div>
          <article className="rounded-lg flex items-center gap-3 bg-secondary/10 border border-zinc-300 w-fit py-4 px-8">
            <div className="bg-white flex justify-center items-center rounded-md p-3 w-fit">
              <Package2 className="text-secondary" />
            </div>
            <div className="flex flex-col">
              <small className="text-sm">الكمية</small>
              <small className="text-lg font-medium">3 صناديق كبيرة</small>
            </div>
          </article>
        </div>

        <div className="w-full h-0.5 bg-zinc-300"></div>

        <div className="flex flex-col gap-3">
          <p>قائمة المحتويات المتوقعة:</p>
          <article className="flex justify-between gap-4 flex-wrap">
            <div className="flex gap-3 items-center">
              <Check className="text-secondary" />
              <p>أرز (10 كجم)</p>
            </div>
            <div className="flex gap-3 items-center">
              <Check className="text-secondary" />
              <p>أرز (10 كجم)</p>
            </div>
            <div className="flex gap-3 items-center">
              <Check className="text-secondary" />
              <p>أرز (10 كجم)</p>
            </div>
            <div className="flex gap-3 items-center">
              <Check className="text-secondary" />
              <p>أرز (10 كجم)</p>
            </div>
            <div className="flex gap-3 items-center">
              <Check className="text-secondary" />
              <p>أرز (10 كجم)</p>
            </div>
            <div className="flex gap-3 items-center">
              <Check className="text-secondary" />
              <p>أرز (10 كجم)</p>
            </div>
          </article>
        </div>
      </article>

      <article className="rounded-lg p-4 bg-red-600/10 h-fit" style={{"gridArea": "item2"}}>
        <h3 className="text-red-800 font-semibold text-lg">تنبيه هام</h3>
        <p className="font-medium">
          يرجى التأكد من إحضار الهوية الوطنية الأصلية عند الاستلام. لن يتم تسليم
          المساعدة لأي طرف ثالث دون تفويض مسبق موثق من خلال المنصة.
        </p>
      </article>

      <article className="flex flex-col gap-4 w-fit bg-white rounded-lg border border-zinc-300 p-8" style={{"gridArea": "item3"}}>
        <div className="flex items-center gap-3">
          <MapPin />
          <p>نقطة التوزيع</p>
        </div>
        <div>
          <p>مركز إغاثة "النور" - حي الرمال</p>
          <p>شارع الشهداء ،بجوار مستشفى اصدقاء المريض ، الطابق الأرضي.</p>
        </div>
        <div className="w-fit h-56 overflow-hidden rounded-lg">
          <img className="w-full h-full object-cover" src={map} alt="" />
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-3 items-center">
            <img src={avatar} alt="" />
            <div>
              <small>مندوب التوصيل</small>
              <p>أحمد المسلمي</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone />
            <MessageSquare />
          </div>
        </div>
      </article>
    </section>
  );
};

export default TrackAidUserDescription;
