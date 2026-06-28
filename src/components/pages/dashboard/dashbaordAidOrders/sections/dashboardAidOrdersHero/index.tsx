import { Package } from "lucide-react";
import "./style.css";
import { useAppSelector } from "@/redux/store";

interface HeroProps {
  statusFilter: "all" | "pending" | "approved" | "rejected";
  setStatusFilter: (status: "all" | "pending" | "approved" | "rejected") => void;
}

const DashboardAidOrdersHero = ({ statusFilter, setStatusFilter }: HeroProps) => {
  const { orders } = useAppSelector((state) => state.beneficiaryOrders);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const approvedOrders = orders.filter((o) => o.status === "approved").length;
  const rejectedOrders = orders.filter((o) => o.status === "rejected").length;

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">إدارة طلبات المساعدة</h1>
      <article
        className="manage-orders__grid grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        <div 
          onClick={() => setStatusFilter("all")}
          className={`px-6 py-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col gap-1 hover:shadow-md ${
            statusFilter === "all" ? "border-primary bg-blue-50/20 ring-1 ring-primary" : "border-zinc-400 bg-white"
          }`}
        >
          <div className="bg-[#E0E3E5] p-3 rounded-md w-fit">
            <Package className="text-zinc-600" />
          </div>

          <p className="font-medium text-zinc-700">جميع الطلبات</p>

          <small className="font-bold text-xl">{totalOrders}</small>
        </div>

        <div 
          onClick={() => setStatusFilter("pending")}
          className={`px-6 py-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col gap-1 hover:shadow-md ${
            statusFilter === "pending" ? "border-primary bg-blue-50/20 ring-1 ring-primary" : "border-zinc-400 bg-white"
          }`}
        >
          <div className="bg-[#DBE1FF] p-3 rounded-md w-fit">
            <svg
              width="19"
              height="21"
              viewBox="0 0 19 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 21C12.6167 21 11.4375 20.5125 10.4625 19.5375C9.4875 18.5625 9 17.3833 9 16C9 14.6167 9.4875 13.4375 10.4625 12.4625C11.4375 11.4875 12.6167 11 14 11C15.3833 11 16.5625 11.4875 17.5375 12.4625C18.5125 13.4375 19 14.6167 19 16C19 17.3833 18.5125 18.5625 17.5375 19.5375C16.5625 20.5125 15.3833 21 14 21ZM15.675 18.375L16.375 17.675L14.5 15.8V13H13.5V16.2L15.675 18.375ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.175C6.35833 1.41667 6.71667 0.9375 7.25 0.5625C7.78333 0.1875 8.36667 0 9 0C9.66667 0 10.2625 0.1875 10.7875 0.5625C11.3125 0.9375 11.6667 1.41667 11.85 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V10.25C17.7 10.0333 17.3833 9.85 17.05 9.7C16.7167 9.55 16.3667 9.41667 16 9.3V4H14V7H4V4H2V18H7.3C7.41667 18.3667 7.55 18.7167 7.7 19.05C7.85 19.3833 8.03333 19.7 8.25 20H2ZM9 4C9.28333 4 9.52083 3.90417 9.7125 3.7125C9.90417 3.52083 10 3.28333 10 3C10 2.71667 9.90417 2.47917 9.7125 2.2875C9.52083 2.09583 9.28333 2 9 2C8.71667 2 8.47917 2.09583 8.2875 2.2875C8.09583 2.47917 8 2.71667 8 3C8 3.28333 8.09583 3.52083 8.2875 3.7125C8.47917 3.90417 8.71667 4 9 4Z"
                fill="#004AC6"
              />
            </svg>
          </div>

          <p className="font-medium text-zinc-700">طلبات قيد الانتظار</p>

          <small className="font-bold text-xl">{pendingOrders}</small>
        </div>

        <div 
          onClick={() => setStatusFilter("approved")}
          className={`px-6 py-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col gap-1 hover:shadow-md ${
            statusFilter === "approved" ? "border-primary bg-blue-50/20 ring-1 ring-primary" : "border-zinc-400 bg-white"
          }`}
        >
          <div className="bg-[#6FFBBE] p-3 rounded-md w-fit">
            <svg
              width="22"
              height="21"
              viewBox="0 0 22 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21V21M8.45 18.45L11 17.35L13.6 18.45L15 16.05L17.75 15.4L17.5 12.6L19.35 10.5L17.5 8.35L17.75 5.55L15 4.95L13.55 2.55L11 3.65L8.4 2.55L7 4.95L4.25 5.55L4.5 8.35L2.65 10.5L4.5 12.6L4.25 15.45L7 16.05L8.45 18.45V18.45M11 10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5V10.5M9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05V14.05"
                fill="#006C49"
              />
            </svg>
          </div>

          <p className="font-medium text-zinc-700">تمت الموافقة</p>

          <small className="font-bold text-xl">{approvedOrders}</small>
        </div>

        <div 
          onClick={() => setStatusFilter("rejected")}
          className={`px-6 py-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col gap-1 hover:shadow-md ${
            statusFilter === "rejected" ? "border-primary bg-blue-50/20 ring-1 ring-primary" : "border-zinc-400 bg-white"
          }`}
        >
          <div className="bg-[#FFDAD6] p-3 rounded-md w-fit">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.4 15L10 11.4L13.6 15L15 13.6L11.4 10L15 6.4L13.6 5L10 8.6L6.4 5L5 6.4L8.6 10L5 13.6L6.4 15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                fill="#BA1A1A"
              />
            </svg>
          </div>

          <p className="font-medium text-zinc-700">طلبات مرفوضة</p>

          <small className="font-bold text-xl">{rejectedOrders}</small>
        </div>
      </article>
    </section>
  );
};

export default DashboardAidOrdersHero;
