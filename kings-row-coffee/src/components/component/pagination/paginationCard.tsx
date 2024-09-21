import {ChevronLeft, ChevronRight} from 'react-feather'
import {useEffect, useState} from "react";
import PaginationItem from "./paginationItem.tsx";

interface Props {
    setPage: (value: number) => void;
    selectOption: (page: number) => void;
    pageTotal: number;
}

const PaginationCard = (props: Props) => {

    const [page, setPage] = useState<boolean[]>([true]);

    useEffect(() => {
        setTotalPage(props.pageTotal);
    }, [props.pageTotal]);

    const setTotalPage = (value: number) => {
        const allFalseArray = new Array(value).fill(false);
        allFalseArray[0] = true;
        setPage(allFalseArray);
    }

    const select = (index: number) => {
        const allFalseArray = new Array(page.length).fill(false);
        allFalseArray[index] = true;
        setPage(allFalseArray);
    }
    return (
        <div
            className={'cursor-pointer h-9 flex flex-row w-fit items-center bg-gray-200 rounded-2xl text-sm font-round text-gray-500'}>
            <div onClick={() => {
                let num: number = page.findIndex(value => value);
                if (num > 0) {
                    select(num - 1);
                    props.selectOption(num);
                }
            }}
                 className={'flex justify-center items-center px-[9px]'}>
                <ChevronLeft size={16}/><span className={'pb-[1px]'}>Prev</span>
            </div>
            {
                page.map((value, index) => {
                    return <PaginationItem
                        key={index}
                        value={index + 1}
                        isSelect={value}
                        selectFun={select}
                        onClicked={props.selectOption}
                    />
                })
            }
            <div onClick={() => {
                let num: number = page.findIndex(value => value);
                if (num + 1 < page.length) {
                    select(num + 1);
                    props.selectOption(num + 2);
                }
            }}
                 className={'flex justify-center items-center px-[9px]'}>
                <span className={'pb-[1px]'}>Next</span><ChevronRight size={16}/>
            </div>
        </div>
    )
}
export default PaginationCard;
