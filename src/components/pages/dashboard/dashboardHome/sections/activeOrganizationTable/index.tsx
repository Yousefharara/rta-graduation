import type { ILocalOrg } from "@/@types/localOrg";
import Error from "@/components/feedback/Error";
import Spinner from "@/components/feedback/Spinner";
import ReactTable from "@/components/organisms/reactTable";
import { getLocalOrgs } from "@/redux/slices/localOrgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

// interface IDataTable {
//   nameOfOrganization: string;
//   origin: string;
//   areaOfFocus: string;
//   staff: number;
// }


// const orgs: IDataTable[] = [
//     {
//         nameOfOrganization: "مبادرة أفق الصحة",
//         origin: 'النصيرات',
//         areaOfFocus: "الصحة",
//         staff: 124
//     },
//     {
//         nameOfOrganization: "إغاثة واحة المياه",
//         origin: 'خانيونس',
//         areaOfFocus: "المياه والصرف",
//         staff: 89
//     },
//     {
//         nameOfOrganization: "شبكة التغذية أولاً",
//         origin: 'غزه - السرايا',
//         areaOfFocus: "الغذاء",
//         staff: 215
//     },
//     {
//         nameOfOrganization: "وحدة الاستجابة العالمية",
//         origin: 'شمال غزه',
//         areaOfFocus: "عاجل",
//         staff: 450
//     },
// ]

const PAGE_SIZE = 5;


const ActiveOrganization = () => {

  const [filteredName] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const {localOrgs, isFetching, error} = useAppSelector(state => state.localOrg)
  const {accessToken} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch();
  // const [dataTable, setDataTable] = useState<IDataTable[]>([]);

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setDataTable(orgs)
  // }, [])

  useEffect(() => {
    dispatch(getLocalOrgs(accessToken || ""))
  }, [dispatch, accessToken])

  const filteredData = useMemo(() => {
    console.log("filterd name ", filteredName);
    return localOrgs.filter((data) =>
      data.org_name
        .toLowerCase()
        .includes(filteredName.toLowerCase()),
    );
  }, [filteredName, localOrgs]);

  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginationData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [pagination, filteredData]);

  const columns = useMemo<ColumnDef<ILocalOrg>[]>(() => {
    return [
      {
        header: "اسم المنظمة",
        accessorFn: (row) => `${row.org_name}`,
      },
      {
        header: "المنطقة",
        accessorFn: () => `${'غزه'}`,
        // accessorFn: (row) => `${getAreaById(row.area_id)?.name}`,
      },
      {
        header: "مجال التركيز",
        accessorKey: "AreaOfFocus",
        cell: ({ row }) => {
          const { org_name } = row.original;
          return (
            <p
              // className={`px-4 text-sm font-semibold border py-2 w-fit rounded-md ${
              //   areaOfFocus === "الصحة"
              //     ? "bg-[#BBF7D0] border-[#15803D] text-[#15803D]"
              //     : areaOfFocus === "المياه والصرف"
              //       ? "bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]"
              //       : areaOfFocus === "الغذاء"
              //         ? "bg-[#FFF7ED]] border-[#C2410C] text-[#C2410C]"
              //         : areaOfFocus === "عاجل"
              //           ? "bg-red-500 text-wh ite"
              //           : "bg-zinc-300 border-zinc-500"
              // }`}
            >
              {org_name}
            </p>
          );
        },
      },
      {
        header: "طاقم العمل",
        accessorFn: (row) => row.org_name,
      },
    ];
  }, []);

  
  if (isFetching) {
    return (
      <div className="flex justify-center gap-4 items-center h-40 text-zinc-500">
        جاري تحميل المنظمات...
        <Spinner />
      </div>
    );
  }

  if(error) return <Error onRetry={() => dispatch(getLocalOrgs(accessToken || ""))}/>

  return (
    <section className="flex flex-col rounded-lg border border-zinc-300">
      <article className="px-6 py-4 flex justify-between items-center gap-4 flex-wrap bg-primary/10">
        <p className="text-primary-foreground text-lg font-semibold">
          المنظمات المصغرة النشطة
        </p>
        <small className="text-primary">عرض جميع السجلات</small>
      </article>
      <article>
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

export default ActiveOrganization;
