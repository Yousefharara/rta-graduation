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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input as InputUI } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getCampaigns } from "@/redux/slices/campaignSlice";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import { addDonationAction } from "@/redux/slices/donationSlice";

const defaultValues: IDonationForm = {
  donationCampaign: "",
  budget: 0,
  customBudget: undefined,
  nameOfCard: "",
  cardNumber: "",
  endDate: new Date(),
  CVV: 0,
};

const schemaDonationFrom: Yup.ObjectSchema<IDonationForm> = Yup.object({
  donationCampaign: Yup.string().required(),
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
    reset,
    watch,
    register,
  } = useForm<IDonationForm>({ resolver: yupResolver(schemaDonationFrom) });
  const { campaigns, isFetching, error } = useAppSelector(
    (state) => state.campaigns,
  );
  const dispatch = useAppDispatch();

  // ! State
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pendingData, setPendingData] = useState<IDonationForm | null>(null);
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
    if(campaigns.length === 0)dispatch(getCampaigns());
  }, [dispatch, campaigns]);

  useEffect(() => {
    if (campaigns) console.log("list is : ", campaigns);
  }, [campaigns]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center mt-40">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Error message={error} onRetry={() => dispatch(getCampaigns())} />
    );
  }

  

  const handleOnSubmit = (data: IDonationForm) => {
    setPendingData(data);
    setOpen(true);
  };

  const confirmDonation = () => {
    if (!pendingData) return;

    const finalBudget = pendingData.customBudget || pendingData.budget;

    console.log({
      ...pendingData,
      budget: finalBudget,
      email,
    });

    dispatch(addDonationAction({
      ...pendingData,
      amount: finalBudget,
      currency: "USD",
      guest_email: email
    }))

    toast.success("تمت عملية التبرع بنجاح ❤️");

    reset(defaultValues);

    setBudget(0);

    setEmail("");
    setPendingData(null);
    setOpen(false);
  };

  return (
    <>
      <form
        className="donation-grid grid gap-8"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <section
          style={{ gridArea: "item1" }}
          className="bg-white border h-fit border-zinc-300 py-3 px-6 rounded-lg"
        >
          <h3>اختر الحملة</h3>
          <div className="grid gap-4" style={{gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"}}>

            {campaigns.map(campaign => (
              <label
              key={campaign.id}
              htmlFor={campaign.title + campaign.id}
              className="lable-gaza flex flex-col w-full offer active border border-zinc-300 rounded-lg p-3"
            >
              <input
                className="hidden"
                defaultChecked
                value={campaign.title}
                {...register("donationCampaign")}
                type="radio"
                id={campaign.title + campaign.id}
              />

              <div className="lable-check-icon hidden rounded-full self-end text-end w-fit p-1 bg-[#004AC6] justify-center items-center">
                <Check size={12} strokeWidth={3} className="text-white" />
              </div>
              <h4 className="text-[#004AC6] text-sm">{campaign.title}</h4>
              <p className="text-xl font-medium mb-4">{campaign.description}</p>
              <div className="slider-color slider-gaza w-full h-2 bg-neutral-300 rounded-full"></div>
              <div className="flex justify-between items-center">
                <small>تم جمع {Math.round((campaign.collected_amount + 10000 / campaign.target_amount) * 100)}%</small>
                <small>المستهدف {campaign.target_amount}$</small>
              </div>
            </label>
            ))}


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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>هل ترغب بإضافة بريد إلكتروني؟</DialogTitle>

            <DialogDescription>
              سنرسل لك إشعارًا بحالة التبرع لاحقًا (اختياري)
            </DialogDescription>
          </DialogHeader>

          <InputUI
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <DialogFooter>
            <Button type="button" onClick={confirmDonation}>
              متابعة التبرع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationForm;
