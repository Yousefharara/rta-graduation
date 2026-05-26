import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RowForm from "../../molecules/rowForm";
import Button from "../../atoms/button";
import { ArrowLeft } from "lucide-react";
import type { ITrackAidForm } from "@/@types/forms";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useAppDispatch } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";

const schemaLoginFrom: Yup.ObjectSchema<ITrackAidForm> = Yup.object({
  IDNumber: Yup.number().required("ID is required !"),
  versionNumber: Yup.date().required("version is required !"),
});

const TrackAidForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ITrackAidForm>({ resolver: yupResolver(schemaLoginFrom) });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (errors) {
      console.log("errors , ", errors);
    }
  }, [errors]);

  const handleOnSubmit = (data: ITrackAidForm) => {
    console.log("Data is , ", data);
    dispatch(login({
      role: "user",
      user: "yousef",
      token: 'ksdhfahf'
    }))
    navigate(PATHS.TRACK_AID.USER)
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
          <p className="text-lg">تتبع</p>
          <ArrowLeft size={18} className="" />
        </div>
      </Button>
    </form>
  );
};

export default TrackAidForm;
