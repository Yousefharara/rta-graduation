
import type { InputHTMLAttributes } from "react";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface IInputProps<
  TFormValues extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  label: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
    onlyPositiveNumbers?: boolean;

}

const Input = <TFormValues extends FieldValues>({
  label,
  register,
  errors,
  className,
  onlyPositiveNumbers,
  ...restProps
}: IInputProps<TFormValues>) => {
  // const hasError = !!errors?.[name]
  return (
    <input
      {...restProps}
      onInput={(e) => {
    if (onlyPositiveNumbers) {
      const target = e.target as HTMLInputElement;
      target.value = target.value.replace(/\D/g, "");
    }
  }}
      className={`px-4 py-3 bg-transparent w-full text-sm rounded-md outline-offset-4  border ${errors[label]?.message ? "outline-rose-500 border-rose-500" : "outline-gray-300 border-gray-300"} ${className}`}
      {...register(label)}
    />
  );
};

export default Input;
