import DashboardCampaignsHero from "./sections/hero";
import DashboardCampaignsTable from "./sections/table";

const DashboardCampaigns = () => {
    return (
        <section className="flex flex-col gap-6">
            <DashboardCampaignsHero />
            <DashboardCampaignsTable />
        </section>
    );
}

export default DashboardCampaigns;
