import {useEffect, useState} from "react";
import axios from "axios";
import HistoryTable from "../components/tables/history.table.tsx";
import TableColum from "../components/tables/colum/table.colum.tsx";
import PaginationCard from "../components/component/pagination/paginationCard.tsx";
import EmptyItem from "../components/component/empty/empty.item.tsx";

interface Data {
    _id: string;
    date: string;
    orderDetails: [];
}

const History = (): JSX.Element => {

    const [options, setOptions] = useState<boolean[]>([true, false, false])
    const [data, setData] = useState<Data[]>([]);
    const [pageTotal, setPageTotal] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1)

    const showMenu = (index: number) => {
        const array = [false, false, false];
        array[index] = true;
        setOptions(array);
    }

    useEffect(() => {
        getData(selectedPage);
    }, []);

    const getData = async (page: number) => {
        if (page < 1)
            return;

        await axios.get('http://localhost:8080/order/getAll?size=6&page=' + page)
            .then(response => {
                setSelectedPage(page);
                setPageTotal(response.data["totalPages"])
                setData(response.data.data);

            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <section className={'w-full h-full bg-[#f6f6f6]'}>
            <div className={'pl-10 py-4 font-Index tracking-wider bg-white'}>
                <h1 className={'text-2xl font-bold text-[#3c3c3c]'}>You Order History</h1>
                <h4 className={'text-[12px] text-gray-400'}>Good morning kasun. You have placed 4 order's for now .</h4>
            </div>

            <div className={'w-full h-14 pt-3 px-4 bg-white border-b-[1px] border-gray-200'}>
                <ul className={'w-full h-full flex pl-4 font-Index text-[13px] text-gray-400'}>
                    <li onClick={() => showMenu(0)}
                        className={`w-6 h-full flex items-center cursor-pointer justify-center mr-6 border-b-[3px] ${options[0] ? 'text-[#3c3c3c] border-[#3c3c3c]' : 'border-white '}`}>All
                    </li>
                    <li onClick={() => showMenu(1)}
                        className={`h-full flex items-center cursor-pointer justify-center mr-6 border-b-[3px] ${options[1] ? 'text-[#3c3c3c] border-[#3c3c3c]' : 'border-white '}`}>Coffee
                    </li>
                    <li onClick={() => showMenu(2)}
                        className={`h-full flex items-center cursor-pointer justify-center border-b-[3px] ${options[2] ? 'text-[#3c3c3c] border-[#3c3c3c]' : 'border-white '}`}>Dessert
                    </li>
                </ul>
            </div>
            <section className={'px-4 py-3'}>
                <div
                    className={'w-[70%] rounded-bl-xl rounded-br-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]'}>
                    {
                        data.length > 0 && <HistoryTable/>
                    }

                    <div className={'h-[50vh] bg-white'}>
                        {
                            data.length > 0 ? data.map((value: Data, index: number) => {
                                    return <TableColum key={index} _id={value._id} date={value.date}
                                                       orderDetails={value.orderDetails}>
                                    </TableColum>
                                })
                                :
                                <EmptyItem/>
                        }
                    </div>
                    <div className={'w-full  flex bg-white justify-content-end py-2.5 px-3'}>
                        {
                            data.length > 0 && <PaginationCard setPage={setPageTotal}
                                                               pageTotal={pageTotal}
                                                               selectOption={getData}
                            />
                        }

                    </div>
                </div>
            </section>
        </section>
    );
}

export default History;
