import DashboardCampaignsHero from "./sections/dashboardCampaignsHero";
import DashboardCampaignsTable from "./sections/dashboardCampaignsTable";

const DashboardCampaigns = () => {
  return (
    <section className="flex flex-col gap-6">
      <DashboardCampaignsHero />
      <DashboardCampaignsTable />
    </section>
  );
};

export default DashboardCampaigns;
