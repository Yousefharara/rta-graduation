import Button from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getAreas } from "@/redux/slices/areaSlice";
import { editBeneficiaryAction } from "@/redux/slices/beneficiarySlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";

interface IEditBeneficiaryForm {
  area_id: number;
  family_size: number;
  income: string;
  patients_count: number;
  disabled_count: number;
  release_date: string;
  password: string;
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const schema: Yup.ObjectSchema<IEditBeneficiaryForm> = Yup.object({
  area_id: Yup.number().required("المنطقة مطلوبة"),
  family_size: Yup.number()
    .required("حجم الأسرة مطلوب")
    .min(1, "يجب أن يكون على الأقل 1"),
  income: Yup.string().required("الدخل مطلوب"),
  patients_count: Yup.number()
    .required("عدد المرضى مطلوب")
    .min(0, "لا يمكن أن يكون سالباً"),
  disabled_count: Yup.number()
    .required("عدد ذوي الإعاقة مطلوب")
    .min(0, "لا يمكن أن يكون سالباً"),
  release_date: Yup.string().required("تاريخ الإصدار مطلوب"),
  password: Yup.string().min(6, "خطأ ").required(),
});

const EditBeneficiaryDialog = ({ open, setOpen }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { beneficiary } = useAppSelector((state) => state.beneficiaries);
  const { areas } = useAppSelector((state) => state.areas);
  const { accessToken } = useAppSelector((state) => state.auth);
  const { isUpdating } = useAppSelector((state) => state.beneficiaries);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<IEditBeneficiaryForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open && beneficiary) {
      reset({
        area_id: beneficiary.area_id,
        family_size: beneficiary.family_size,
        income: beneficiary.income,
        patients_count: beneficiary.patients_count,
        disabled_count: beneficiary.disabled_count,
        release_date: new Date(beneficiary.release_date)
          .toISOString()
          .split("T")[0],
        password: "",
      });
    }
  }, [open, beneficiary, reset]);

  useEffect(() => {
    if (open && accessToken) {
      dispatch(getAreas(accessToken));
    }
  }, [open, accessToken, dispatch]);

  const handleOnSubmit = async (data: IEditBeneficiaryForm) => {
    if (!beneficiary || !accessToken) {
      toast.error("لم يتم العثور على بيانات المستفيد");
      return;
    }

    const result = await dispatch(
      editBeneficiaryAction(
        {
          ...beneficiary,
          area_id: data.area_id,
          family_size: data.family_size,
          income: data.income,
          patients_count: data.patients_count,
          disabled_count: data.disabled_count,
          release_date: new Date(data.release_date),
          password: data.password || undefined,
        } as any,
        accessToken,
      ),
    );

    if (result?.success) {
      setOpen(false);
      toast.success("تم تعديل البيانات بنجاح");
    } else {
      toast.error("حدث خطأ أثناء تعديل البيانات");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-[#EFF4FF] h-140 overflow-y-auto ">
        <DialogHeader className="mt-10 px-6 text-start!">
          <DialogTitle dir="rtl">تعديل بيانات المستفيد</DialogTitle>
          <DialogDescription dir="rtl">
            قم بتعديل البيانات التي ترغب في تحديثها
          </DialogDescription>
        </DialogHeader>

        <form
          className="bg-white p-6 flex flex-col gap-4 rounded-b-md"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">المنطقة</label>
            <select
              className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4 border ${errors.area_id ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
              {...register("area_id", { valueAsNumber: true })}
            >
              <option value="">اختر المنطقة</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
            {errors.area_id && (
              <span className="text-sm text-rose-600">
                {errors.area_id.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">حجم الأسرة</label>
            <input
              type="number"
              className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4 border ${errors.family_size ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
              {...register("family_size", { valueAsNumber: true })}
            />
            {errors.family_size && (
              <span className="text-sm text-rose-600">
                {errors.family_size.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">الدخل</label>
            <input
              type="text"
              className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4 border ${errors.income ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
              {...register("income")}
            />
            {errors.income && (
              <span className="text-sm text-rose-600">
                {errors.income.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">عدد المرضى</label>
            <input
              type="number"
              className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4 border ${errors.patients_count ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
              {...register("patients_count", { valueAsNumber: true })}
            />
            {errors.patients_count && (
              <span className="text-sm text-rose-600">
                {errors.patients_count.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">عدد ذوي الإعاقة</label>
            <input
              type="number"
              className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4 border ${errors.disabled_count ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
              {...register("disabled_count", { valueAsNumber: true })}
            />
            {errors.disabled_count && (
              <span className="text-sm text-rose-600">
                {errors.disabled_count.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">تاريخ الإصدار</label>
            <input
              type="date"
              className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4 border ${errors.release_date ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
              {...register("release_date")}
            />
            {errors.release_date && (
              <span className="text-sm text-rose-600">
                {errors.release_date.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="اتركه فارغاً إذا لم ترد التغيير"
                className={`w-full px-4 py-3 bg-transparent text-sm rounded-md outline-offset-4 border pl-10 ${
                  errors.password
                    ? "outline-rose-500 border-rose-500"
                    : "outline-gray-300 border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-rose-600">
                {String(errors.password.message)}
              </span>
            )}
          </div>

          <DialogFooter className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              disabled={isUpdating}
              className="disabled:bg-zinc-300 disabled:cursor-not-allowed"
              type="submit"
            >
              {isUpdating ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBeneficiaryDialog;
