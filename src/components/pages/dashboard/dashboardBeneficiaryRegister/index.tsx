import * as Yup from "yup";
import type { IRegisterBeneficiaryForm } from "@/@types/forms";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RowForm from "@/components/molecules/rowForm";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  addBeneficiaryAction,
  editBeneficiaryAction,
} from "@/redux/slices/beneficiarySlice";
import { editUserAction } from "@/redux/slices/userSlice";
import { generateRandomEmail, generateRandomPassword } from "@/utils/utils";
import { useBeneficiaryValidation } from "@/hooks/useBeneficiaryValidation";
import { toast } from "sonner";
import { INPUTS_TYPE_ERROR } from "@/constants/forms";
import Spinner from "@/components/feedback/Spinner";
import { getAreas } from "@/redux/slices/areaSlice";
import { getGovernorates } from "@/redux/slices/governorateSlice";
import { useLocation, useNavigate } from "react-router-dom";
import type { IBeneficiary } from "@/@types/beneficiary";
import { PATHS } from "@/routes/paths";
import { Eye, EyeOff } from "lucide-react";

const defaultValues: IRegisterBeneficiaryForm = {
  name: "",
  disabled_count: 0,
  area_id: 1,
  family_size: 0,
  national_id: "",
  password: "",
  patients_count: 0,
  phone: "",
  is_displaced: false,
  income: 0,
  email: "",
  release_date: new Date().toISOString(),
};

const schemaRegisterBeneficiaryFrom: Yup.ObjectSchema<IRegisterBeneficiaryForm> =
  Yup.object({
    name: Yup.string().min(3, "الاسم غير صحيح").required("الاسم مطلوب"),
    password: Yup.string().required("كلمة المرور مطلوبة"),

    phone: Yup.string().min(10, "الرقم غير صحيح").required("رقم الهاتف مطلوب"),
    national_id: Yup.string()
      .length(9, "رقم الهوبة غير صحيح")
      .required("رقم الهويه مطلوبه"),
    release_date: Yup.string().required("رقم الهويه مطلوبه"),
    area_id: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? -1 : value))
      .required("المحافظه مطلوب"),

    family_size: Yup.number().min(1).required("عدد أفراد الأسرة مطلوب"),
    income: Yup.number().required("الدخل مطلوب"),
    patients_count: Yup.number()
      .required("عدد المرضى مطلوب")
      .min(0, "لا يمكن أن يكون سالباً")
      .test(
        "max-family",
        "عدد المرضى يجب أن يكون أقل من أو يساوي عدد أفراد الأسرة",
        function (value) {
          const { family_size } = this.parent;
          if (!family_size || value == null) return true;
          return value <= family_size;
        },
      ),

    disabled_count: Yup.number()
      .min(0, "لا يمكن أن يكون سالباً")
      .test(
        "max-family",
        "عدد العاجزين يجب أن يكون أقل من أو يساوي عدد أفراد الأسرة",
        function (value) {
          const { family_size } = this.parent;
          if (!family_size || value == null) return true;
          return value <= family_size;
        },
      ),
    is_displaced: Yup.boolean().transform((value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    }),

    email: Yup.string().required('الايميل مطلوب'),
  });

const DashboardBeneficiaryRegister = () => {
  const [region, setRegion] = useState<number>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { isCreating, isUpdating, error } = useAppSelector(
    (state) => state.beneficiaries,
  );
  const { isFetching, governorates } = useAppSelector(
    (state) => state.governorates,
  );
  const { isFetching: isAreaFetching, areas } = useAppSelector(
    (state) => state.areas,
  );
  const dispatch = useAppDispatch();
  const { isNationalIdExists } = useBeneficiaryValidation();
  const location = useLocation();
  const editBeneficiary = (
    location.state as { beneficiary: IBeneficiary } | null
  )?.beneficiary;
  const isEditMode = !!editBeneficiary;

  const {
    formState: { errors },
    handleSubmit,
    reset,
    register,
    setValue,
  } = useForm<IRegisterBeneficiaryForm>({
    resolver: yupResolver(schemaRegisterBeneficiaryFrom),
  });

  useEffect(() => {
    if (accessToken) {
      if (areas.length === 0) dispatch(getAreas(accessToken));
      if (governorates.length === 0) dispatch(getGovernorates(accessToken));
    }
  }, [accessToken, dispatch, areas.length, governorates.length]);

  useEffect(() => {
    if (editBeneficiary) {
      reset({
        name: editBeneficiary.users.name,
        national_id: editBeneficiary.national_id,
        phone: editBeneficiary.users.phone,
        email: editBeneficiary.users.email,
        family_size: editBeneficiary.family_size,
        patients_count: editBeneficiary.patients_count,
        disabled_count: editBeneficiary.disabled_count,
        income: Number(editBeneficiary.income),
        area_id: editBeneficiary.area_id,
        is_displaced: editBeneficiary.is_displaced,
        release_date: editBeneficiary.release_date
          ? new Date(editBeneficiary.release_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [editBeneficiary, reset]);

  useEffect(() => {
    if (editBeneficiary && areas.length > 0) {
      const area = areas.find((a) => a.id === editBeneficiary.area_id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (area) setRegion(area.governorate_id);
    }
  }, [editBeneficiary, areas]);

  const handleOnSubmit = async (data: IRegisterBeneficiaryForm) => {
    if (!isEditMode && isNationalIdExists(data.national_id)) {
      toast.error("رقم الهوية موجود مسبقاً");
      return;
    }

    const isDisplaced = data.is_displaced === true;

    if (isEditMode && editBeneficiary) {
      const userResult = await dispatch(
        editUserAction(
          editBeneficiary.user_id,
          {
            name: data.name,
            email: data.email || editBeneficiary.users.email,
            phone: data.phone,
          },
          accessToken || "",
        ),
      );
      if (!userResult?.success) {
        toast.error("حدث خطأ أثناء تعديل بيانات المستخدم");
        return;
      }

      const result = await dispatch(
        editBeneficiaryAction(
          {
            ...editBeneficiary,
            users: {
              ...editBeneficiary.users,
              name: data.name,
              email: data.email || editBeneficiary.users.email,
              phone: data.phone,
            },
            national_id: data.national_id,
            area_id: data.area_id,
            family_size: data.family_size,
            income: String(data.income),
            patients_count: data.patients_count,
            disabled_count: data.disabled_count || 0,
            is_displaced: isDisplaced,
            release_date: new Date(data.release_date),
          },
          accessToken || "",
        ),
      );
      if (result?.success) {
        toast.success("تم تعديل المستفيد بنجاح");
        navigate(PATHS.DASHBOARD.BENEFICIARIES_MANAGEMENT);
      } else {
        toast.error("حدث خطأ أثناء تعديل المستفيد");
      }
      return;
    }

    await dispatch(
      addBeneficiaryAction(
        {
          area_id: data.area_id,
          disabled_count: data.disabled_count || 0,
          email: data.email || generateRandomEmail(),
          family_size: data.family_size,
          income: data.income,
          name: data.name,
          national_id: data.national_id,
          password: data.password || "password123",
          patients_count: data.patients_count,
          phone: data.phone,
          is_displaced: isDisplaced,
          release_date: data.release_date,
        },
        accessToken || "",
      ),
    );
    if (!error && !isCreating) {
      toast.success("تم تسجيل المستفيد");
      reset(defaultValues);
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">
        {isEditMode ? "تعديل المستفيد" : "تسجيل مستفيد جديد"}
      </h1>
      <form
        className="flex flex-col gap-12"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <article className="flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4">
          <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>
            المعلومات الشخصية
          </h3>
          <span className="h-px w-full bg-zinc-200 block" />

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="name"
              title="الاسم الكامل (كما في الهوية) "
              register={register}
              placeholder="مثال: محمد أحمد علي"
            />
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="national_id"
              title="رقم الهوية الوطنية / جواز السفر"
              register={register}
              placeholder="0000000000"
              onlyPositiveNumbers
            />
            
          </div>

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="phone"
              title="رقم الجوال"
              register={register}
              placeholder="05XXXXXXX"
              onlyPositiveNumbers
            />

<RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="release_date"
              title="تاريخ الاصدار"
              register={register}
              type="date"
              placeholder="2020-10-10"
            />

            
          </div>

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">

            <div className="flex flex-col gap-4 my-4 w-full">
              <label className="text-sm font-semibold">البريد الإلكتروني</label>
              <div className="flex gap-2 items-center">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className={`flex-1 px-4 py-3 bg-transparent text-sm rounded-md border outline-offset-4 ${errors["email"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                  {...register("email")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue("email", generateRandomEmail(), {
                      shouldValidate: true,
                    })
                  }
                  className="px-3 py-3 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
                >
                  توليد
                </button>
              </div>
              {errors["email"]?.message && (
                <span className="text-sm text-rose-600">
                  {String(errors["email"]?.message)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 my-4 w-full">
              <label className="text-sm font-semibold">كلمة المرور</label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    className={`w-full px-4 py-3 bg-transparent text-sm rounded-md border outline-offset-4 pl-10 ${errors["password"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setValue("password", "password123", { shouldValidate: true })}
                  className="px-3 py-3 text-sm bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  افتراضي
                </button>
                <button
                  type="button"
                  onClick={() => setValue("password", generateRandomPassword(), { shouldValidate: true })}
                  className="px-3 py-3 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
                >
                  توليد
                </button>
              </div>
              {errors["password"]?.message && (
                <span className="text-sm text-rose-600">
                  {String(errors["password"]?.message)}
                </span>
              )}
            </div>
          </div>

        </article>

        <article className="flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4">
          <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>تفاصيل الأسرة </h3>
          <span className="h-px w-full bg-zinc-200 block" />

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="family_size"
              type="number"
              title="إجمالي عدد أفراد الأسرة"
              register={register}
              onlyPositiveNumbers
            />
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="patients_count"
              type="number"
              title="عدد المرضى"
              register={register}
              onlyPositiveNumbers
            />
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="disabled_count"
              type="number"
              title="عدد العاجزين"
              register={register}
              onlyPositiveNumbers
            />
          </div>

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterBeneficiaryForm>
              errors={errors}
              label="income"
              type="number"
              title="الدخل الحالي للأسرة"
              register={register}
              onlyPositiveNumbers
            />
            <div className="flex flex-col gap-4 my-4 w-full">
              <label className="text-sm font-semibold">نازح</label>
              <select
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md border outline-offset-4 outline-gray-300 border-gray-300`}
                {...register("is_displaced")}
              >
                <option value="false">لا</option>
                <option value="true">نعم</option>
              </select>
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4">
          <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>
            الموقع الجغرافي
          </h3>
          <span className="h-px w-full bg-zinc-200 block" />

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            {isFetching ? (
              <Spinner />
            ) : (
              <div className="flex flex-col gap-4 my-4 w-full">
                <label className="text-sm font-semibold">
                  المنطقه / المحافظه
                </label>

                <select
                  value={region || "select"}
                  className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors["area_id"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                  onChange={(e) => {
                    setRegion(Number(e.target.value));
                  }}
                >
                  <option disabled value="select">
                    Select
                  </option>

                  {governorates.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.name}
                    </option>
                  ))}
                </select>

                {errors["area_id"] && (
                  <span className="span__error">المحافظه مطلوبه</span>
                )}
              </div>
            )}

            {isAreaFetching ? (
              <Spinner />
            ) : (
              <div className="flex flex-col gap-4 my-4 w-full">
                <label className="text-sm font-semibold">الحي</label>

                <select
                  className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors["area_id"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                  defaultValue={"select"}
                  {...register("area_id")}
                >
                  <option disabled value="select">
                    Select
                  </option>
                  {areas
                    .filter((a) => a.governorate_id === region)
                    .map((area) => {
                      console.log("region , ", region);
                      return (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      );
                    })}
                </select>

                {errors["area_id"] &&
                errors["area_id"]?.type === "typeError" ? (
                  <span className="text-sm text-rose-600">
                    {
                      INPUTS_TYPE_ERROR[
                        "area_id" as keyof typeof INPUTS_TYPE_ERROR
                      ]
                    }
                  </span>
                ) : (
                  errors["area_id"] && (
                    <span className="text-sm text-rose-600">
                      {String(errors["area_id"])}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </article>

        {isCreating || isUpdating ? (
          <Spinner />
        ) : (
          <Button className="self-start" type="submit">
            {isEditMode ? "تعديل المستفيد" : "تسجيل المستفيد"}
          </Button>
        )}
      </form>
    </section>
  );
};

export default DashboardBeneficiaryRegister;
