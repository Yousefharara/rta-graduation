import Container from "@/components/atoms/container";
import TrackAidUserHero from "./sections/trackAidUserHero";
import TrackAidUserTableAids from "./sections/trackAidUserTableAids";
import TrackAidUserDescription from "./sections/trackAidUserDescription";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getBeneficiaryAids } from "@/redux/slices/beneficiaryAidSlice";
import { getAidTypes } from "@/redux/slices/aidTypes";

const TrackAidUser = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { beneficiaryAids } = useAppSelector((state) => state.beneficiaryAids);
  const { aidTypes } = useAppSelector((state) => state.aidTypes);

  useEffect(() => {
    if (accessToken) {
      if (beneficiaryAids.length === 0)
        dispatch(getBeneficiaryAids(accessToken));
      if (aidTypes.length === 0) dispatch(getAidTypes(accessToken));
    }
  }, [dispatch, accessToken, beneficiaryAids, aidTypes]);

  return (
    <section className="bg-[#F8F9FF] py-20">
      <Container className="flex flex-col gap-8">
        <TrackAidUserHero />
        <TrackAidUserTableAids />
        <TrackAidUserDescription />
      </Container>
    </section>
  );
};

export default TrackAidUser;
