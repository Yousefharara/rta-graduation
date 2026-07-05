import DashboardBMHero from "./sections/dashboardBMHero";
import DashbaordBMTable from "./sections/dashboardBMTable";

const DashboardBeneficiariesManagement = () => {
  return (
    <section className="flex flex-col gap-12">
      <DashboardBMHero />
      <DashbaordBMTable />
    </section>
  );
};

export default DashboardBeneficiariesManagement;
