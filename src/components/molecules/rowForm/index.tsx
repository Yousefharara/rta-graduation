import React, { InputHTMLAttributes } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import Input from "../../atoms/input";

interface IRowLoginProps<
  TFromValues extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  label: Path<TFromValues>;
  register: UseFormRegister<TFromValues>;
  errors: FieldErrors<TFromValues>;
}

const RowForm = <TFromValues extends FieldValues>({
  label,
  title,
  register,
  errors,
  className,
  ...restProps
}: IRowLoginProps<TFromValues>) => {
  const messageError = errors[label]?.message;

  return (
    <div className="flex flex-col gap-4 my-4">
      <label className="text-sm font-semibold">{title}</label>
      <Input<TFromValues>
        {...restProps}
        errors={errors}
        label={label}
        register={register}
        className={className}
      />
      {messageError && (
        <span className="text-sm text-rose-600">{String(messageError)}</span>
      )}
    </div>
  );
};

export default RowForm;
