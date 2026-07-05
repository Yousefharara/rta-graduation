import { Helmet } from "react-helmet-async";
import HeroHome from "./sections/heroHome";
import Container from "@/components/atoms/container";
import StatisticsHome from "./sections/statisticsHome";
import BenefitsHome from "./sections/benefitsHome";
import StepHome from "./sections/stepHome";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <section className="flex flex-col gap-8">
        <Container>
          <HeroHome />
        </Container>

        <StatisticsHome />
        <Container>
          <BenefitsHome />
        </Container>

        <Container>
          <StepHome />
        </Container>
      </section>
    </>
  );
};

export default HomePage;
