import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { IDonationForm } from "../../../@types/forms";
import "./style.css";
import Input from "../../atoms/input";
import { Heart, Lock, Shield, ShieldCheck } from "lucide-react";
import RowForm from "../../molecules/rowForm";
import Button from "../../atoms/button";

const schemaDonationFrom = Yup.object({
  donationType: Yup.string().oneOf(["A", "B"]).required(),
  budget: Yup.number().required(""),
  nameOfCard: Yup.string().required(""),
  cardNumber: Yup.string().required(""),
  endDate: Yup.date().required(""),
  CVV: Yup.number().required(""),
});

const DonationForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<IDonationForm>({ resolver: yupResolver(schemaDonationFrom) });

  const handleOnSubmit = (data: IDonationForm) => {
    console.log("Data is , ", data);
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
        <div className="flex justify-between gap-4">
          <label
            htmlFor="r1"
            className="lable-gaza  block w-full offer active border border-zinc-300 rounded-lg p-3"
          >
            <input className="peer" type="radio" name="offer" id="r1" />
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
            className=" block w-full offer active border border-zinc-300 rounded-lg p-3"
          >
            <input className="" type="radio" name="offer" id="r2" />
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
            className="block w-full rounded-lg px-4 py-3 border border-zinc-300"
          >
            <input type="radio" id="budget10" name="budget" />
            <p>10$</p>
          </label>
          <label
            htmlFor="budget50"
            className="block w-full rounded-lg px-4 py-3 border border-zinc-300"
          >
            <input type="radio" id="budget50" name="budget" />
            <p>50$</p>
          </label>
          <label
            htmlFor="budget100"
            className="block w-full rounded-lg px-4 py-3 border border-zinc-300"
          >
            <input type="radio" id="budget100" name="budget" />
            <p>100$</p>
          </label>
          <label
            htmlFor="budget500"
            className="block w-full rounded-lg px-4 py-3 border border-zinc-300"
          >
            <input type="radio" id="budget500" name="budget" />
            <p>500$</p>
          </label>
        </div>
        <div>
          <Input
            errors={errors}
            label="budget"
            register={register}
            placeholder="أو ادخل مبلغا أخر"
            type="number"
            className="!bg-[#F8F9FF]"
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
            className="!bg-[#F8F9FF]"
          />
          <RowForm<IDonationForm>
            title="رقم البطاقه"
            errors={errors}
            label="cardNumber"
            register={register}
            className="!bg-[#F8F9FF]"
          />
          <div className="flex justify-between gap-3">
            <RowForm<IDonationForm>
              title="تاريخ الانتهاء"
              errors={errors}
              label="endDate"
              register={register}
              type="date"
              className="!bg-[#F8F9FF]"
            />
            <RowForm<IDonationForm>
              title="رمز CVV"
              errors={errors}
              label="CVV"
              type="number"
              register={register}
              className="!bg-[#F8F9FF]"
            />
          </div>
          <div className="bg-zinc-300 w-full h-0.5"></div>
          <div className="flex justify-between items-center gap-4 my-3">
            <p>مبلغ المتبرع</p>
            <small className="font-medium">50.00$</small>
          </div>
          <div className="bg-zinc-300 w-full h-0.5"></div>
          <div className="flex justify-between items-center gap-4 my-3">
            <p>الإجمالي</p>
            <small className="font-semibold text-xl text-[#004AC6]">50.00$</small>
          </div>
          <Button variant="default" className="text-white w-full flex justify-center items-center">
            <div className=" flex items-center gap-3">
                <Heart size={28} fill="white" strokeWidth={0}/>
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
