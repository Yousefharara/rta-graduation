import Button from "@/components/atoms/button";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import { getAids } from "@/redux/slices/aidSlice";
import { getBeneficiaries } from "@/redux/slices/beneficiarySlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { PATHS } from "@/routes/paths";
import { UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardBMHero = () => {
  const navigate = useNavigate();
  const { accessToken, error, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const {
    beneficiaries,
    isFetching,
    error: beneficiaryError,
  } = useAppSelector((state) => state.beneficiaries);
  const {
    aids,
    error: aidError,
    isFetching: aidsFetching,
  } = useAppSelector((state) => state.aids);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (accessToken) {
      if (beneficiaries.length === 0) dispatch(getBeneficiaries(accessToken));
      if (aids.length === 0) dispatch(getAids(accessToken));
    }
  }, [accessToken, aids.length, beneficiaries.length, dispatch]);

  if (isFetching || isLoading || aidsFetching) return <Spinner />;

  return (
    <section className="flex flex-col gap-12">
      <article className="flex items-center gap-4 justify-between flex-wrap-reverse">
        <div>
          <h2
            className="font-semibold"
            style={{ fontSize: "clamp(22px, 5vw, 38px" }}
          >
            إدارة المستفيدين
          </h2>
          <p style={{ fontSize: "clamp(14px, 5vw, 22px)" }}>
            إدارة وتتبع بيانات العائلات والأفراد المسجلين في النظام.
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate(PATHS.DASHBOARD.BENEFICIARY_REGISTER)}
        >
          <UserPlus />
          <small className="text-lg">إضافة مستفيد جديد</small>
        </Button>
      </article>

      {error || beneficiaryError || aidError ? (
        <Error
          message={
            error
              ? error
              : beneficiaryError
                ? beneficiaryError
                : aidError
                  ? aidError
                  : ""
          }
          onRetry={() => dispatch(getBeneficiaries(accessToken || ""))}
        />
      ) : (
        <article
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div className="rounded-md text-white px-4 py-2 flex flex-col gap-2 bg-primary">
            <p className="">إجمالي المسجلين</p>
            <small className="text-3xl font-semibold">
              {beneficiaries.length}
            </small>
          </div>
          <div className="rounded-md px-4 py-2 flex flex-col gap-2 bg-[#D3E4FE]">
            <p className="">اجمال المساعدات الموجوده</p>
            <small className="text-3xl font-semibold">
              {aids.reduce((sum, aid) => sum + aid.remaining_quantity, 0)}
            </small>
          </div>
          <div className="rounded-md px-4 py-2 flex flex-col gap-2 bg-[#D3E4FE]">
            <p className="">في انتظار التحقق</p>
            <small className="text-3xl font-semibold">
              {beneficiaries.filter((b) => b.status === "pending").length}
            </small>
          </div>
          <div className="rounded-md px-4 py-2 flex flex-col gap-2 bg-[#6CF8BB]">
            <p className="">أولوية قصوى</p>
            <small className="text-3xl font-semibold">
              {beneficiaries.filter((b) => b.priority_score > 70).length}
            </small>
          </div>
        </article>
      )}
    </section>
  );
};

export default DashboardBMHero;
