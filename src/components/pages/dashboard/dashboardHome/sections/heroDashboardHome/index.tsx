import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import { getBeneficiaryOrders } from "@/redux/slices/beneficiaryOrderSlice";
import { getBeneficiaries } from "@/redux/slices/beneficiarySlice";
import { getLocalOrgs } from "@/redux/slices/localOrgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { HeartHandshake, LayoutPanelTop, UsersRound } from "lucide-react";
import { useEffect } from "react";

const HeroDashboardHome = () => {
  const dispatch = useAppDispatch();
  const { role, accessToken, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );
  const {
    beneficiaries,
    isFetching,
    error: beneficiaryError,
  } = useAppSelector((state) => state.beneficiaries);
  const {
    orders,
    isFetching: ordersFetching,
    error: orderError,
  } = useAppSelector((state) => state.beneficiaryOrders);
  const {
    localOrgs,
    isFetching: orgsFetching,
    error: orgError,
  } = useAppSelector((state) => state.localOrg);

  useEffect(() => {
    if (accessToken && role === 'admin') {
      if (beneficiaries.length === 0) dispatch(getBeneficiaries(accessToken));
      if (orders.length === 0) dispatch(getBeneficiaryOrders(accessToken));
      if (localOrgs.length === 0) dispatch(getLocalOrgs(accessToken));
    }
    if (accessToken && role === 'local_org') {
      if (beneficiaries.length === 0) dispatch(getBeneficiaries(accessToken));
      if (orders.length === 0) dispatch(getBeneficiaryOrders(accessToken));
    }
  }, [
    accessToken,
    beneficiaries.length,
    dispatch,
    localOrgs.length,
    orders.length,
    role,
  ]);

  if (isLoading || isFetching || ordersFetching || orgsFetching) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if(role === 'admin') {
    if (error || beneficiaryError || orderError || orgError) {
    return (
      <Error onRetry={() => dispatch(getBeneficiaries(accessToken || ""))} />
    );
  }
  }else {
    if (error || beneficiaryError || orderError) {
    return (
      <Error onRetry={() => dispatch(getBeneficiaries(accessToken || ""))} />
    );
  }
  }

  return (
    <section className="flex flex-col gap-8">
      <article className="flex justify-between flex-wrap gap-6">
        <h1
          className="text-primary-foreground font-semibold"
          style={{ fontSize: "clamp(22px, 5vw, 32px" }}
        >
          لوحة التحكم
        </h1>
      </article>

      <article
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr)" }}
      >
        <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
          <div className="px-4 py-3 rounded-lg bg-primary/20">
            <UsersRound />
          </div>
          <div>
            <small className="font-medium">إجمالي المستفيدين</small>
            <p className="text-3xl font-semibold text-primary-foreground">
              {beneficiaries.filter(b => b.status === 'eligible').length}
            </p>
          </div>
        </section>

        <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
          <div className="px-4 py-3 rounded-lg bg-primary/20">
            <HeartHandshake />
          </div>
          <div>
            <small className="font-medium">إجمالي المساعدات الموزعة</small>
            <p className="text-3xl font-semibold text-primary-foreground">
              {orders.filter(o => o.status === "approved").length}
            </p>
          </div>
        </section>

        {role === 'admin' && <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
          <div className="px-4 py-3 rounded-lg bg-primary/20">
            <LayoutPanelTop />
          </div>
          <div>
            <small className="font-medium">المنظمات المصغرة</small>
            <p className="text-3xl font-semibold text-primary-foreground">
              {localOrgs.length}
            </p>
          </div>
        </section>}
      </article>
    </section>
  );
};

export default HeroDashboardHome;
