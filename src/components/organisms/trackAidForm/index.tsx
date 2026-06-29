import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RowForm from "../../molecules/rowForm";
import Button from "../../atoms/button";
import { ArrowLeft } from "lucide-react";
import type { ITrackAidForm } from "@/@types/forms";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { loginBeneficiaryAction, setError } from "@/redux/slices/authSlice";
import { formatDate } from "@/utils/utils";
import { useEffect } from "react";
import Spinner from "@/components/feedback/Spinner";

const schemaLoginFrom: Yup.ObjectSchema<ITrackAidForm> = Yup.object({
  IDNumber: Yup.string().required("رقم الهوية مطلوب !"),
  versionNumber: Yup.date().required("رقم الإصدار مطلوب !"),
});

const TrackAidForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ITrackAidForm>({ resolver: yupResolver(schemaLoginFrom) });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear auth error on unmount to prevent stale errors on other pages
    return () => {
      dispatch(setError(null));
    };
  }, [dispatch]);

  const handleOnSubmit = (data: ITrackAidForm) => {
    console.log(
      "data submit is : ",
      data,
      " | release is ",
      data.versionNumber instanceof Date
        ? formatDate(data.versionNumber)
        : String(data.versionNumber),
    );
    // تحويل التاريخ إلى string بصيغة YYYY-MM-DD
    const release_date =
      data.versionNumber instanceof Date
        ? formatDate(data.versionNumber)
        : String(data.versionNumber);

    dispatch(
      loginBeneficiaryAction(
        {
          national_id: data.IDNumber,
          release_date,
        },
        navigate,
      ),
    );
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleOnSubmit)}
    >
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

      {error && <p className="text-rose-700 text-sm text-center">{error}</p>}

      {!isLoading ? (
        <Button
          variant="default"
          className="text-white w-full flex justify-center items-center py-3"
        >
          <div className="flex items-center gap-3 w-fit">
            <p className="text-lg">تتبع</p>
            <ArrowLeft size={18} />
          </div>
        </Button>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </form>
  );
};

export default TrackAidForm;
