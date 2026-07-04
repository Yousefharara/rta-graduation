import {
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Plus,
  Check,
  Megaphone,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isNumberArray, type ColumnDef } from "@tanstack/react-table";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  getCampaigns,
  addCampaignAction,
  editCampaignAction,
  deleteCampaignAction,
} from "@/redux/slices/campaignSlice";
import type { ICampaign, ICreateCampaign } from "@/@types/campaign";
import ReactTable from "@/components/organisms/reactTable";
import Spinner from "@/components/feedback/Spinner";
import Error from "@/components/feedback/Error";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/button";

const PAGE_SIZE = 5;

const defaultFormValues: ICreateCampaign = {
  title: "",
  description: "",
  target_amount: "",
  start_date: new Date(),
  end_date: new Date(),
};

const DashboardCampaignsTable = () => {
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState<ICampaign | null>(null);
  const [deleteModal, setDeleteModal] = useState<ICampaign | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<ICampaign | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [formValues, setFormValues] =
    useState<ICreateCampaign>(defaultFormValues);
  const [editFormValues, setEditFormValues] = useState<
    ICreateCampaign & { status?: "active" | "closed" }
  >({} as any);

  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { campaigns, isFetching, isCreating, isUpdating, isDeleting, error } =
    useAppSelector((state) => state.campaigns);

  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const formatAmount = useCallback((amount: number | string) => {
    if (amount === null || amount === 0) return "غير محدود";
    return Number(amount).toLocaleString();
  }, []);

  const filteredData = useMemo(() => {
    return campaigns.filter((item) => {
      const searchLower = search.toLowerCase();
      return (
        String(item.id).includes(search) ||
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, search]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const resetAddForm = () => {
    setFormValues(defaultFormValues);
    setIsUnlimited(false);
  };

  const handleAdd = async () => {
    if (!formValues.title.trim() || !formValues.description.trim()) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    const body: ICreateCampaign = {
      ...formValues,
      target_amount: isUnlimited
        ? null
        : formValues.target_amount || 0,
    };
    const result = await dispatch(addCampaignAction(body, accessToken || ""));
    if (result?.success) {
      toast.success("تم إضافة الحملة بنجاح");
      setAddDialogOpen(false);
      resetAddForm();
    } else {
      toast.error("حدث خطأ أثناء إضافة الحملة");
    }
  };

  const openEditDialog = (campaign: ICampaign) => {
    setEditCampaign(campaign);
    setEditFormValues({
      title: campaign.title,
      description: campaign.description,
      target_amount:
        campaign.target_amount === 0
          ? null
          : campaign.target_amount,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      status: campaign.status,
    });
    setIsUnlimited(campaign.target_amount === 0);
    setEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editCampaign) return;
    if (!editFormValues.title.trim() || !editFormValues.description.trim()) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    const body = {
      id: editCampaign.id,
      title: editFormValues.title,
      description: editFormValues.description,
      target_amount: isUnlimited
        ? "unlimited"
        : editFormValues.target_amount || "0",
      start_date: editFormValues.start_date,
      end_date: editFormValues.end_date,
    };
    const result = await dispatch(
      editCampaignAction(body as any, accessToken || ""),
    );
    if (result?.success) {
      toast.success("تم تحديث الحملة بنجاح");
      setEditDialogOpen(false);
      setEditCampaign(null);
    } else {
      toast.error("حدث خطأ أثناء تحديث الحملة");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    await dispatch(deleteCampaignAction(deleteModal.id));
    toast.success("تم حذف الحملة بنجاح");
    setDeleteModal(null);
  };

  const columns = useMemo<ColumnDef<ICampaign>[]>(() => {
    return [
      {
        header: "رقم الحملة",
        cell: ({ row }) => (
          <p className="text-primary font-medium">#{row.original.id}</p>
        ),
      },
      {
        header: "العنوان",
        cell: ({ row }) => (
          <p className="max-w-40 truncate text-sm font-medium">
            {row.original.title}
          </p>
        ),
      },
      {
        header: "الوصف",
        cell: ({ row }) => (
          <p className="max-w-50 truncate text-sm text-zinc-600">
            {row.original.description}
          </p>
        ),
      },
      {
        header: "المبلغ المستهدف",
        cell: ({ row }) => (
          <p className="text-sm font-medium">
            {formatAmount(String(row.original.target_amount))}
          </p>
        ),
      },
      {
        header: "المبلغ المجموع",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-green-600">
            {formatAmount(row.original.collected_amount)}
          </p>
        ),
      },
      {
        header: "تاريخ البداية",
        cell: ({ row }) => (
          <p className="text-sm text-zinc-500">
            {new Date(row.original.start_date).toLocaleDateString("ar-SA")}
          </p>
        ),
      },
      {
        header: "تاريخ النهاية",
        cell: ({ row }) => (
          <p className="text-sm text-zinc-500">
            {new Date(row.original.end_date).toLocaleDateString("ar-SA")}
          </p>
        ),
      },
      {
        header: "الحالة",
        cell: ({ row }) => {
          const { status } = row.original;
          if (status === "active") {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                نشطة
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
              <Check size={12} />
              منتهية
            </span>
          );
        },
      },
      {
        header: "الإجراءات",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <button
                title="عرض التفاصيل"
                onClick={() => setViewModal(row.original)}
                className="text-primary hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Eye strokeWidth={1.3} size={20} />
              </button>
              <button
                title="تعديل"
                onClick={() => openEditDialog(row.original)}
                className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
              >
                <Pencil strokeWidth={1.3} size={20} />
              </button>
              <button
                title="حذف"
                onClick={() => setDeleteModal(row.original)}
                className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                <Trash2 strokeWidth={1.3} size={20} />
              </button>
            </div>
          );
        },
      },
    ];
  }, [formatAmount]);

  if (isFetching) {
    return (
      <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
        جاري تحميل الحملات...
        <Spinner />
      </div>
    );
  }

  if (error) return <Error onRetry={() => dispatch(getCampaigns())} />;

  return (
    <>
      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">تفاصيل الحملة</h2>
              <button
                onClick={() => setViewModal(null)}
                className="cursor-pointer p-1 hover:bg-zinc-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span className="font-medium text-zinc-500">رقم الحملة: </span>
                <span>#{viewModal.id}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">العنوان: </span>
                <span>{viewModal.title}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">الوصف: </span>
                <p className="mt-1 p-3 bg-zinc-50 rounded-md">
                  {viewModal.description}
                </p>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  المبلغ المستهدف:{" "}
                </span>
                <span>{formatAmount(String(viewModal.target_amount))}</span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  المبلغ المجموع:{" "}
                </span>
                <span className="text-green-600">
                  {formatAmount(viewModal.collected_amount)}
                </span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  تاريخ البداية:{" "}
                </span>
                <span>
                  {new Date(viewModal.start_date).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  تاريخ النهاية:{" "}
                </span>
                <span>
                  {new Date(viewModal.end_date).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">
                  تاريخ الإنشاء:{" "}
                </span>
                <span>
                  {new Date(viewModal.created_at).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div>
                <span className="font-medium text-zinc-500">الحالة: </span>
                <span
                  className={
                    viewModal.status === "active"
                      ? "text-blue-600 font-medium"
                      : "text-zinc-600 font-medium"
                  }
                >
                  {viewModal.status === "active" ? "نشطة" : "منتهية"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <Trash2 className="text-red-600" size={22} />
              </div>
              <h2 className="text-lg font-semibold">حذف الحملة</h2>
            </div>

            <p className="text-zinc-600 text-sm">
              هل أنت متأكد من حذف الحملة: <strong>{deleteModal.title}</strong>؟
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

      {/* Add Campaign Dialog */}
      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) resetAddForm();
        }}
      >
        <DialogContent className="p-0 bg-[#EFF4FF]">
          <DialogHeader className="mt-10 px-6 text-start!">
            <DialogTitle dir="rtl">إضافة حملة جديدة</DialogTitle>
            <DialogDescription dir="rtl">
              يرجى تعبئة النموذج أدناه لإضافة حملة جديدة.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 px-6">
            <div className="p-2 rounded-full bg-primary/10">
              <Megaphone className="text-primary" size={22} />
            </div>
            <p>معلومات الحملة</p>
          </div>

          <form
            className="bg-white p-6 flex flex-col gap-4 rounded-b-md"
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">عنوان الحملة</label>
              <input
                type="text"
                value={formValues.title}
                onChange={(e) =>
                  setFormValues({ ...formValues, title: e.target.value })
                }
                placeholder="أدخل عنوان الحملة"
                className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">الوصف</label>
              <textarea
                rows={3}
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
                placeholder="أدخل وصف الحملة"
                className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">المبلغ المستهدف</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  disabled={isUnlimited}
                  value={isUnlimited ? 0 : Number(formValues.target_amount) || 0}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      target_amount: Number(e.target.value),
                    })
                  }
                  placeholder="أدخل المبلغ المستهدف"
                  className="flex-1 px-4 py-3 bg-transparent text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                />
                <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isUnlimited}
                    onChange={(e) => setIsUnlimited(e.target.checked)}
                    className="w-4 h-4"
                  />
                  غير محدود
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">تاريخ البداية</label>
                <input
                  type="date"
                  value={
                    formValues.start_date instanceof Date
                      ? formValues.start_date.toISOString().split("T")[0]
                      : formValues.start_date
                  }
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      start_date: new Date(e.target.value),
                    })
                  }
                  className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">تاريخ النهاية</label>
                <input
                  type="date"
                  value={
                    formValues.end_date instanceof Date
                      ? formValues.end_date.toISOString().split("T")[0]
                      : formValues.end_date
                  }
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      end_date: new Date(e.target.value),
                    })
                  }
                  className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center flex-wrap gap-2">
              {isCreating ? (
                <Spinner />
              ) : (
                <Button
                  className="disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  type="submit"
                >
                  إضافة الحملة
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="p-0 bg-[#EFF4FF]">
          <DialogHeader className="mt-10 px-6 text-start!">
            <DialogTitle dir="rtl">تعديل الحملة</DialogTitle>
            <DialogDescription dir="rtl">
              قم بتعديل معلومات الحملة.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 px-6">
            <div className="p-2 rounded-full bg-amber-100">
              <Pencil className="text-amber-600" size={22} />
            </div>
            <p>تعديل الحملة</p>
          </div>

          <form
            className="bg-white p-6 flex flex-col gap-4 rounded-b-md"
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">عنوان الحملة</label>
              <input
                type="text"
                value={editFormValues.title || ""}
                onChange={(e) =>
                  setEditFormValues({
                    ...editFormValues,
                    title: e.target.value,
                  })
                }
                placeholder="أدخل عنوان الحملة"
                className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">الوصف</label>
              <textarea
                rows={3}
                value={editFormValues.description || ""}
                onChange={(e) =>
                  setEditFormValues({
                    ...editFormValues,
                    description: e.target.value,
                  })
                }
                placeholder="أدخل وصف الحملة"
                className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">المبلغ المستهدف</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  disabled={isUnlimited}
                  value={isUnlimited ? "" : editFormValues.target_amount || ""}
                  onChange={(e) =>
                    setEditFormValues({
                      ...editFormValues,
                      target_amount: Number(e.target.value),
                    })
                  }
                  placeholder="أدخل المبلغ المستهدف"
                  className="flex-1 px-4 py-3 bg-transparent text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                />
                <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isUnlimited}
                    onChange={(e) => setIsUnlimited(e.target.checked)}
                    className="w-4 h-4"
                  />
                  غير محدود
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">تاريخ البداية</label>
                <input
                  type="date"
                  value={
                    editFormValues.start_date instanceof Date
                      ? editFormValues.start_date.toISOString().split("T")[0]
                      : editFormValues.start_date || ""
                  }
                  onChange={(e) =>
                    setEditFormValues({
                      ...editFormValues,
                      start_date: new Date(e.target.value),
                    })
                  }
                  className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">تاريخ النهاية</label>
                <input
                  type="date"
                  value={
                    editFormValues.end_date instanceof Date
                      ? editFormValues.end_date.toISOString().split("T")[0]
                      : editFormValues.end_date || ""
                  }
                  onChange={(e) =>
                    setEditFormValues({
                      ...editFormValues,
                      end_date: new Date(e.target.value),
                    })
                  }
                  className="px-4 py-3 bg-transparent w-full text-sm rounded-md border border-gray-300 outline-offset-4 outline-gray-300"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center flex-wrap gap-2">
              {isUpdating ? (
                <Spinner />
              ) : (
                <Button
                  className="disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  type="submit"
                >
                  حفظ التعديلات
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <section className="flex flex-col gap-4 p-3 border border-zinc-400 bg-white rounded-md">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2 flex-1">
            <Search size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-0 w-full"
              placeholder="بحث عن رقم الحملة، العنوان أو الوصف..."
            />
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            إضافة حملة
          </Button>
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

export default DashboardCampaignsTable;
