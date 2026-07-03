import { Search, Check, X, MessageCircle, Eye } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getComplaints, resolveCampaignAction } from "@/redux/slices/complaintSlice";
import { getBeneficiaries } from "@/redux/slices/beneficiarySlice";
import type { IComplaint } from "@/@types/complaint";
import ReactTable from "@/components/organisms/reactTable";
import Spinner from "@/components/feedback/Spinner";
import Error from "@/components/feedback/Error";
import { toast } from "sonner";

const PAGE_SIZE = 5;

const DashboardComplaintsTable = () => {
    const [search, setSearch] = useState("");
    const [resolveModal, setResolveModal] = useState<{
        complaint: IComplaint;
    } | null>(null);
    const [adminResponse, setAdminResponse] = useState("");
    const [viewModal, setViewModal] = useState<IComplaint | null>(null);

    const dispatch = useAppDispatch();
    const { accessToken } = useAppSelector((state) => state.auth);
    const { complaints, isFetching, isUpdating, error } = useAppSelector((state) => state.complaints);
    const { beneficiaries } = useAppSelector((state) => state.beneficiaries);

    useEffect(() => {
        if (accessToken) {
            dispatch(getComplaints(accessToken));
            if (beneficiaries.length === 0) dispatch(getBeneficiaries(accessToken));
        }
    }, [dispatch, accessToken, beneficiaries.length]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const getBeneficiaryName = useCallback((id: number) => {
        const b = beneficiaries.find((b) => b.id === id);
        return b?.users?.name || `#${id}`;
    }, [beneficiaries])

    const filteredData = useMemo(() => {
        return complaints.filter((item) => {
            const beneficiaryName = getBeneficiaryName(item.beneficiary_id);
            return (
                String(item.id).includes(search) ||
                beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
                item.subject.toLowerCase().includes(search.toLowerCase())
            );
        });
        // ! here
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [complaints, search]);

    const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

    const paginationData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredData.slice(start, end);
    }, [pagination, filteredData]);

    const handleResolve = async () => {
        if (!resolveModal || !adminResponse.trim()) {
            toast.error("يرجى كتابة رد المشرف");
            return;
        }
        const result = await dispatch(
            resolveCampaignAction(
                resolveModal.complaint.id,
                "resolved",
                adminResponse,
                accessToken || "",
            ),
        );
        if (result?.success) {
            toast.success("تم حل الشكوى بنجاح");
            setResolveModal(null);
            setAdminResponse("");
        } else {
            toast.error("حدث خطأ أثناء حل الشكوى");
        }
    };

    const columns = useMemo<ColumnDef<IComplaint>[]>(() => {
        return [
            {
                header: "رقم الشكوى",
                cell: ({ row }) => (
                    <p className="text-primary font-medium">#{row.original.id}</p>
                ),
            },
            {
                header: "المستفيد",
                cell: ({ row }) => <p>{getBeneficiaryName(row.original.beneficiary_id)}</p>,
            },
            {
                header: "الموضوع",
                cell: ({ row }) => (
                    <p className="max-w-40 truncate text-sm font-medium">{row.original.subject}</p>
                ),
            },
            {
                header: "الرسالة",
                cell: ({ row }) => (
                    <p className="max-w-50 truncate text-sm text-zinc-600">{row.original.message}</p>
                ),
            },
            {
                header: "الحالة",
                cell: ({ row }) => {
                    const { status } = row.original;
                    if (status === "open") {
                        return (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                مفتوحة
                            </span>
                        );
                    }
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Check size={12} />
                            تم الحل
                        </span>
                    );
                },
            },
            {
                header: "تاريخ الإنشاء",
                cell: ({ row }) => (
                    <p className="text-sm text-zinc-500">
                        {new Date(row.original.created_at).toLocaleDateString("ar-SA")}
                    </p>
                ),
            },
            {
                header: "الإجراءات",
                cell: ({ row }) => {
                    const { status } = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <button
                                title="عرض التفاصيل"
                                onClick={() => setViewModal(row.original)}
                                className="text-primary hover:text-blue-700 transition-colors cursor-pointer"
                            >
                                <Eye strokeWidth={1.3} size={20} />
                            </button>
                            {status === "open" && (
                                <button
                                    title="حل الشكوى"
                                    disabled={isUpdating}
                                    onClick={() => setResolveModal({ complaint: row.original })}
                                    className="cursor-pointer disabled:opacity-40"
                                >
                                    <MessageCircle
                                        size={22}
                                        strokeWidth={1.3}
                                        className="text-green-700"
                                    />
                                </button>
                            )}
                        </div>
                    );
                },
            },
        ];
    }, [getBeneficiaryName, isUpdating]);

    if (isFetching) {
        return (
            <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
                جاري تحميل الشكاوى...
                <Spinner />
            </div>
        );
    }

    if (error)
        return (
            <Error
                onRetry={() => dispatch(getComplaints(accessToken || ""))}
            />
        );

    return (
        <>
            {resolveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-green-100">
                                <MessageCircle className="text-green-600" size={22} />
                            </div>
                            <h2 className="text-lg font-semibold">حل الشكوى</h2>
                        </div>

                        <p className="text-zinc-600 text-sm">
                            الرد على شكوى: <strong>{resolveModal.complaint.subject}</strong>
                        </p>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-zinc-700">رد المشرف</label>
                            <textarea
                                rows={4}
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                                placeholder="اكتب ردك على الشكوى..."
                                className="border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setResolveModal(null);
                                    setAdminResponse("");
                                }}
                                disabled={isUpdating}
                                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleResolve}
                                disabled={isUpdating}
                                className={`px-4 py-2 rounded-lg text-sm text-white font-medium bg-green-600 hover:bg-green-700 transition-colors cursor-pointer ${isUpdating ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {isUpdating ? "جاري الحل..." : "تأكيد الحل"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">تفاصيل الشكوى</h2>
                            <button
                                onClick={() => setViewModal(null)}
                                className="cursor-pointer p-1 hover:bg-zinc-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 text-sm">
                            <div>
                                <span className="font-medium text-zinc-500">رقم الشكوى: </span>
                                <span>#{viewModal.id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-zinc-500">المستفيد: </span>
                                <span>{getBeneficiaryName(viewModal.beneficiary_id)}</span>
                            </div>
                            <div>
                                <span className="font-medium text-zinc-500">الموضوع: </span>
                                <span>{viewModal.subject}</span>
                            </div>
                            <div>
                                <span className="font-medium text-zinc-500">الرسالة: </span>
                                <p className="mt-1 p-3 bg-zinc-50 rounded-md">{viewModal.message}</p>
                            </div>
                            <div>
                                <span className="font-medium text-zinc-500">تاريخ الإنشاء: </span>
                                <span>{new Date(viewModal.created_at).toLocaleDateString("ar-SA")}</span>
                            </div>
                            <div>
                                <span className="font-medium text-zinc-500">الحالة: </span>
                                <span className={viewModal.status === "open" ? "text-amber-600" : "text-green-600"}>
                                    {viewModal.status === "open" ? "مفتوحة" : "تم الحل"}
                                </span>
                            </div>
                            {viewModal.admin_response && (
                                <div>
                                    <span className="font-medium text-zinc-500">رد المشرف: </span>
                                    <p className="mt-1 p-3 bg-green-50 rounded-md">{viewModal.admin_response}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <section className="flex flex-col gap-4 p-3 border border-zinc-400 bg-white rounded-md">
                <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2">
                    <Search size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-0 w-full"
                        placeholder="بحث عن رقم الشكوى، اسم المستفيد أو الموضوع..."
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
        </>
    );
};

export default DashboardComplaintsTable;
