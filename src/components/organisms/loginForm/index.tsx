import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Button from "../../atoms/button";
import RowForm from "../../molecules/rowForm";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { setLogin } from "../../../redux/slices/authSlice";
import type { ILoginForm } from "@/@types/forms";

const schemaLoginFrom: Yup.ObjectSchema<ILoginForm> = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required("password is required !"),
  remeberMe: Yup.boolean()
    .oneOf([true, false])
    .required("remember is required !"),
});

const LoginForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ILoginForm>({ resolver: yupResolver(schemaLoginFrom) });
  const dispatch = useAppDispatch();
  const { user, isLoading, errorMessage } = useAppSelector(state => state.auth)
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const handleOnSubmit = (data: ILoginForm) => {

    dispatch(setLogin(data));
    setIsAuth(false)
    if (!isLoading) {
      if (user) {
        console.log('user is ', user);
      } else {
        console.log('no user found');
      }
    }
  };


  useEffect(() => {
    console.log("Errors");
    if (errorMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuth(true)
    }
    if (errorMessage) {
      console.log('errorMessage ', errorMessage);
    }
    console.log(errors);
  }, [errors, errorMessage, user]);



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
      <RowForm<ILoginForm>
        placeholder="*********"
        title="كلمه المرور"
        errors={errors}
        label="password"
        register={register}
        type="password"
      />
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
      {isLoading ? <p className="text-center mt-5 text-lg underline">Loading ....</p> : <Button
        variant="default"
        type="submit"
        className="
          w-full
          mt-4
        "
      >
        تسجيل الدخول
      </Button>}
      {isAuth && (
        <p
          className="
            mt-4 text-center text-lg font-semibold text-red-500
          "
        >
          Password or Email Error
        </p>
      )}

      {/* {errorMessage && (
        <p className="text-rose-600 font-medium mt-10">{errorMessage}</p>
      )} */}
    </form>
  );
};

export default LoginForm;
