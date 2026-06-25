import { useAppSelector } from "@/redux/store";
import ActiveOrganization from "./sections/activeOrganization";
import HeroDashboardHome from "./sections/heroDashboardHome";
import RsourceAllocation from "./sections/resourceAllocation";

const DashboardPage = () => {

    const {role} = useAppSelector(state => state.auth)

    return (
        <section className="flex flex-col gap-6"> 
            <HeroDashboardHome />
            <RsourceAllocation />
            {role === 'admin' && <ActiveOrganization />}
        </section>
    );
}

export default DashboardPage;
