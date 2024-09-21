import EmployeeCard from "../components/card/employeeCard.tsx";
import React, {createRef, useEffect, useRef, useState} from "react";
import axios from "axios";
import Search from "../components/search/search.tsx";
import AddEmployee from "../components/layout/add/add.employee.tsx";
import PaginationCard from "../components/component/pagination/paginationCard.tsx";
import {toast, ToastContainer} from "react-toastify";
import * as ToastUtil from "../util/toastUtil.tsx";
import EmptyItem from "../components/component/empty/empty.item.tsx";

interface Data {
    _id: string;
    name: string;
    email: string;
    address: string;
    age: number;
    contact: string;
    image: string;
}

const Employee = (): JSX.Element => {

    const [data, setData] = useState<Data[]>([]);
    const addEmployeeRef = createRef();
    const toastId = React.useRef<any>(null);
    const [pageTotal, setPageTotal] = useState(0);
    const hasFetchedData = useRef(false);
    const [selectedPage, setSelectedPage] = useState(1);

    const handleSetEmployee = (employee: Data) => {
        // @ts-ignore
        addEmployeeRef?.current?.setEmployee(employee);
    }

    const fetchData = () => {
        getData(selectedPage);
    }
    useEffect(() => {
        if (hasFetchedData.current) return;
        hasFetchedData.current = true;
        fetchData();
    }, []);

    const showNotify = (title: string, message: string) => {
        toast.dismiss(toastId.current);
        toastId.current = ToastUtil.error(title, message);
    }

    const getData = async (page:number) => {

        if (page < 1)
            return;

        await axios.get('http://localhost:8080/employee/getAll?size=7&page='+page)
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
        <section className={'w-full h-full bg-[#f6f6f6] flex'}>
            <ToastContainer toastClassName={"toast-class"} bodyClassName={"toast-body"}/>
            {/*bg-[#fff4ed]*/}
            <div className={'w-[78%] h-full overflow-y-scroll'}>
                <div className={'py-4 px-10  font-Index tracking-wider bg-white border-b-[1px] border-gray-200'}>
                    <h1 className={'text-2xl font-bold text-[#3c3c3c]'}>Employee's</h1>
                    <h4 className={'text-[12px] text-gray-400'}>Good morning kasun. You have update 4 employee details .</h4>
                    <div className={'flex pt-4'}>
                        <Search/>
                    </div>
                </div>
                <div className={'pt-3 px-4'}>
                    <div className={'bg-white pt-10 pb-2 mb-2 py-2 w-full rounded-xl border-[1px] border-gray-200'}>
                        <div className={'w-full overflow-hidden overflow-y-scroll h-[62vh] px-4 flex flex-col'}>
                            {
                                data.length > 0 ?
                                data.map((value) => {
                                    return <EmployeeCard
                                        key={value._id}
                                        _id={value._id}
                                        name={value.name}
                                        email={value.email}
                                        address={value.address}
                                        age={value.age}
                                        contact={value.contact}
                                        setEmployee={handleSetEmployee}
                                        handleOnLoad={fetchData}
                                        showTosty={showNotify}
                                        image={`http://localhost:8080/images/${value.image}`}/>
                                })
                                    :
                                    <EmptyItem/>
                            }
                        </div>
                        <div className={'w-full flex  justify-content-end pt-2.5 px-3'}>
                            {
                                data.length > 0 && <PaginationCard setPage={setPageTotal}
                                                                   pageTotal={pageTotal}
                                                                   selectOption={getData}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={'w-[22%] h-full border-l-2 pt-16 bg-white border-gray-200 '}>
                <AddEmployee showTosty={showNotify}
                             ref={addEmployeeRef} onLoadAction={fetchData} onSetEmployee={handleSetEmployee}/>
            </div>
        </section>
    );
}

export default Employee;
