import DashboardComplaintsHero from "./sections/hero";
import DashboardComplaintsTable from "./sections/table";

const DashboardComplaints = () => {
    return (
        <section className="flex flex-col gap-6">
            <DashboardComplaintsHero />
            <DashboardComplaintsTable />
        </section>
    );
}

export default DashboardComplaints;
