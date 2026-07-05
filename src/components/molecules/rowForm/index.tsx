import { type InputHTMLAttributes } from "react";
import type {
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
  onlyPositiveNumbers?: boolean;
}

const RowForm = <TFromValues extends FieldValues>({
  label,
  title,
  register,
  errors,
  className,
  onlyPositiveNumbers,
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
        onlyPositiveNumbers={onlyPositiveNumbers}
      />

      {messageError && errors[label]?.type === "typeError" ? (
        <span className="text-sm text-rose-600">
          {INPUTS_TYPE_ERROR[label as keyof typeof INPUTS_TYPE_ERROR]}
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
