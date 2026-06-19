
import * as Yup from 'yup'
import type { IRegisterBeneficiaryForm } from "@/@types/forms";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RowForm from '@/components/molecules/rowForm';


const defaultValues: IRegisterBeneficiaryForm = {
    name: "",
    disableCount: 0,
    familySize: 0,
    income: 0,
    mobileNumber: "",
    nationalId: "",
    patientCount: 0,
    status: "pending",
    email: ""
};


const schemaRegisterBeneficiaryFrom: Yup.ObjectSchema<IRegisterBeneficiaryForm> = Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    nationalId: Yup.string().required("رقم الهويه مطلوبه"),
    disableCount: Yup.number().required(),
    familySize: Yup.number().required(),
    mobileNumber: Yup.string().required(),
    email: Yup.string().nullable(),
    status: Yup.string().oneOf(["pending", "agreenment", "rejected"]).required(),
    income: Yup.number().required(),
    patientCount: Yup.number().required(),


});


const DashboardBeneficiaryRegister = () => {

    const {
        formState: { errors },
        handleSubmit,
        reset,
        watch,
        register,
    } = useForm<IRegisterBeneficiaryForm>({ resolver: yupResolver(schemaRegisterBeneficiaryFrom) });

    const handleOnSubmit = (data: IRegisterBeneficiaryForm) => {
        console.log('data , ', data);
    };

    return (
        <section>

            <form
                className="flex flex-col gap-12"
                onSubmit={handleSubmit(handleOnSubmit)}
            >


                <article className='flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4'>

                    <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>المعلومات الشخصية</h3>
                    <span className='h-px w-full bg-zinc-200 block' />

                    <div className='flex flex-col gap-4 items-center justify-between sm:flex-row'>
                        <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='name'
                            title='الاسم الكامل (كما في الهوية) '
                            register={register}
                            placeholder='مثال: محمد أحمد علي'
                        />
                        <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='nationalId'
                            title='رقم الهوية الوطنية / جواز السفر'
                            register={register}
                            placeholder='0000000000'
                        />
                    </div>


                    <div className='flex flex-col gap-4 items-center justify-between sm:flex-row'>
                        <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='mobileNumber'
                            title='رقم الجوال'
                            register={register}
                            placeholder='05XXXXXXX'
                        />
                        <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='email'
                            title='البريد الإلكتروني (اختياري)'
                            register={register}
                            placeholder='example@gmail.com'
                        />
                    </div>

                </article>


                <article className='flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4'>

                    <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>تفاصيل الأسرة  </h3>
                    <span className='h-px w-full bg-zinc-200 block' />

                    <div className='flex flex-col gap-4 items-center justify-between sm:flex-row'>
                        <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='familySize'
                            type='number'
                            title='إجمالي عدد أفراد الأسرة'
                            register={register}
                        />
                        <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='patientCount'
                            type='number'
                            title='عدد المرضى '
                            register={register}
                        />


                        <div>
                            <select
                                defaultValue={"select"}
                                {...register("")}
                            >
                                <option disabled value="select">
                                    Select
                                </option>
                                <option value="coffee">Coffe</option>
                                <option value="tea">Tea</option>
                                <option value="juice">Juice</option>
                            </select>
                            {errors["selectOption"] && (
                                <span className="span__error">
                                    {errors["selectOption"]?.message}
                                </span>
                            )}
                        </div>


                    </div>


                    <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='income'
                            type='number'
                            title='الدخل الحالي للاسرة'
                            register={register}
                        />

                </article>



                <article className='flex flex-col gap-4 bg-white rounded-md border border-zinc-300 px-6 py-4'>

                    <h3 style={{ fontSize: "clamp(18px, 5vw, 28px)" }}>الموقع الجغرافي</h3>
                    <span className='h-px w-full bg-zinc-200 block' />

                    <div className='flex flex-col gap-4 items-center justify-between sm:flex-row'>


                        <div>


                            <select
                                defaultValue={"select"}
                                {...register("")}
                            >
                                <option disabled value="select">
                                    Select
                                </option>
                                <option value="coffee">Coffe</option>
                                <option value="tea">Tea</option>
                                <option value="juice">Juice</option>
                            </select>
                            {errors["selectOption"] && (
                                <span className="span__error">
                                    {errors["selectOption"]?.message}
                                </span>
                            )}
                        </div>

                        <div>


                            <select
                                defaultValue={"select"}
                                {...register("")}
                            >
                                <option disabled value="select">
                                    Select
                                </option>
                                <option value="coffee">Coffe</option>
                                <option value="tea">Tea</option>
                                <option value="juice">Juice</option>
                            </select>
                            {errors["selectOption"] && (
                                <span className="span__error">
                                    {errors["selectOption"]?.message}
                                </span>
                            )}
                        </div>


                    </div>


                    <RowForm<IRegisterBeneficiaryForm>
                            errors={errors}
                            label='income'
                            title='أقرب معلم بارز (مسجد، مدرسة، مستشفى) *'
                            register={register}
                        />

                </article>



            </form>



        </section>
    );
}

export default DashboardBeneficiaryRegister;
