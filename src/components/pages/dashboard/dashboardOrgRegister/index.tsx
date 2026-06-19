import type { IRegisterLocalOrgForm } from "@/@types/forms";
import Button from "@/components/atoms/button";
import RowForm from "@/components/molecules/rowForm";
import { AREAS } from "@/constants/areas";
import { addLocalOrgAction } from "@/redux/slices/localOrgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { generateRandomEmail } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schemaRegisterLocalOrgFrom: Yup.ObjectSchema<IRegisterLocalOrgForm> =
  Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    email: Yup.string().email().required(""),
    password: Yup.string(),
    phone: Yup.string().required(),
    org_name: Yup.string().required(),
    orgType: Yup.string().required(),
    area_id: Yup.number().required(),
  });

const DashboardOrgRegister = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<IRegisterLocalOrgForm>({
    resolver: yupResolver(schemaRegisterLocalOrgFrom),
  });

  useEffect(() => {
    console.log("Error , ", errors);
  }, [errors]);

  const handleOnSubmit = (data: IRegisterLocalOrgForm) => {
    console.log("data , ", data);
    console.log("password , ", data.email || generateRandomEmail());
    dispatch(
      addLocalOrgAction(
        {
          ...data,
          email: data.email || generateRandomEmail(),
          password: "password123",
        },
        accessToken || "",
      ),
    );
    // reset(defaultValues);
  };

  return (
    <section>
      <form
        className="flex flex-col gap-12"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <article className="flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4">
          <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>
            المعلومات الأساسية
          </h3>
          <span className="h-px w-full bg-zinc-200 block" />

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="name"
              title="اسم المنظمة بالعربي"
              register={register}
              placeholder="مثال: منظمة الإغاثة الدولية"
            />
            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="org_name"
              title="name of organization (en)"
              register={register}
              placeholder="ex: Al-Rahma Association"
            />
          </div>

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">

<div className="flex flex-col gap-4 my-4 w-full">
              <label className="text-sm font-semibold">
                نوع المنظمه
              </label>

              <select
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors["area_id"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                defaultValue={"select"}
                {...register("orgType")}
              >
                <option disabled value="select">
                  Select
                </option>
                <option value="NGO's">
                  NGO's
                </option>
                
              </select>
              {errors["orgType"] && (
                <span className="span__error">
                  {errors["orgType"]?.message}
                </span>
              )}
            </div>

            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="email"
              title="البريد الإلكتروني الرسمي"
              register={register}
              placeholder="example@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="phone"
              title="رقم الجوال"
              register={register}
              placeholder="05XXXXXXX"
              onlyPositiveNumbers
            />

            <div className="flex flex-col gap-4 my-4 w-full">
              <label className="text-sm font-semibold">
                الموقع الجغرافي الرئيسي
              </label>

              <select
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors["area_id"]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                defaultValue={"select"}
                {...register("area_id")}
              >
                <option disabled value="select">
                  Select
                </option>
                {AREAS.map((area) => {
                  return (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  );
                })}
              </select>
              {errors["area_id"] && (
                <span className="span__error">
                  {errors["area_id"]?.message}
                </span>
              )}
            </div>
          </div>
        </article>

        <Button type="submit" className="flex items-center gap-2 self-start">
          حفظ <ArrowLeft size={18} />{" "}
        </Button>
      </form>
    </section>
  );
};

export default DashboardOrgRegister;
