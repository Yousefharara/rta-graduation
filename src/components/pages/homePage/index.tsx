import { Helmet } from "react-helmet-async";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <div className="bg-green-500 shadow-xl text-shadow text-4xl text-white font-bold p-4">
        هلا يوسف
      </div>
    </>
  );
};

export default HomePage;
