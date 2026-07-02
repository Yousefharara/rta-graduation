import { Search, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getAids } from "@/redux/slices/aidSlice";
import { getAidTypes } from "@/redux/slices/aidTypes";
import type { IAid } from "@/@types/aid";
import ReactTable from "@/components/organisms/reactTable";
import Spinner from "@/components/feedback/Spinner";
import Error from "@/components/feedback/Error";

const PAGE_SIZE = 5;

const DashboardAidsTable = () => {
    const [search, setSearch] = useState("");

    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector((state) => state.auth);
    const { aids, isFetching, error } = useAppSelector((state) => state.aids);
    const { aidTypes } = useAppSelector((state) => state.aidTypes);
    const { localOrgs } = useAppSelector((state) => state.localOrg);

    useEffect(() => {
        if (accessToken) {
            if (aids.length === 0) dispatch(getAids(accessToken));
            if (aidTypes.length === 0) dispatch(getAidTypes(accessToken));
        }
    }, [dispatch, accessToken, aids.length, aidTypes.length]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const getAidTypeName = (id: number) => {
        const t = aidTypes.find((a) => Number(a.id) === Number(id));
        return t?.name || `#${id}`;
    };

    const getOrgName = (id: number) => {
        const o = localOrgs.find((org) => org.id === id);
        return o?.org_name || `#${id}`;
    };

    const filteredData = useMemo(() => {
        return aids.filter((item) => {
            const aidTypeName = getAidTypeName(item.aid_type_id);
            return (
                String(item.id).includes(search) ||
                item.batch_code.toLowerCase().includes(search.toLowerCase()) ||
                aidTypeName.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [aids, search]);

    const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

    const paginationData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredData.slice(start, end);
    }, [pagination, filteredData]);

    const columns = useMemo<ColumnDef<IAid>[]>(() => {
        return [
            {
                header: "رقم المساعدة",
                cell: ({ row }) => (
                    <p className="text-primary font-medium">#{row.original.id}</p>
                ),
            },
            {
                header: "كود الشحنة",
                cell: ({ row }) => (
                    <p className="text-sm font-mono">{row.original.batch_code}</p>
                ),
            },
            {
                header: "نوع المساعدة",
                cell: ({ row }) => (
                    <p className="px-4 text-sm font-semibold border border-zinc-400 py-2 w-fit rounded-md">
                        {getAidTypeName(row.original.aid_type_id)}
                    </p>
                ),
            },
            {
                header: "المنظمة",
                cell: ({ row }) => <p>{getOrgName(row.original.org_id)}</p>,
            },
            {
                header: "الكمية",
                cell: ({ row }) => <p>{row.original.quantity}</p>,
            },
            {
                header: "الكمية المتبقية",
                cell: ({ row }) => (
                    <p className={`font-semibold ${row.original.remaining_quantity <= 0 ? "text-red-600" : "text-green-600"}`}>
                        {row.original.remaining_quantity}
                    </p>
                ),
            },
            {
                header: "تاريخ الانتهاء",
                cell: ({ row }) => (
                    <p className="text-sm text-zinc-500">
                        {new Date(row.original.expiry_date).toLocaleDateString("ar-SA")}
                    </p>
                ),
            },
            {
                header: "الحالة",
                cell: ({ row }) => {
                    const { status, remaining_quantity } = row.original;
                    if (status === "active" && remaining_quantity > 0) {
                        return (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <Check size={12} />
                                نشط
                            </span>
                        );
                    }
                    if (remaining_quantity <= 0) {
                        return (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <X size={12} />
                                نفذت
                            </span>
                        );
                    }
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            غير نشط
                        </span>
                    );
                },
            },
        ];
    }, []);

    if (isFetching) {
        return (
            <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
                جاري تحميل المساعدات...
                <Spinner />
            </div>
        );
    }

    if (error)
        return (
            <Error
                onRetry={() => dispatch(getAids(accessToken || ""))}
            />
        );

    return (
        <section className="flex flex-col gap-4 p-3 border border-zinc-400 bg-white rounded-md">
            <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2">
                <Search size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-w-64 outline-0"
                    placeholder="بحث عن رقم المساعدة، كود الشحنة أو نوع المساعدة..."
                />
            </div>

            <article className="w-full overflow-x-auto">
                <ReactTable
                    columns={columns}
                    data={paginationData}
                    onPaginationChange={setPagination}
                    pagination={pagination}
                    pageCount={pageCount}
                />
            </article>
        </section>
    );
};

export default DashboardAidsTable;
