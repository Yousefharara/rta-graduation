import React, { InputHTMLAttributes } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import Input from "../../atoms/input";
import { INPUTS_TYPE_ERROR } from "../../../constants/forms";

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
    <div className="flex flex-col gap-4 my-4 w-full">
      <label className="text-sm font-semibold">{title}</label>
      <Input<TFromValues>
        {...restProps}
        errors={errors}
        label={label}
        register={register}
        className={className}
      />

      {messageError && errors[label]?.type === "typeError" ? (
        <span className="text-sm text-rose-600">
          {INPUTS_TYPE_ERROR[label]}
        </span>
      ) : (
        messageError && (
          <span className="text-sm text-rose-600">{String(messageError)}</span>
        )
      )}
    </div>
  );
};

export default RowForm;
