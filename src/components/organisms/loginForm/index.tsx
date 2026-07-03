import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Button from "../../atoms/button";
import RowForm from "../../molecules/rowForm";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { setLogin } from "../../../redux/slices/authSlice";
import type { ILoginForm } from "@/@types/forms";
import Spinner from "@/components/feedback/Spinner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const schemaLoginFrom: Yup.ObjectSchema<ILoginForm> = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required("password is required !"),
  remeberMe: Yup.boolean()
    .oneOf([true, false])
    .required("remember is required !"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ILoginForm>({ resolver: yupResolver(schemaLoginFrom) });
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const handleOnSubmit = (data: ILoginForm) => {
    dispatch(setLogin(data));
    // setIsAuth(false)
    if (!isLoading) {
      if (user) {
        console.log("user is ", user);
      } else {
        console.log("no user found");
      }
    }
  };

  const defaultAdmin = () => {
    dispatch(
      setLogin({
        email: "admin@admin.com",
        password: "password123",
      }),
    );
  };
  const defaultOrg = () => {
    dispatch(
      setLogin({
        email: "org@org.com",
        password: "password123",
      }),
    );
  };

  // useEffect(() => {
  //   // Clear auth error on component unmount to prevent stale errors on other pages
  //   return () => {
  //     dispatch(setError(null));
  //   };
  // }, [dispatch]);


  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <RowForm<ILoginForm>
        errors={errors}
        title="البريد الالكتروني"
        label="email"
        register={register}
        type="email"
        placeholder="example@rta.org"
      />
      <div className="flex flex-col gap-4 my-4 w-full">
        <label className="text-sm font-semibold">كلمة المرور</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="*********"
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
        {errors["password"]?.message && (
          <span className="text-sm text-rose-600">{String(errors["password"]?.message)}</span>
        )}
      </div>
      <article
        className="
          flex
          justify-between items-center
        "
      >
        {/* // ! --------------- */}

        <Link
          to={"/"}
          className="
            text-sm text-gray-700
            underline
          "
        >
          نسيت كلمه المرور ؟
        </Link>

        <label
          className="
            flex
            cursor-pointer
            items-center gap-2
          "
        >
          <input
            type="checkbox"
            id="Remeber Me"
            {...register("remeberMe")}
            className="
              hidden
              peer
            "
          />

          <span
            className="
              flex
              w-5 h-5
              bg-gray-200
              border border-gray-400
              rounded items-center justify-center transition peer-checked:bg-blue-600 peer-checked:border-blue-600
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="
                w-5 h-5
                text-gray-200 
                transition-transform
                peer-checked:text-white
              "
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>

          <span
            className="
              text-sm
            "
          >
            تذكرني
          </span>
        </label>
      </article>
      {errors && (
        <span
          className="
            text-sm text-rose-600
            underline
          "
        >
          {errors["remeberMe"]?.message}
        </span>
      )}
      
        <Button
          variant="default"
          disabled={isLoading}
          type="submit"
          className="
          w-full
          mt-4
          disabled:bg-primary/50 disabled:cursor-not-allowed
        "
        >
          {isLoading ? <p className="flex items-center gap-4 justify-center">جاري تسجيل الدخول <Spinner /></p> : "تسجيل الدخول"}
        </Button>
      
      {error && (
        <p
          className="
            mt-4 text-center text-red-500
          "
        >
          {error}
        </p>
      )}
      <section className="flex justify-between gap-4 mt-8">
        <article
          onClick={defaultAdmin}
          className="cursor-pointer border-2 border-zinc-300 hover:border-rose-600 transition duration-300 rounded-lg p-4 "
        >
          Entire with default admin
        </article>
        <article
          onClick={defaultOrg}
          className="cursor-pointer border-2 border-zinc-300 hover:border-emerald-600 transition duration-300 rounded-lg p-4 "
        >
          Entire with default org
        </article>
      </section>
    </form>
  );
};

export default LoginForm;
