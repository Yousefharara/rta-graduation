import type { IBeneficiary } from "@/@types/beneficiary";
import type { IBeneficiaryVerification } from "@/@types/verfityBeneficiary";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import ReactTable from "@/components/organisms/reactTable";
import {
  deleteBeneficiaryAction,
  getBeneficiaries,
} from "@/redux/slices/beneficiarySlice";
import { verifyBeneficiaryAction } from "@/redux/slices/verificationSlice";
import { createNotificationAction } from "@/redux/slices/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, Search, X, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { toast } from "sonner";

type IDataTable = IBeneficiary;

const PAGE_SIZE = 5;

// ---- Modal تأكيد ----
interface ConfirmModalProps {
  beneficiaryName: string;
  action: "approve" | "reject";
  onConfirm: (notes: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmModal = ({
  beneficiaryName,
  action,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) => {
  const [notes, setNotes] = useState("");
  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${isApprove ? "bg-green-100" : "bg-red-100"}`}
          >
            {isApprove ? (
              <Check className="text-green-600" size={22} />
            ) : (
              <X className="text-red-600" size={22} />
            )}
          </div>
          <h2 className="text-lg font-semibold">
            {isApprove ? "تأكيد قبول المستفيد" : "تأكيد رفض المستفيد"}
          </h2>
        </div>

        <p className="text-zinc-600 text-sm">
          هل أنت متأكد من{" "}
          <span className={isApprove ? "text-green-600" : "text-red-600"}>
            {isApprove ? "قبول" : "رفض"}
          </span>{" "}
          المستفيد <strong>{beneficiaryName}</strong>؟
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            ملاحظات (اختياري)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أضف ملاحظاتك هنا..."
            className="border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={() => onConfirm(notes)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors cursor-pointer ${
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "جاري التنفيذ..." : isApprove ? "قبول" : "رفض"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Component رئيسي ----
const DashbaordBMTable = () => {
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState<IBeneficiary | null>(null);
  const [deleteModal, setDeleteModal] = useState<IBeneficiary | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    beneficiary: IBeneficiary;
    action: "approve" | "reject";
  } | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const { beneficiaries, isFetching, isDeleting, error } = useAppSelector(
    (state) => state.beneficiaries,
  );
  const { isCreating } = useAppSelector((state) => state.verifications);

  useEffect(() => {
    if (accessToken) {
      if (beneficiaries.length === 0) dispatch(getBeneficiaries(accessToken));
    }
  }, [dispatch, accessToken, beneficiaries.length]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const filteredData = useMemo(() => {
    return beneficiaries.filter((item) => {
      const matchesSearch =
        item.users.name.toLowerCase().includes(search.toLowerCase()) ||
        item.national_id.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [beneficiaries, search]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const handleConfirm = (notes: string) => {
    if (!confirmModal || !user) return;

    const body: IBeneficiaryVerification = {
      beneficiary_id: confirmModal.beneficiary.id,
      verified_by: user.id,
      result: confirmModal.action === "approve" ? "approved" : "rejected",
      notes,
    };

    dispatch(verifyBeneficiaryAction(body, accessToken || "")).then(() => {
      dispatch(getBeneficiaries(accessToken || ""));
      const isApproved = confirmModal.action === "approve";
      dispatch(
        createNotificationAction(
          {
            user_id: confirmModal.beneficiary.user_id,
            title: isApproved ? "تم قبول طلب التوثيق" : "تم رفض طلب التوثيق",
            message: isApproved
              ? `تم توثيق حسابك بنجاح، يمكنك الآن طلب المساعدة`
              : `عذراً، تم رفض طلب توثيق حسابك`,
          },
          accessToken || "",
        ),
      );
      setConfirmModal(null);
    });
  };

  const handleEdit = (beneficiary: IBeneficiary) => {
    navigate(PATHS.DASHBOARD.BENEFICIARY_REGISTER, { state: { beneficiary } });
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    await dispatch(deleteBeneficiaryAction(deleteModal.id, accessToken || ""));
    dispatch(getBeneficiaries(accessToken || ""));
    setDeleteModal(null);
    toast.success("تم حذف المستفيد بنجاح");
  };

  const columns = useMemo<ColumnDef<IDataTable>[]>(() => {
    return [
      {
        header: "اسم المستفيد",
        accessorFn: (row) => `${row.users.name}`,
      },
      {
        header: "الرقم التعريفي",
        accessorFn: (row) => `${row.national_id}`,
      },
      {
        header: "حجم العائلة",
        accessorKey: "familySize",
        cell: ({ row }) => {
          const { family_size } = row.original;
          return <p>{family_size} أفراد</p>;
        },
      },
      {
        header: "الأولويه (الخوارزميه)",
        accessorKey: "priority_score",
        cell: ({ row }) => {
          let { priority_score } = row.original;
          priority_score = Math.round(Number(priority_score));
          return (
            <article className="flex items-center gap-2">
              <div className="relative h-2 w-15">
                <div className="absolute inset-0 bg-zinc-200 rounded-md" />
                <div
                  style={{
                    background: `linear-gradient(
                                to left,
                                ${priority_score > 90 ? "red" : priority_score > 70 ? "orange" : priority_score > 50 ? "blue" : "green"} 0%,
                                ${priority_score > 90 ? "red" : priority_score > 70 ? "orange" : priority_score > 50 ? "blue" : "green"} ${priority_score}%,
                                transparent ${priority_score}%,
                                transparent 100%
                            )`,
                  }}
                  className="absolute inset-0 rounded-md z-10"
                />
              </div>
              {priority_score}
            </article>
          );
        },
      },
      {
        header: "حالة التحقق",
        cell: ({ row }) => {
          const { status } = row.original;

          if (status === "pending") {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                في الانتظار
              </span>
            );
          }

          if (status === "eligible") {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Check size={12} />
                مؤهل
              </span>
            );
          }

          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <X size={12} />
              غير مؤهل
            </span>
          );
        },
      },
      {
        header: "الاجراءات",
        cell: ({ row }) => {
          const isPending = row.original.status === "pending";

          return (
            <div className="flex items-center gap-2">
              <button
                title="عرض التفاصيل"
                onClick={() => setViewModal(row.original)}
                className="text-primary hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Eye strokeWidth={1.3} size={18} />
              </button>

              {isPending && (
                <>
                  <button
                    title="قبول المستفيد"
                    onClick={() =>
                      setConfirmModal({
                        beneficiary: row.original,
                        action: "approve",
                      })
                    }
                    className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors cursor-pointer"
                  >
                    <Check size={15} />
                  </button>

                  <button
                    title="رفض المستفيد"
                    onClick={() =>
                      setConfirmModal({
                        beneficiary: row.original,
                        action: "reject",
                      })
                    }
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  }, []);

  if (isFetching) {
    return (
      <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
        جاري تحميل المستفيدين...
        <Spinner />
      </div>
    );
  }

  if (error)
    return (
      <Error onRetry={() => dispatch(getBeneficiaries(accessToken || ""))} />
    );

  return (
    <>
      {confirmModal && (
        <ConfirmModal
          beneficiaryName={confirmModal.beneficiary.users.name}
          action={confirmModal.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(null)}
          isLoading={isCreating}
        />
      )}

      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">تفاصيل المستفيد</h2>
              <button
                onClick={() => setViewModal(null)}
                className="cursor-pointer p-1 hover:bg-zinc-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="font-medium text-zinc-500">الاسم: </span>
                <span>{viewModal.users.name}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  الرقم التعريفي:{" "}
                </span>
                <span>{viewModal.national_id}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">حجم العائلة: </span>
                <span>{viewModal.family_size} أفراد</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">الدخل: </span>
                <span>{viewModal.income}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  درجة الأولوية:{" "}
                </span>
                <span
                  className={
                    viewModal.priority_score > 70
                      ? "text-red-600 font-semibold"
                      : "text-green-600"
                  }
                >
                  {Math.round(Number(viewModal.priority_score))}
                </span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">حالة التحقق: </span>
                <span
                  className={
                    viewModal.status === "eligible"
                      ? "text-green-600"
                      : viewModal.status === "not_eligible"
                        ? "text-red-600"
                        : "text-amber-600"
                  }
                >
                  {viewModal.status === "eligible"
                    ? "مؤهل"
                    : viewModal.status === "not_eligible"
                      ? "غير مؤهل"
                      : "في الانتظار"}
                </span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">عدد المرضى: </span>
                <span>{viewModal.patients_count}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  عدد ذوي الإعاقة:{" "}
                </span>
                <span>{viewModal.disabled_count}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">نازح: </span>
                <span>{viewModal.is_displaced ? "نعم" : "لا"}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => {
                  handleEdit(viewModal);
                  setViewModal(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Pencil size={16} />
                تعديل المستفيد
              </button>
              <button
                onClick={() => {
                  setDeleteModal(viewModal);
                  setViewModal(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                حذف المستفيد
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <Trash2 className="text-red-600" size={22} />
              </div>
              <h2 className="text-lg font-semibold">تأكيد الحذف</h2>
            </div>

            <p className="text-zinc-600 text-sm">
              هل أنت متأكد من حذف المستفيد{" "}
              <strong>{deleteModal.users.name}</strong>؟
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg text-sm text-white font-medium bg-red-600 hover:bg-red-700 transition-colors cursor-pointer ${isDeleting ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-64 outline-0"
            placeholder="بحث عن اسم أو الرقم التعريفي..."
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

export default DashbaordBMTable;
