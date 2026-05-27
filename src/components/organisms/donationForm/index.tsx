import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import "./style.css";
import Input from "../../atoms/input";
import { Check, Heart, Lock, ShieldCheck } from "lucide-react";
import RowForm from "../../molecules/rowForm";
import Button from "../../atoms/button";
import type { IDonationForm } from "@/@types/forms";
import { toast } from "sonner";

const schemaDonationFrom: Yup.ObjectSchema<IDonationForm> = Yup.object({
  donationCampaign: Yup.string().oneOf(["learning", "relife"]).required(),
  budget: Yup.number().required("budget is required !"),
  customBudget: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  nameOfCard: Yup.string().required(""),
  cardNumber: Yup.string().required(""),
  endDate: Yup.date().required(""),
  CVV: Yup.number().required(""),
});

const DonationForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    watch,
    register,
  } = useForm<IDonationForm>({ resolver: yupResolver(schemaDonationFrom) });

  const [budget, setBudget] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    watch((data) => {
      console.log("data, watch", data);
      const finalBudget = data.customBudget || data.budget;
      if (finalBudget) setBudget(finalBudget);
    });
  }, [watch]);

  useEffect(() => {
    if (errors) {
      console.log("Errors , ", errors);
    }
  }, [errors]);

  const handleOnSubmit = (data: IDonationForm) => {
    const finalBudget = data.customBudget || data.budget;
    console.log({
      ...data,
      budget: finalBudget,
    });
    toast.success("تمت عملية التبرع بنجاح ❤️");
  };

  return (
    <form
      className="donation-grid grid gap-8"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
      <section
        style={{ gridArea: "item1" }}
        className="bg-white border h-fit border-zinc-300 py-3 px-6 rounded-lg"
      >
        <h3>اختر الحملة</h3>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <label
            htmlFor="r1"
            className="lable-gaza flex flex-col w-full offer active border border-zinc-300 rounded-lg p-3"
          >
            <input
              className="hidden"
              defaultChecked
              value={"relife"}
              {...register("donationCampaign")}
              type="radio"
              id="r1"
            />

            <div className="lable-check-icon hidden rounded-full self-end text-end w-fit p-1 bg-[#004AC6] justify-center items-center">
              <Check size={12} strokeWidth={3} className="text-white" />
            </div>
            <h4 className="text-[#004AC6] text-sm">الأكثر احتياجا</h4>
            <p className="text-xl font-medium mb-4">إغاثة غزة العاجلة</p>
            <div className="donation-slider slider-gaza w-full h-2 bg-neutral-300 rounded-full"></div>
            <div className="flex justify-between items-center">
              <small>تم جمع 75%</small>
              <small>المستهدف 1M$</small>
            </div>
          </label>

          <label
            htmlFor="r2"
            className="flex flex-col w-full offer active border border-zinc-300 rounded-lg p-3"
          >
            <input
              className="hidden"
              value={"learning"}
              {...register("donationCampaign")}
              type="radio"
              id="r2"
            />
            <div className="lable-check-icon hidden rounded-full self-end text-end w-fit p-1 bg-[#004AC6] justify-center items-center">
              <Check size={12} strokeWidth={3} className="text-white" />
            </div>
            <h4 className="text-[#004AC6] text-sm">التعليم</h4>
            <p className="text-xl font-medium mb-4">كفالة طالب علم</p>
            <div className="donation-slider slider-learning w-full h-2 bg-neutral-300 rounded-full"></div>
            <div className="flex justify-between items-center">
              <small>تم جمع 40%</small>
              <small>المستهدف 200K$</small>
            </div>
          </label>
        </div>
      </section>

      <section
        style={{ gridArea: "item2" }}
        className="rounded-lg p-6 h-fit flex flex-col gap-3 bg-white border border-zinc-300"
      >
        <h3>حدد مبلغ التبرع</h3>
        <div className="flex justify-between gap-4">
          <label
            htmlFor="budget10"
            className={` block w-full rounded-lg px-4 py-3 border ${errors.budget?.message ? "border-rose-500" : "border-gray-300"}`}
          >
            <input
              type="radio"
              {...register("budget")}
              value={10}
              className="hidden"
              id="budget10"
            />
            <p className="text-center text-xl font-semibold">10$</p>
          </label>
          <label
            htmlFor="budget50"
            className={` block w-full rounded-lg px-4 py-3 border ${errors.budget?.message ? "border-rose-500" : "border-gray-300"}`}
          >
            <input
              type="radio"
              {...register("budget")}
              value={50}
              className="hidden"
              id="budget50"
            />
            <p className="text-center text-xl font-semibold">50$</p>
          </label>
          <label
            htmlFor="budget100"
            className={` block w-full rounded-lg px-4 py-3 border ${errors.budget?.message ? "border-rose-500" : "border-gray-300"}`}
          >
            <input
              type="radio"
              {...register("budget")}
              value={100}
              className="hidden"
              id="budget100"
            />
            <p className="text-center text-xl font-semibold">100$</p>
          </label>
          <label
            htmlFor="budget500"
            className={` block w-full rounded-lg px-4 py-3 border ${errors.budget?.message ? "border-rose-500" : "border-gray-300"}`}
          >
            <input
              type="radio"
              {...register("budget")}
              value={500}
              className="hidden"
              id="budget500"
            />
            <p className="text-center text-xl font-semibold">500$</p>
          </label>
        </div>
        <div>
          <Input
            errors={errors}
            label="customBudget"
            register={register}
            placeholder="أو ادخل مبلغا أخر"
            type="number"
            className="bg-[#F8F9FF]!"
          />
        </div>
      </section>

      <section
        style={{ gridArea: "item3" }}
        className="bg-white rounded-lg p-6 border border-zinc-300 shadow-md"
      >
        <div className="flex items-center gap-4">
          <ShieldCheck size={28} strokeWidth={2} className="text-green-600" />
          <h3 className="font-medium text-2xl">دفع أمن 100%</h3>
        </div>

        <article>
          <RowForm<IDonationForm>
            title="الاسم على البطاقه"
            errors={errors}
            label="nameOfCard"
            register={register}
            className="bg-[#F8F9FF]!"
          />
          <RowForm<IDonationForm>
            title="رقم البطاقه"
            errors={errors}
            label="cardNumber"
            register={register}
            className="bg-[#F8F9FF]!"
          />
          <div className="flex justify-between gap-3 ">
            <RowForm<IDonationForm>
              title="تاريخ الانتهاء"
              errors={errors}
              label="endDate"
              register={register}
              type="date"
              className="bg-[#F8F9FF]!"
            />
            <RowForm<IDonationForm>
              title="رمز CVV"
              errors={errors}
              label="CVV"
              type="number"
              register={register}
              className="bg-[#F8F9FF]!"
            />
          </div>
          <div className="bg-zinc-300 w-full h-0.5"></div>
          <div className="flex justify-between items-center gap-4 my-3">
            <p>مبلغ المتبرع</p>
            <small className="font-medium">{budget}$</small>
          </div>
          <div className="bg-zinc-300 w-full h-0.5"></div>
          <div className="flex justify-between items-center gap-4 my-3">
            <p>الإجمالي</p>
            <small className="font-semibold text-xl text-[#004AC6]">
              {budget}$
            </small>
          </div>
          <Button
            variant="default"
            className="text-white w-full flex justify-center items-center"
          >
            <div className=" flex items-center gap-3">
              <Heart size={28} fill="white" strokeWidth={0} />
              <p className="font-semibold">أكمل التبرع</p>
            </div>
          </Button>
          <p className="mt-3 justify-center text-xs flex items-center gap-3">
            <Lock size={15} />
            بياناتك مشفرةومحميه بأعلى معايير الأمان
          </p>
        </article>
      </section>
    </form>
  );
};

export default DonationForm;
