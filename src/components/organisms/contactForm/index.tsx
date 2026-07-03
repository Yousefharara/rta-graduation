import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import RowForm from "../../molecules/rowForm";
import Button from "../../atoms/button";
import { Send } from "lucide-react";
import type { IContactForm } from "@/@types/forms";

const schemaLoginFrom: Yup.ObjectSchema<IContactForm> = Yup.object({
  email: Yup.string().email().required(),
  fullName: Yup.string().min(5, "الاسم غير صحيح").required("full name is required !"),
  title: Yup.string().min(5, "العنوان فصير").required("title is required !"),
  description: Yup.string().min(5, "الوصف قصير").required("description is required !"),
});

const ContactForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<IContactForm>({ resolver: yupResolver(schemaLoginFrom) });

  const handleOnSubmit = (data: IContactForm) => {
    console.log("Data is , ", data);
  };
  const messageError = errors["description"]?.message;

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="w-full flex gap-4">
        <RowForm<IContactForm>
          errors={errors}
          register={register}
          label="fullName"
          placeholder="أدخل اسمك"
          className="w-full"
        />
        <RowForm<IContactForm>
          errors={errors}
          register={register}
          label="email"
          placeholder="example@rta.org"
          type="email"
          className="w-full"
        />
      </div>
      <RowForm<IContactForm>
        errors={errors}
        register={register}
        label="description"
        placeholder="كيف مكننا مساعدتك ؟"
        type="text"
      />

      <div className="flex flex-col gap-4 my-4">
        <label className="text-sm font-semibold">الرسالة</label>

        <textarea
          {...register("description")}
          className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${messageError ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"}`}
          placeholder="أكتب رسالتك هنا بالتفصيل ..."
          rows={14}
        ></textarea>

        {messageError && (
          <span className="text-sm text-rose-600">{String(messageError)}</span>
        )}
      </div>

      <Button variant="default">
        <div className="flex items-center gap-3">
            أرسال الرسالة
            <Send size={18} />
        </div>
      </Button>
    </form>
  );
};

export default ContactForm;
