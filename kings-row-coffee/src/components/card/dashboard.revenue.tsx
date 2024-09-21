import {TrendingUp, User, Box, DollarSign} from 'react-feather'
import RevenueCard from "./revenue.card.tsx";
import axios from "axios";
import {useEffect, useRef, useState} from "react";

const DashboardRevenue = () => {

    const [array, setArray] = useState([0, 0, 0, 0])
    const hasFetchedData = useRef(false);

    const fetchData = () => {
        if (hasFetchedData.current) return;
        hasFetchedData.current = true;
        axios.get('http://localhost:8080/dashboard/getStatic')
            .then(response => {
                setArray(response.data.data);

            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const data = [
        {
            title: array[0] + ' k',
            subtitle: 'Sales',
            color: 'bg-purple-100',
            icon: <TrendingUp className={'text-purple-500'} size={24}/>
        },
        {
            title: array[1] + ' k',
            subtitle: 'Customers',
            color: 'bg-[#00cfe8] bg-opacity-10',
            icon: <User className={'text-[#00cfe8]'} size={24}/>
        },
        {
            title: array[2] ,
            subtitle: 'Products',
            color: 'bg-red-100',
            icon: <Box className={'text-red-500'} size={24}/>
        },
        {
            title: '$ ' + array[3],
            subtitle: 'Revenue',
            color: 'bg-green-100',
            icon: <DollarSign className={'text-green-500'} size={24}/>
        }
    ]

    const renderData = () => {
        return data.map((item) => {
            return (
                <RevenueCard
                    color={item.color}
                    text={item.subtitle}
                    value={item.title}
                    icon={item.icon}/>
            )
        })
    }

    return (
        <div className={'w-full min-h-48'}>
            <div className={'row'}>
                <h4 className={'col-md-6 col-xm-12 pl-10 pt-3 tracking-wide font-cd text-xl'}>Statistics</h4>
                <span className={'col-md-6 col-xs-12 text-xs text-gray-400 flex items-center justify-end pr-10'}>Updated 1 month ago</span>
            </div>
            <div className={'flex min-h-36 flex-wrap w-full items-center justify-around'}>
                {renderData()}
            </div>
        </div>
    )
}

export default DashboardRevenue;
