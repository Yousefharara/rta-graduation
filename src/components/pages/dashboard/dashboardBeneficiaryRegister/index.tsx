import * as Yup from "yup";
import type { IRegisterBeneficiaryForm } from "@/@types/forms";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RowForm from "@/components/molecules/rowForm";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addBeneficiaryAction } from "@/redux/slices/beneficiarySlice";
import { generateRandomEmail } from "@/utils/utils";
import { useBeneficiaryValidation } from "@/hooks/useBeneficiaryValidation";
import { toast } from "sonner";
import { INPUTS_TYPE_ERROR } from "@/constants/forms";
import Spinner from "@/components/feedback/Spinner";
import { getAreas } from "@/redux/slices/areaSlice";
import { getGovernorates } from "@/redux/slices/governorateSlice";

// const defaultValues: IRegisterBeneficiaryForm = {
//   name: "",
//   disabled_count: 0,
//   area_id: 1,
//   family_size: 0,
//   national_id: "",
//   password: "",
//   patients_count: 0,
//   phone: "",
//   is_displaced: false,
//   income: 0,
//   status: "single",
//   email: "",
//   release_date: new Date().toISOString()
// };

const schemaRegisterBeneficiaryFrom: Yup.ObjectSchema<IRegisterBeneficiaryForm> =
  Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    password: Yup.string(),

    phone: Yup.string().required("رقم الهاتف مطلوب"),
    national_id: Yup.string().required("رقم الهويه مطلوبه"),
    release_date: Yup.string().required("رقم الهويه مطلوبه"),
    area_id: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? -1 : value))
      .required("المحافظه مطلوب"),

    family_size: Yup.number().required("عدد الافراد مطلوب"),
    income: Yup.number().required("الدخل مطلوب"),
    patients_count: Yup.number().required("عدد المرضى مطلوب"),

    disabled_count: Yup.number(),
    is_displaced: Yup.boolean(),

    email: Yup.string(),
    status: Yup.mixed<"single" | "married">()
      .oneOf(["single", "married"], "حالة المستفيد مطلوبه")
      .required(""),
  });

const DashboardBeneficiaryRegister = () => {
  const [region, setRegion] = useState<number>();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { isCreating, error } = useAppSelector((state) => state.beneficiaries);
  const { isFetching, governorates } = useAppSelector(
    (state) => state.governorates,
  );
  const { isFetching: isAreaFetching, areas } = useAppSelector(
    (state) => state.areas,
  );
  const dispatch = useAppDispatch();
  const { isNationalIdExists } = useBeneficiaryValidation();

  const {
    formState: { errors },
    handleSubmit,
    // reset,
    register,
  } = useForm<IRegisterBeneficiaryForm>({
    resolver: yupResolver(schemaRegisterBeneficiaryFrom),
  });

  useEffect(() => {
    dispatch(getAreas(accessToken || ""));
    dispatch(getGovernorates(accessToken || ""));
  }, [accessToken, dispatch]);

  const handleOnSubmit = (data: IRegisterBeneficiaryForm) => {
    if (isNationalIdExists(data.national_id)) {
      toast.error("رقم الهوية موجود مسبقاً");
      return;
    }

    dispatch(
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
          is_displaced: false,
          release_date: data.release_date,
        },
        accessToken || "",
      ),
    );
    if (!error && !isCreating) {
      toast.success("تم تسجيل المستفيد");
      // reset(defaultValues);
    }
  };

  return (
    <section>
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
              label="email"
              title="البريد الإلكتروني (اختياري)"
              register={register}
              placeholder="example@gmail.com"
            />
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
              title="عدد المرضى "
              register={register}
              onlyPositiveNumbers
            />

            <div className="flex flex-col gap-4 my-4 w-full">
              <label className="text-sm font-semibold">الحالة الاجتماعيه</label>
              <select
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors["status"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                defaultValue={"select"}
                {...register("status")}
              >
                <option disabled value="select">
                  Select
                </option>
                <option value="single">single</option>
                <option value="married">married</option>
              </select>
              {errors["status"] && (
                <span className="span__error">{errors["status"]?.message}</span>
              )}
            </div>
          </div>

          <RowForm<IRegisterBeneficiaryForm>
            errors={errors}
            label="income"
            type="number"
            title="الدخل الحالي للاسرة"
            register={register}
            onlyPositiveNumbers
          />
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
                  defaultValue={"select"}
                  className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors["area_id"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                  onChange={(e) => {
                    setRegion(Number(e.target.value));
                    console.log("region ", region);
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

        {isCreating ? (
          <Spinner />
        ) : (
          <Button className="self-start" type="submit">
            تسجيل المستفيد
          </Button>
        )}
      </form>
    </section>
  );
};

export default DashboardBeneficiaryRegister;
