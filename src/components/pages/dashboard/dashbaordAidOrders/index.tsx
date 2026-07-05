import { useState } from "react";
import DashboardAidOrdersFooter from "./sections/dashboardAidOrdersFooter";
import DashboardAidOrdersHero from "./sections/dashboardAidOrdersHero";
import DashboardAidOrdersTable from "./sections/dashboardAidOrdersTable";

type orderAidStatus = "pending" | "approved" | "rejected";

const DashboardAidOrders = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | orderAidStatus>(
    "all",
  );

  return (
    <section className="flex flex-col gap-6">
      <DashboardAidOrdersHero
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <DashboardAidOrdersTable
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <DashboardAidOrdersFooter />
    </section>
  );
};

export default DashboardAidOrders;
