import Container from "@/components/atoms/container";
import HeroAbout from "./section/heroAbout";
import StatisticsAbout from "./section/statisticsAbout";
import VisionAbout from "./section/visionAbout";
import ValueAbout from "./section/valueAbout";
import TeamsAbout from "./section/teamsAbout";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { getCampaigns } from "@/redux/slices/campaignSlice";

const About = () => {
  const { campaigns, isLoading, errorMessage } = useAppSelector(
    (state) => state.campaigns,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
}

if (errorMessage) {
    return (
        <ErrorMessage
            message={errorMessage}
        />
    );
}

  return (
    <section className="flex flex-col gap-12">
      <HeroAbout />
      <Container>
        <StatisticsAbout />
      </Container>

      <VisionAbout />

      <Container>
        <ValueAbout />
      </Container>

      <TeamsAbout />
    </section>
  );
};

export default About;
