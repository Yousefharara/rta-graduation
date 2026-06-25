import Container from "@/components/atoms/container";
import HeroAbout from "./section/heroAbout";
import StatisticsAbout from "./section/statisticsAbout";
import VisionAbout from "./section/visionAbout";
import ValueAbout from "./section/valueAbout";
import TeamsAbout from "./section/teamsAbout";

const About = () => {
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
