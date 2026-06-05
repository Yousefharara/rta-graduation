import ActiveOrganization from "./sections/activeOrganization";
import HeroDashboardHome from "./sections/heroDashboardHome";
import RsourceAllocation from "./sections/resourceAllocation";

const DashboardPage = () => {
    return (
        <section className="flex flex-col gap-6"> 
            <HeroDashboardHome />
            <RsourceAllocation />
            <ActiveOrganization />
        </section>
    );
}

export default DashboardPage;
