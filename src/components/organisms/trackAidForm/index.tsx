import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RowForm from "../../molecules/rowForm";
import Button from "../../atoms/button";
import { ArrowLeft } from "lucide-react";
import type { ITrackAidForm } from "@/@types/forms";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { getBeneficiaries } from "@/redux/slices/beneficiarySlice";
// import { getUsers } from "@/redux/slices/users";

const schemaLoginFrom: Yup.ObjectSchema<ITrackAidForm> = Yup.object({
  IDNumber: Yup.string().required("ID is required !"),
  versionNumber: Yup.date().required("version is required !"),
});

const TrackAidForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ITrackAidForm>({ resolver: yupResolver(schemaLoginFrom) });

  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { beneficiary, isLoading, errorMessage } = useAppSelector(
    (state) => state.beneficiaries,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBeneficiaries());
  }, [dispatch])

  if (errorMessage) return <h1>Error here</h1>;

  const handleOnSubmit = (data: ITrackAidForm) => {
    const checkUser = users.find((u) => u.id_card === data.IDNumber);

    if (checkUser && !isLoading) {
      dispatch(
        login({
          role: "user",
          user: checkUser.id,
          token: checkUser.token,
        }),
      );
      navigate(PATHS.TRACK_AID.USER);
    } else {
      setIsAuth(true);
    }

  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(handleOnSubmit)}>
      <RowForm<ITrackAidForm>
        title="رقم الهويه الوطنيه"
        errors={errors}
        register={register}
        label="IDNumber"
        placeholder="123456789"
        className="w-full bg-[#E0E9FD]!"
      />
      <RowForm<ITrackAidForm>
        title="رقم الاصدار"
        errors={errors}
        register={register}
        label="versionNumber"
        type="date"
        dir="rtl"
        lang="ar"
        placeholder="10/10/2020"
        className="w-full bg-[#E0E9FD]!"
      />
      <Button
        variant="default"
        className="text-white w-full flex justify-center items-center py-3"
      >
        <div className="flex items-center gap-3 w-fit">
          {isLoading ? (
            <p className="text-lg">تحميل ...</p>
          ) : (
            <p className="text-lg">تتبع</p>
          )}
          <ArrowLeft size={18} className="" />
        </div>
      </Button>
      {isAuth && (
        <p className="text-rose-700">ID card or version is incorrect !!</p>
      )}
    </form>
  );
};

export default TrackAidForm;
