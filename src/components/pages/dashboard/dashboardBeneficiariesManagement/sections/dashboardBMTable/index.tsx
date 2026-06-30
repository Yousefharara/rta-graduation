import type { IBeneficiary } from "@/@types/beneficiary";
import type { IBeneficiaryVerification } from "@/@types/verfityBeneficiary";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import ReactTable from "@/components/organisms/reactTable";
import { getBeneficiaries } from "@/redux/slices/beneficiarySlice";
import { verifyBeneficiaryAction } from "@/redux/slices/verificationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { generateRandomAlgorithm } from "@/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Eye, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
            className={`px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors cursor-pointer ${isApprove
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
  const [confirmModal, setConfirmModal] = useState<{
    beneficiary: IBeneficiary;
    action: "approve" | "reject";
  } | null>(null);

  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const { beneficiaries, isFetching, error } = useAppSelector((state) => state.beneficiaries);
  const { isCreating } = useAppSelector(
    (state) => state.verifications,
  );

  useEffect(() => {
    dispatch(getBeneficiaries(accessToken || ""));
  }, [dispatch, accessToken]);

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
      setConfirmModal(null);
    });
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
        accessorKey: "algorithm",
        cell: () => {
          const algorithm = generateRandomAlgorithm();
          return (
            <p className="flex items-center gap-2">
              <div className="relative h-2 w-15">
                <div className="absolute inset-0 bg-zinc-200 rounded-md" />
                <div
                  style={{
                    background: `linear-gradient(
                                to left,
                                ${algorithm > 90 ? "red" : algorithm > 70 ? "orange" : algorithm > 50 ? "blue" : "green"} 0%,
                                ${algorithm > 90 ? "red" : algorithm > 70 ? "orange" : algorithm > 50 ? "blue" : "green"} ${algorithm}%,
                                transparent ${algorithm}%,
                                transparent 100%
                            )`,
                  }}
                  className="absolute inset-0 rounded-md z-10"
                />
              </div>
              {algorithm}
            </p>
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

  if(error) return <Error onRetry={() => dispatch(getBeneficiaries(accessToken || ""))}/>

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
