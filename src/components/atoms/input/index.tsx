import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { InputHTMLAttributes } from "react";

interface IInputProps<
  TFormValues extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  label: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
}

const Input = <TFormValues extends FieldValues>({
  label,
  register,
  errors,
  className,
  ...restProps
}: IInputProps<TFormValues>) => {
  // const hasError = !!errors?.[name]
  return (
    <input
      {...restProps}
      className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors[label]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"} ${className}`}
      {...register(label)}
    />
  );
};

export default Input;
