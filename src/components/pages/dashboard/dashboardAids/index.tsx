import DashboardAidsHero from "./sections/hero";
import DashboardAidsTable from "./sections/table";

const DashboardAids = () => {
  return (
    <section className="flex flex-col gap-6">
      <DashboardAidsHero />
      <DashboardAidsTable />
    </section>
  );
};

export default DashboardAids;
