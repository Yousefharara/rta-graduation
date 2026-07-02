import { PATHS } from "@/routes/paths";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FolderClosed,
  LayoutPanelTop,
  Users,
  X,
  LogOut,
  Plus,
  MessageSquareText,
  PackageOpen,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./style.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { createNotificationAction } from "@/redux/slices/notificationSlice";
import Button from "@/components/atoms/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import RowForm from "@/components/molecules/rowForm";
import { addAidAction } from "@/redux/slices/aidSlice";
import Spinner from "@/components/feedback/Spinner";
import { getAidTypes } from "@/redux/slices/aidTypes";

interface ISidebar {
  isOpenAside: boolean;
  isMobile: boolean;
  handleCloseAside: () => void;
}

interface ICreateAidForm {
  aidType: string;
  quantity: number;
}

const defaultValues: ICreateAidForm = {
  aidType: "",
  quantity: 0,
};

const schemaCreateAidFrom: Yup.ObjectSchema<ICreateAidForm> = Yup.object({
  aidType: Yup.string().required("نوع المساعدة مطلوب"),
  quantity: Yup.number().required("الكمية مطلوبة"),
});

const Sidebar = ({ isOpenAside, isMobile, handleCloseAside }: ISidebar) => {
  const [open, setOpen] = useState(false);

  const { organization, accessToken, user, role } = useAppSelector((state) => state.auth);
  const { aidTypes } = useAppSelector((state) => state.aidTypes);
  const { isCreating } = useAppSelector((state) => state.aids);
  const dispatch = useAppDispatch();

  const {
    formState: { errors },
    handleSubmit,
    reset,
    register,
  } = useForm<ICreateAidForm>({ resolver: yupResolver(schemaCreateAidFrom) });

  const aidTypeError = errors["aidType"]?.message;

  useEffect(() => {
    if(accessToken) dispatch(getAidTypes(accessToken))
  }, [dispatch, accessToken])

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOnSubmit = async (data: ICreateAidForm) => {
    const selectedAid = aidTypes.find((a) => a.name === data.aidType);
    const aidTypeId = selectedAid ? selectedAid.id : 1;

    const result = await dispatch(
      addAidAction(
        { aid_type_id: Number(aidTypeId), org_id: organization?.id || 1, quantity: data.quantity },
        accessToken || "",
      ),
    );

    if (result?.success) {
      setOpen(false);
      toast.success("تمت عملية الشحن بنجاح ❤️");
      reset(defaultValues);
      dispatch(
        createNotificationAction(
          {
            user_id: 1,
            title: "شحنة جديدة",
            message: `تم إضافة شحنة جديدة من ${organization?.name || user?.name || "منظمة"}: ${data.aidType} بكمية ${data.quantity}`,
          },
          accessToken || "",
        ),
      );
    } else {
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً");
    }
  };

  return (
    <>
      <aside
        className={`border-r flex flex-col gap-4 border-r-gray-300 transition-all duration-200 z-30 sticky bg-[#E0E9FD] p-4 top-0 h-screen overflow-y-auto basis-1/4 rounded-lg max-lg:-left-full max-lg:fixed
            ${isOpenAside && isMobile ? "max-lg:left-0 max-lg:w-1/3 max-lg:basis-0" : ""}`}
      >
        <div className="flex justify-between">
          {isOpenAside && (
            <h3
              className="cursor-pointer text-gray-700"
              onClick={handleCloseAside}
            >
              <X />
            </h3>
          )}
        </div>

        <article className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center p-3 bg-primary rounded-lg">
              <svg
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 16V12C0 11.4333 0.195833 10.9583 0.5875 10.575C0.979167 10.1917 1.45 10 2 10H5.275C5.60833 10 5.925 10.0833 6.225 10.25C6.525 10.4167 6.76667 10.6417 6.95 10.925C7.43333 11.575 8.02917 12.0833 8.7375 12.45C9.44583 12.8167 10.2 13 11 13C11.8167 13 12.5792 12.8167 13.2875 12.45C13.9958 12.0833 14.5833 11.575 15.05 10.925C15.2667 10.6417 15.5208 10.4167 15.8125 10.25C16.1042 10.0833 16.4083 10 16.725 10H20C20.5667 10 21.0417 10.1917 21.425 10.575C21.8083 10.9583 22 11.4333 22 12V16H15V13.725C14.4167 14.1417 13.7875 14.4583 13.1125 14.675C12.4375 14.8917 11.7333 15 11 15C10.2833 15 9.58333 14.8875 8.9 14.6625C8.21667 14.4375 7.58333 14.1167 7 13.7V16H0ZM11 12C10.3667 12 9.76667 11.8542 9.2 11.5625C8.63333 11.2708 8.15833 10.8667 7.775 10.35C7.49167 9.93333 7.1375 9.60417 6.7125 9.3625C6.2875 9.12083 5.825 9 5.325 9C5.69167 8.38333 6.46667 7.89583 7.65 7.5375C8.83333 7.17917 9.95 7 11 7C12.05 7 13.1667 7.17917 14.35 7.5375C15.5333 7.89583 16.3083 8.38333 16.675 9C16.1917 9 15.7333 9.12083 15.3 9.3625C14.8667 9.60417 14.5083 9.93333 14.225 10.35C13.8583 10.8833 13.3917 11.2917 12.825 11.575C12.2583 11.8583 11.65 12 11 12ZM3 9C2.16667 9 1.45833 8.70833 0.875 8.125C0.291667 7.54167 0 6.83333 0 6C0 5.15 0.291667 4.4375 0.875 3.8625C1.45833 3.2875 2.16667 3 3 3C3.85 3 4.5625 3.2875 5.1375 3.8625C5.7125 4.4375 6 5.15 6 6C6 6.83333 5.7125 7.54167 5.1375 8.125C4.5625 8.70833 3.85 9 3 9ZM19 9C18.1667 9 17.4583 8.70833 16.875 8.125C16.2917 7.54167 16 6.83333 16 6C16 5.15 16.2917 4.4375 16.875 3.8625C17.4583 3.2875 18.1667 3 19 3C19.85 3 20.5625 3.2875 21.1375 3.8625C21.7125 4.4375 22 5.15 22 6C22 6.83333 21.7125 7.54167 21.1375 8.125C20.5625 8.70833 19.85 9 19 9ZM11 6C10.1667 6 9.45833 5.70833 8.875 5.125C8.29167 4.54167 8 3.83333 8 3C8 2.15 8.29167 1.4375 8.875 0.8625C9.45833 0.2875 10.1667 0 11 0C11.85 0 12.5625 0.2875 13.1375 0.8625C13.7125 1.4375 14 2.15 14 3C14 3.83333 13.7125 4.54167 13.1375 5.125C12.5625 5.70833 11.85 6 11 6Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className="text-2xl text-primary font-semibold">
              {role === "admin" ? "رئيس الإغاثة" : user?.name}
            </p>
          </div>
          <ul className="sidebar-links flex flex-col gap-1 ">
            <li>
              <NavLink
                className="flex items-center gap-3 text-primary-foreground p-4 rounded-lg"
                to={PATHS.DASHBOARD.ROOT}
              >
                <LayoutPanelTop />
                <p className="font-semibold">لوحة التحكم</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="flex items-center gap-3 text-primary-foreground p-4 rounded-lg"
                to={PATHS.DASHBOARD.AID_ORDERS}
              >
                <FolderClosed />
                <p className="font-semibold">طلبات المساعدة</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="flex items-center gap-3 text-primary-foreground p-4 rounded-lg"
                to={PATHS.DASHBOARD.BENEFICIARIES_MANAGEMENT}
              >
                <Users />
                <p className="font-semibold">إدارة المستفيدين</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="flex items-center gap-3 text-primary-foreground p-4 rounded-lg"
                to={PATHS.DASHBOARD.COMPLAINTS}
              >
                <MessageSquareText />
                <p className="font-semibold">الشكاوى</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="flex items-center gap-3 text-primary-foreground p-4 rounded-lg"
                to={PATHS.DASHBOARD.AIDS}
              >
                <PackageOpen />
                <p className="font-semibold">المساعدات</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className="flex items-center gap-3 text-primary-foreground p-4 rounded-lg"
                to={PATHS.DASHBOARD.NOTIFICATIONS}
              >
                <Bell />
                <p className="font-semibold">الإشعارات</p>
              </NavLink>
            </li>
          </ul>
        </article>

        <div className="mt-auto">
          {role !== "local_org" && (
            <NavLink
              to={PATHS.DASHBOARD.ORG_REGISTER}
              className="sidebar-org rounded-md flex items-center gap-3 justify-center py-3 cursor-pointer"
            >
              <Plus size={18} />
              <p className="font-semibold"> تسجيل منظمه</p>
            </NavLink>
          )}
          {role === "local_org" && (
            <Button
              variant="gradient"
              onClick={() => setOpen(true)}
              className="rounded-md w-full mb-3 flex items-center gap-3 justify-center py-3 cursor-pointer"
            >
              <Plus size={18} />
              <p className="font-semibold"> اضافة شحنة</p>
            </Button>
          )}
          <div className="flex items-center gap-3 justify-center py-3 text-red-800 cursor-pointer border-t border-t-zinc-400">
            <LogOut size={18} />
            <p className="font-semibold" onClick={handleLogout}>
              {" "}
              تسجيل الخروج
            </p>
          </div>
        </div>
      </aside>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-[#EFF4FF]">
          <DialogHeader className="mt-10 px-6 text-start!">
            <DialogTitle dir="rtl">تقديم شحنة جديد</DialogTitle>

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
            <p>تقديم شحنة جديد</p>
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
                className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${aidTypeError ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
                defaultValue=""
                {...register("aidType")}
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
              {aidTypeError && (
                <span className="text-sm text-rose-600">{aidTypeError}</span>
              )}
            </div>

            <RowForm<ICreateAidForm>
              title="الكمية الواردة"
              errors={errors}
              label="quantity"
              type="number"
              onlyPositiveNumbers
              register={register}
            />

            <DialogFooter className="flex items-center flex-wrap gap-2">
              {isCreating ? (
                <Spinner />
              ) : (
                <Button
                  className="disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  type="submit"
                >
                  ارسال الشحنة
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
