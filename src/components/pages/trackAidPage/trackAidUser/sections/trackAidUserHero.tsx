import Button from "@/components/atoms/button";
import StepsAid from "@/components/organisms/setps";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Pencil,
  Search,
  SquareRoundCorner,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ISendOrderForm } from "@/@types/forms";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCurrentStep } from "@/redux/slices/beneficiaryAidStepSlice";
import { getBeneficiary } from "@/redux/slices/beneficiarySlice";
import {
  createBeneficiaryOrderAction,
  getBeneficiaryOrders,
} from "@/redux/slices/beneficiaryOrderSlice";
import { createNotificationAction } from "@/redux/slices/notificationSlice";
import ComplaintDialog from "./complaintDialog";
import EditBeneficiaryDialog from "./editBeneficiaryDialog";
import { getAreas } from "@/redux/slices/areaSlice";

const defaultValues: ISendOrderForm = {
  reason: "",
  typeAid: "",
};

const TrackAidUserHero = () => {
  const [open, setOpen] = useState(false);
  const [openComplaint, setOpenComplaint] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { currentStep } = useAppSelector((state) => state.beneficiaryAidStep);

  const { user, accessToken, beneficiary } = useAppSelector(
    (state) => state.auth,
  );
  const { isCreating, orders } = useAppSelector(
    (state) => state.beneficiaryOrders,
  );
  const { aidTypes } = useAppSelector((state) => state.aidTypes);
  const { beneficiaryAids } = useAppSelector((state) => state.beneficiaryAids);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (beneficiary && accessToken) {
      dispatch(getBeneficiary(Number(beneficiary?.id), accessToken));
      dispatch(getAreas(accessToken));
      console.log("get areas : ");
    }
  }, [dispatch, beneficiary, accessToken]);

  // Fetch dynamic aid types, beneficiary orders and aids
  useEffect(() => {
    if (accessToken) {
      dispatch(getBeneficiaryOrders(accessToken));
    }
  }, [dispatch, accessToken]);

  // Find latest order for the current beneficiary
  const latestOrder = useMemo(() => {
    if (!beneficiary || !orders.length) return null;
    const userOrders = orders.filter(
      (o) => o.beneficiary_id === beneficiary.id,
    );
    if (!userOrders.length) return null;
    return [...userOrders].sort((a, b) => b.id - a.id)[0];
  }, [orders, beneficiary]);

  const latestOrderAid = useMemo(() => {
    if (!latestOrder) return null;
    return beneficiaryAids.find((a) => a.order_id === latestOrder.id);
  }, [latestOrder, beneficiaryAids]);

  // Helper to map order and aid status to Arabic label
  const getStatusText = (orderStatus: string, aidStatus?: string) => {
    if (orderStatus === "rejected" || aidStatus === "rejected") return "مرفوض";
    if (orderStatus === "pending") return "قيد الانتظار";
    if (orderStatus === "approved") {
      if (!aidStatus || aidStatus === "approved") return "تمت الموافقة";
      if (aidStatus === "preparing") return "جاري التجهيز";
      if (aidStatus === "shipping") return "جاري التوزيع";
      if (aidStatus === "delivered") return "تم التوصيل";
    }
    return orderStatus;
  };

  const showStepsSection = useMemo(() => {
    if (!latestOrder) return false;
    if (latestOrder.status === "rejected") return false;
    if (latestOrderAid && latestOrderAid.status === "rejected") return false;
    return true;
  }, [latestOrder, latestOrderAid]);

  // Update current step based on latest order and aid status
  useEffect(() => {
    if (latestOrder) {
      if (
        latestOrder.status === "rejected" ||
        (latestOrderAid && latestOrderAid.status === "rejected")
      ) {
        dispatch(setCurrentStep(4)); // Reset step so new order can be added
      } else {
        if (latestOrder.status === "pending") {
          dispatch(setCurrentStep(0));
        } else if (latestOrder.status === "approved") {
          if (!latestOrderAid || latestOrderAid.status === "approved") {
            dispatch(setCurrentStep(1));
          } else if (latestOrderAid.status === "preparing") {
            dispatch(setCurrentStep(2));
          } else if (latestOrderAid.status === "shipping") {
            dispatch(setCurrentStep(3));
          } else if (latestOrderAid.status === "delivered") {
            dispatch(setCurrentStep(4));
          }
        }
      }
    } else {
      dispatch(setCurrentStep(4)); // default to step 4 so user can request
    }
  }, [dispatch, latestOrder, latestOrderAid]);

  const schemaSendOrderFrom: Yup.ObjectSchema<ISendOrderForm> = Yup.object({
    reason: Yup.string().min(5).required("السبب مطلوب"),
    typeAid: Yup.string().required("نوع المساعدة مطلوب"),
  });

  const {
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm<ISendOrderForm>({ resolver: yupResolver(schemaSendOrderFrom) });

  const messageError = errors["reason"]?.message;
  const messageTypeAidError = errors["typeAid"]?.message;

  const handleOnSubmit = async (data: ISendOrderForm) => {
    if (!beneficiary) {
      toast.error("لم يتم العثور على بيانات المستفيد");
      return;
    }

    const selectedAid = aidTypes.find((a) => a.name === data.typeAid);
    const aidTypeId = selectedAid ? selectedAid.id : 1;

    const result = await dispatch(
      createBeneficiaryOrderAction(
        {
          beneficiary_id: beneficiary.id,
          aid_type_id: Number(aidTypeId),
          description: data.reason,
        },
        accessToken || "",
      ),
    );

    if (result?.success) {
      setOpen(false);
      toast.success("تمت عملية الطلب بنجاح ❤️");
      reset(defaultValues);
      dispatch(
        createNotificationAction(
          {
            user_id: user?.id || 1,
            title: "طلب مساعدة جديد",
            message: `تم تقديم طلب مساعدة جديدة من ${beneficiary?.users?.name || "مستفيد"}: ${data.typeAid}`,
          },
          accessToken || "",
        ),
      );
    } else {
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً");
    }
  };

  if (!user) return null;

  return (
    <>
      <section className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h3 className="text-2xl font-medium">نتائج البحث عن الطلب</h3>
          <p>عرض تفاصيل الطلب المرتبط برقم الهويه المدخل</p>
        </div>
        <div className="rounded-full flex items-center gap-2 bg-primary/10 py-2 px-3">
          <Search size={15} />
          <small>رقم الهويه: {beneficiary?.national_id}</small>
        </div>
      </section>

      <section className="rounded-lg bg-white border border-zinc-300 px-6 py-4 flex flex-wrap justify-between gap-4 items-center">
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center p-2 rounded-full bg-muted">
            <Truck size={30} />
          </div>
          <div className="flex flex-col gap-1">
            {latestOrder ? (
              <>
                <div className="flex gap-2 items-center">
                  <p>طلب رقم: #RT-{latestOrder.id}</p>
                  <small
                    className={`text-center rounded-full bg-muted px-3 py-0.5  ${latestOrder.status === "rejected" || latestOrderAid?.status === "rejected" ? "bg-rose-500 text-white" : "bg-muted"} `}
                  >
                    {getStatusText(latestOrder.status, latestOrderAid?.status)}
                  </small>
                </div>
                <p>
                  تاريخ إنشاء الطلب:{" "}
                  {latestOrder.created_at.toString().split("T")[0]}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  لا يوجد طلبات مساعدة نشطة حالياً
                </p>
                <p className="text-sm text-zinc-500">
                  يمكنك إضافة طلب جديد بالضغط على زر "إضافة طلب جديد"
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setOpenComplaint(true)}
            className="flex gap-3 items-center font-semibold disabled:bg-zinc-600 disabled:text-white disabled:cursor-not-allowed disabled:border-none"
            variant="outline"
            disabled={beneficiary?.status !== "eligible"}
          >
            تقديم شكوى
          </Button>
          <Button
            onClick={() => setOpenEdit(true)}
            className="flex gap-3 items-center font-semibold"
            variant="outline"
            style={{ minWidth: "fit-content" }}
          >
            تعديل البيانات
            <Pencil />
          </Button>
          <Button
            onClick={() => setOpen(true)}
            className="flex gap-3 items-center font-semibold disabled:bg-zinc-600 disabled:text-white disabled:cursor-not-allowed disabled:border-none"
            disabled={beneficiary?.status !== "eligible"}
            style={{ minWidth: "fit-content" }}
          >
            أضافة طلب جديد
            <SquareRoundCorner />
          </Button>
        </div>
        {beneficiary?.status !== "eligible" && (
          <p className="text-amber-600 text-sm w-full text-center">
            حسابك قيد المراجعة. لا يمكنك طلب مساعدة أو تقديم شكوى حتى يتم توثيق
            حسابك.
          </p>
        )}
      </section>

      {showStepsSection && (
        <section className="flex flex-col gap-8 bg-white rounded-lg border border-zinc-300 px-6 py-4">
          <div className="flex items-center gap-3">
            <LineChart className="text-primary" />
            <p>الجدول الزمني للتقدم</p>
          </div>
          <StepsAid />
        </section>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-[#EFF4FF]">
          <DialogHeader className="mt-10 px-6 text-start!">
            <DialogTitle dir="rtl">تقديم طلب مساعدة جديد</DialogTitle>

            <DialogDescription dir="rtl" className="">
              يرجى تعبئة النموذج أدناه بدقة لضمان سرعة معالجة طلبكم والوصول إلى
              المساعدات المطلوبة.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 px-6 flex-wrap">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 11L10.85 6.95C10.3333 6.45 9.89583 5.89583 9.5375 5.2875C9.17917 4.67917 9 4.01667 9 3.3C9 2.38333 9.32083 1.60417 9.9625 0.9625C10.6042 0.320833 11.3833 0 12.3 0C12.8333 0 13.3333 0.1125 13.8 0.3375C14.2667 0.5625 14.6667 0.866667 15 1.25C15.3333 0.866667 15.7333 0.5625 16.2 0.3375C16.6667 0.1125 17.1667 0 17.7 0C18.6167 0 19.3958 0.320833 20.0375 0.9625C20.6792 1.60417 21 2.38333 21 3.3C21 4.01667 20.825 4.67917 20.475 5.2875C20.125 5.89583 19.6917 6.45 19.175 6.95L15 11ZM15 8.2L17.725 5.525C18.0417 5.20833 18.3333 4.87083 18.6 4.5125C18.8667 4.15417 19 3.75 19 3.3C19 2.93333 18.875 2.625 18.625 2.375C18.375 2.125 18.0667 2 17.7 2C17.4667 2 17.2458 2.04583 17.0375 2.1375C16.8292 2.22917 16.65 2.36667 16.5 2.55L15 4.35L13.5 2.55C13.35 2.36667 13.1708 2.22917 12.9625 2.1375C12.7542 2.04583 12.5333 2 12.3 2C11.9333 2 11.625 2.125 11.375 2.375C11.125 2.625 11 2.93333 11 3.3C11 3.75 11.1333 4.15417 11.4 4.5125C11.6667 4.87083 11.9583 5.20833 12.275 5.525L15 8.2ZM6 16.5L12.95 18.4L18.9 16.55C18.8167 16.4 18.6958 16.2708 18.5375 16.1625C18.3792 16.0542 18.2 16 18 16H12.95C12.5 16 12.1417 15.9833 11.875 15.95C11.6083 15.9167 11.3333 15.85 11.05 15.75L8.725 14.975L9.275 13.025L11.3 13.7C11.5833 13.7833 11.9167 13.85 12.3 13.9C12.6833 13.95 13.25 13.9833 14 14C14 13.8167 13.9458 13.6417 13.8375 13.475C13.7292 13.3083 13.6 13.2 13.45 13.15L7.6 11H6V16.5ZM0 20V9H7.6C7.71667 9 7.83333 9.0125 7.95 9.0375C8.06667 9.0625 8.175 9.09167 8.275 9.125L14.15 11.3C14.7 11.5 15.1458 11.85 15.4875 12.35C15.8292 12.85 16 13.4 16 14H18C18.8333 14 19.5417 14.275 20.125 14.825C20.7083 15.375 21 16.1 21 17V18L13 20.5L6 18.55V20H0ZM2 18H4V11H2V18Z"
                fill="#004AC6"
              />
            </svg>
            <p>تقديم طلب مساعدة جديد</p>
          </div>

          <form
            className="bg-white p-6 flex flex-col gap-2 rounded-b-md"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="flex flex-col gap-2 my-4 w-full">
              <label className="text-sm font-semibold">
                {" "}
                نوع المساعدة المطلوبة
              </label>

              <select
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${messageTypeAidError ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                defaultValue=""
                {...register("typeAid")}
              >
                <option disabled value="select">
                  Select
                </option>
                {aidTypes.map((aid) => (
                  <option key={aid.id} value={aid.name}>
                    {aid.name}
                  </option>
                ))}
              </select>
              {messageTypeAidError && (
                <span className="text-sm text-rose-600">
                  {messageTypeAidError}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 my-4">
              <label className="text-sm font-semibold">سبب طلب المساعدة</label>

              <textarea
                {...register("reason")}
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${messageError ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                placeholder="يرجى شرح الحالة الإنسانية أو الظروف التي تستدعي طلب المساعدة..."
                rows={5}
              ></textarea>

              {messageError && (
                <span className="text-sm text-rose-600">
                  {String(messageError)}
                </span>
              )}
            </div>

            <DialogFooter className="flex items-center flex-wrap gap-2">
              <p className="text-red-600">
                {currentStep < 4 && "لديك طلب بالفعل !!"}
              </p>
              <Button
                disabled={currentStep !== 4 || isCreating}
                className="disabled:bg-zinc-300 disabled:cursor-not-allowed"
                type="submit"
              >
                {isCreating ? "جاري الإرسال..." : "ارسال الطلب"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ComplaintDialog open={openComplaint} setOpen={setOpenComplaint} />
      <EditBeneficiaryDialog open={openEdit} setOpen={setOpenEdit} />
    </>
  );
};

export default TrackAidUserHero;
