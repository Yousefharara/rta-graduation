import DashboardAidOrdersFooter from "./sections/dashboardAidOrdersFooter";
import DashboardAidOrdersHero from "./sections/dashboardAidOrdersHero";
import DashboardAidOrdersTable from "./sections/dashboardAidOrdersTable";

const DashboardAidOrders = () => {
    return (
        <section className="flex flex-col gap-6">
            <DashboardAidOrdersHero />
            <DashboardAidOrdersTable />
            <DashboardAidOrdersFooter />
        </section>
    );
}

export default DashboardAidOrders;
