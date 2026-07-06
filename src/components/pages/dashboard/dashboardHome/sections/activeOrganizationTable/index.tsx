import type { ILocalOrg } from "@/@types/localOrg";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import ReactTable from "@/components/organisms/reactTable";
import { getAreas } from "@/redux/slices/areaSlice";
import {
  deleteLocalOrgAction,
  getLocalOrgs,
  verifyLocalOrgAction,
} from "@/redux/slices/localOrgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  Eye,
  Search,
  Trash2,
  Pencil,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { toast } from "sonner";

const PAGE_SIZE = 5;

const ActiveOrganization = () => {
  const [filteredName, setFilteredName] = useState<string>("");
  const [viewModal, setViewModal] = useState<ILocalOrg | null>(null);
  const [deleteModal, setDeleteModal] = useState<ILocalOrg | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const { localOrgs, isFetching, isUpdating, isDeleting, error } =
    useAppSelector((state) => state.localOrg);
  const { accessToken } = useAppSelector((state) => state.auth);
  const { areas } = useAppSelector((state) => state.areas);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      dispatch(getAreas(accessToken));
      dispatch(getLocalOrgs(accessToken));
    }
  }, [dispatch, accessToken]);

  const filteredData = useMemo(() => {
    return localOrgs.filter((data) =>
      data.org_name.toLowerCase().includes(filteredName.toLowerCase()),
    );
  }, [filteredName, localOrgs]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const handleEdit = (org: ILocalOrg) => {
    navigate(PATHS.DASHBOARD.ORG_REGISTER, { state: { org } });
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    const result = await dispatch(
      deleteLocalOrgAction(deleteModal.id, accessToken || ""),
    );
    if (result?.success) {
      dispatch(getLocalOrgs(accessToken || ""));
      setDeleteModal(null);
      toast.success("تم حذف المنظمة بنجاح");
    } else {
      toast.error("حدث خطأ أثناء حذف المنظمة");
    }
  };

  const handleVerify = async (id: number) => {
    const result = await dispatch(
      verifyLocalOrgAction(id, true, accessToken || ""),
    );
    if (result?.success) {
      dispatch(getLocalOrgs(accessToken || ""));
      toast.success("تم التحقق من المنظمة بنجاح");
    } else {
      toast.error("حدث خطأ أثناء التحقق من المنظمة");
    }
  };

  const getAreaName = (areaId: number) => {
    return areas.find((a) => a.id === areaId)?.name || `#${areaId}`;
  };

  const columns = useMemo<ColumnDef<ILocalOrg>[]>(() => {
    return [
      {
        header: "اسم المنظمة",
        accessorFn: (row) => `${row.users.name}`,
      },
      {
        header: "المنطقة",
        accessorKey: "area_id",
        cell: ({ row }) => {
          const { area_id } = row.original;
          return <p>{getAreaName(area_id)}</p>;
        },
      },
      {
        header: "مجال التركيز",
        accessorKey: "AreaOfFocus",
        cell: ({ row }) => {
          const { focus_area } = row.original;
          return <p>{focus_area}</p>;
        },
      },
      {
        header: "طاقم العمل",
        accessorFn: (row) => row.staff_count,
      },
      {
        header: "الإجراءات",
        cell: ({ row }) => {
          const { id, is_verified } = row.original;
          return (
            <div className="flex items-center gap-3">
              <button
                title="عرض التفاصيل"
                onClick={() => setViewModal(row.original)}
                className="text-primary hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Eye strokeWidth={1.3} size={20} />
              </button>
              {!is_verified && (
                <button
                  title="التحقق من المنظمة"
                  disabled={isUpdating}
                  onClick={() => handleVerify(id)}
                  className="cursor-pointer disabled:opacity-40"
                >
                  <ShieldCheck
                    size={22}
                    strokeWidth={1.3}
                    className="text-amber-600 hover:text-amber-700"
                  />
                </button>
              )}
              {is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <Check size={12} />
                  موثقة
                </span>
              )}
            </div>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdating]);

  if (isFetching) {
    return (
      <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
        جاري تحميل المنظمات...
        <Spinner />
      </div>
    );
  }

  if (error)
    return <Error onRetry={() => dispatch(getLocalOrgs(accessToken || ""))} />;

  return (
    <>
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">تفاصيل المنظمة</h2>
              <button
                onClick={() => setViewModal(null)}
                className="cursor-pointer p-1 hover:bg-zinc-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="font-medium text-zinc-500">اسم المنظمة: </span>
                <span>{viewModal.users.name}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  الاسم بالإنجليزية:{" "}
                </span>
                <span>{viewModal.org_name}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  البريد الإلكتروني:{" "}
                </span>
                <span>{viewModal.users.email}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">رقم الجوال: </span>
                <span>{viewModal.users.phone}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">المنطقة: </span>
                <span>{getAreaName(viewModal.area_id)}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  مجال التركيز:{" "}
                </span>
                <span>{viewModal.focus_area}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">طاقم العمل: </span>
                <span>{viewModal.staff_count}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">حالة التحقق: </span>
                <span
                  className={
                    viewModal.is_verified ? "text-green-600" : "text-amber-600"
                  }
                >
                  {viewModal.is_verified ? "موثقة" : "غير موثقة"}
                </span>
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
                تعديل المنظمة
              </button>
              <button
                onClick={() => {
                  setDeleteModal(viewModal);
                  setViewModal(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                حذف المنظمة
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
              هل أنت متأكد من حذف المنظمة{" "}
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

      <section className="flex flex-col rounded-lg border border-zinc-300">
        <article className="px-6 py-4 flex justify-between items-center gap-4 flex-wrap bg-primary/10">
          <p className="text-primary-foreground text-lg font-semibold">
            المنظمات المصغرة النشطة
          </p>
          <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-1 bg-white">
            <Search size={16} />
            <input
              type="text"
              value={filteredName}
              onChange={(e) => setFilteredName(e.target.value)}
              className="outline-0 text-sm"
              placeholder="بحث..."
            />
          </div>
        </article>
        <article className="overflow-x-auto">
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

export default ActiveOrganization;
