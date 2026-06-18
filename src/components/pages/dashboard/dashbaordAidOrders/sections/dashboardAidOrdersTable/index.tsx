import { Search } from 'lucide-react';
import './style.css'
import ReactTable from '@/components/organisms/reactTable';
import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

type orderAidStatus = "agreement" | "rejected";

interface IDataTable {
    numOfOrder: string;
    beneficiaryName: string;
    typeOfAid: string;
    algorithm: number;
    status: orderAidStatus;
    
}

const PAGE_SIZE = 5;

const orgs: IDataTable[] = [
    {
        numOfOrder: "مبادرة أفق الصحة",
        beneficiaryName: 'النصيرات',
        typeOfAid: "الصحة",
        algorithm: 124

    },
    {
        numOfOrder: "إغاثة واحة المياه",
        beneficiaryName: 'خانيونس',
        typeOfAid: "المياه والصرف",
        algorithm: 89

    },
    {
        numOfOrder: "شبكة التغذية أولاً",
        beneficiaryName: 'غزه - السرايا',
        typeOfAid: "الغذاء",
        algorithm: 215

    },
    {
        numOfOrder: "وحدة الاستجابة العالمية",
        beneficiaryName: 'شمال غزه',
        typeOfAid: "عاجل",
        algorithm: 450

    },
]



const DashboardAidOrdersTable = () => {



    const [filteredName] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });
    const [dataTable, setDataTable] = useState<IDataTable[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDataTable(orgs);
    }, []);


    const filteredData = useMemo(() => {
        console.log("filterd name ", filteredName);
        return dataTable.filter((data) =>
            data.nameOfOrganization
                .toLowerCase()
                .includes(filteredName.toLowerCase()),
        );
    }, [filteredName, dataTable]);

    const pageCount = Math.ceil(filteredData.length / PAGE_SIZE);

    const paginationData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredData.slice(start, end);
    }, [pagination, filteredData]);

    const columns = useMemo<ColumnDef<IDataTable>[]>(() => {
        return [
            {
                header: "اسم المنظمة",
                accessorFn: (row) => `${row.nameOfOrganization}`,
            },
            {
                header: "المنطقة",
                accessorFn: (row) => `${row.origin}`,
            },
            {
                header: "مجال التركيز",
                accessorKey: "AreaOfFocus",
                cell: ({ row }) => {
                    const { areaOfFocus } = row.original;
                    return (
                        <p
                            className={`px-4 text-sm font-semibold border py-2 w-fit rounded-md ${areaOfFocus === "الصحة"
                                    ? "bg-[#BBF7D0] border-[#15803D] text-[#15803D]"
                                    : areaOfFocus === "المياه والصرف"
                                        ? "bg-[#EFF6FF] border-[#1D4ED8] text-[#1D4ED8]"
                                        : areaOfFocus === "الغذاء"
                                            ? "bg-[#FFF7ED]] border-[#C2410C] text-[#C2410C]"
                                            : areaOfFocus === "عاجل"
                                                ? "bg-red-500 text-white"
                                                : "bg-zinc-300 border-zinc-500"
                                // areaOfFocus === "medical"
                                //   ? "bg-[#BBF7D0]"
                                //   : areaOfFocus === "water"
                                //     ? "bg-[#EFF6FF]"
                                //     : areaOfFocus === "food"
                                //       ? "bg-[#FFF7ED]"
                                //       : areaOfFocus === "urgent"
                                //         ? "bg-red-500"
                                //         : "bg-zinc-300"
                                }`}
                        >
                            {areaOfFocus}
                        </p>
                    );
                },
            },
            {
                header: "طاقم العمل",
                accessorFn: (row) => row.staff,
            },
        ];
    }, []);



    return (
        <section className='flex flex-col gap-4 p-3 border border-zinc-400 bg-white rounded-md'>


            <article className='flex items-center gap-4'>

                <div className="search-filter bg-[#EFF4FF] rounded-md px-4 py-2 flex items-center gap-2">
                    <p className="active px-3 py-2 bg-white rounded-md cursor-pointer">الكل</p>
                    <p className="px-3 py-2 bg-white rounded-md cursor-pointer">قيد الانتظار</p>
                    <p className="px-3 py-2 bg-white rounded-md cursor-pointer">تمت الموافقة</p>
                    <p className="px-3 py-2 bg-white rounded-md cursor-pointer">قيد التنفيذ</p>
                    <p className="px-3 py-2 bg-white rounded-md cursor-pointer">مرفوض</p>
                </div>


                <div className='flex gap-2 items-center border border-zinc-400 rounded-md px-3 py-2'>
                    <Search size={18} />
                    <input type="text" className='min-w-64 outline-0 ' placeholder='بحث عن اسم أو رقم الطلب...' />
                </div>

            </article>




            <article className='w-full'>
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
}

export default DashboardAidOrdersTable;
