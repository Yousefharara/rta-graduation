import type { IRegisterLocalOrgForm } from "@/@types/forms";
import type { ILocalOrg } from "@/@types/localOrg";
import Button from "@/components/atoms/button";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import RowForm from "@/components/molecules/rowForm";
import { INPUTS_TYPE_ERROR } from "@/constants/forms";
import { getAreas } from "@/redux/slices/areaSlice";
import { addLocalOrgAction, editLocalOrgAction } from "@/redux/slices/localOrgSlice";
import { editUserAction } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { PATHS } from "@/routes/paths";
import { generateRandomEmail } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

const defaultDate: IRegisterLocalOrgForm = {
  area_id: 0,
  email: "",
  name: "",
  org_name: "",
  phone: "",
  focus_area: "",
  staff_count: null,
};

const schemaRegisterLocalOrgFrom: Yup.ObjectSchema<IRegisterLocalOrgForm> =
  Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    email: Yup.string().email().required("البريد اللكتروني مطلوب"),
    password: Yup.string(),
    phone: Yup.string().required("رقم الجوال مطلوب"),
    org_name: Yup.string().required("الاسم بالانجليزي مطلوب"),
    area_id: Yup.number().required(),
    focus_area: Yup.string().required("مجال التركيز مطلوب"),
    staff_count: Yup.number().required("طاقم العمل مطلوب"),
  });

const DashboardOrgRegister = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { areas, isFetching, error } = useAppSelector((state) => state.areas);
  const { isCreating, isUpdating } = useAppSelector(
    (state) => state.localOrg,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editOrg = (location.state as { org: ILocalOrg } | null)?.org;
  const isEditMode = !!editOrg;

  const {
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm<IRegisterLocalOrgForm>({
    resolver: yupResolver(schemaRegisterLocalOrgFrom),
  });

  useEffect(() => {
    if (errors) {
      console.log("errors, ", errors);
    }
  }, [errors]);

  useEffect(() => {
    if (accessToken)
      if (areas.length === 0) dispatch(getAreas(accessToken || ""));
  }, [dispatch, accessToken, areas]);

  useEffect(() => {
    if (editOrg) {
      reset({
        name: editOrg.users.name,
        org_name: editOrg.org_name,
        email: editOrg.users.email,
        phone: editOrg.users.phone,
        area_id: editOrg.area_id,
        focus_area: editOrg.focus_area,
        staff_count: editOrg.staff_count,
      });
    }
  }, [editOrg, reset]);

  const handleOnSubmit = async (data: IRegisterLocalOrgForm) => {
    if (isEditMode && editOrg) {
      const userResult = await dispatch(
        editUserAction(
          editOrg.user_id,
          { name: data.name, email: data.email || editOrg.users.email, phone: data.phone },
          accessToken || "",
        ),
      );
      if (!userResult?.success) {
        toast.error("حدث خطأ أثناء تعديل بيانات المستخدم");
        return;
      }

      const result = await dispatch(
        editLocalOrgAction(
          {
            ...editOrg,
            org_name: data.org_name,
            area_id: data.area_id,
            focus_area: data.focus_area,
            staff_count: data.staff_count || 0,
            users: {
              ...editOrg.users,
              name: data.name,
              email: data.email || editOrg.users.email,
              phone: data.phone,
            },
          },
          accessToken || "",
        ),
      );
      if (result?.success) {
        toast.success("تم تعديل المنظمة بنجاح");
        navigate(PATHS.DASHBOARD.ROOT);
      } else {
        toast.error("حدث خطأ أثناء تعديل المنظمة");
      }
      return;
    }

    const result = await dispatch(
      addLocalOrgAction(
        {
          ...data,
          email: data.email || generateRandomEmail(),
          password: "password123",
        },
        accessToken || "",
      ),
    );
    if (result?.success) {
      toast.success("تمت اضافة المنظمة بنجاح");
      reset(defaultDate);
    } else {
      toast.error("هناك خطأ في الإضافة");
    }
  };

  if (error)
    return <Error onRetry={() => dispatch(getAreas(accessToken || ""))} />;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">
        {isEditMode ? "تعديل المنظمة" : "تسجيل منظمة جديدة"}
      </h1>
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
            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="staff_count"
              title="كم عدد طاقم العمل"
              type="number"
              onlyPositiveNumbers
              register={register}
              placeholder=""
            />

            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="focus_area"
              title="مجال التركيز"
              register={register}
              placeholder=""
            />
          </div>

          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="email"
              title="البريد الإلكتروني الرسمي"
              register={register}
              placeholder="example@gmail.com"
            />

            <RowForm<IRegisterLocalOrgForm>
              errors={errors}
              label="phone"
              title="رقم الجوال"
              register={register}
              placeholder="05XXXXXXX"
              onlyPositiveNumbers
            />

            {isFetching ? (
              <Spinner />
            ) : (
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
                  {areas.map((area) => {
                    return (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    );
                  })}
                </select>
                {errors['area_id']?.message && (
                  <span className="span__error">
                    {INPUTS_TYPE_ERROR["area_id"]}
                  </span>
                )}
              </div>
            )}
          </div>
        </article>

        {isCreating || isUpdating ? (
          <Spinner />
        ) : (
          <Button type="submit" className="flex items-center gap-2 self-start">
            {isEditMode ? "تعديل المنظمة" : "حفظ"}
          </Button>
        )}
      </form>
    </section>
  );
};

export default DashboardOrgRegister;
