import { Helmet } from "react-helmet-async";
import HeroHome from "./sections/heroHome";
import Container from "@/components/atoms/container";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <section className="">
        <Container>

          <HeroHome />

        </Container>
      </section>
    </>
  );
};

export default HomePage;
