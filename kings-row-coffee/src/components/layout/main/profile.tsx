import {useEffect, useRef, useState} from "react";
import axios from "axios";


const Profile = (): JSX.Element => {

    const [sales, setSales] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const hasFetchedData = useRef(false);

    const fetchData = () => {
        axios.get('http://localhost:8080/dashboard/get-today/Static')
            .then(response => {
                setSales(response.data.data[0]);
                setRevenue(response.data.data[1]);

            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (hasFetchedData.current) return;
        hasFetchedData.current = true;
        fetchData();
    }, []);

    return (
        <section className={'w-full h-[52.5vh]'}>
            <div className={'row m-0 font-cde'}>
                <div className={'col-md-6 '}>
                    <div className={'min-h-[180px] w-full bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg px-3 pt-3'}>
                        <h1 className={'text-[13px] text-gray-400 py-1 font-[400]'}>Today Sales</h1>
                        <h2 className={'text-[20px] text-gray-500 py-1 font-[600]'}>{sales} k</h2>
                        <img src="src/assets/today-orders.png" alt=""/>
                    </div>
                </div>
                <div className={'col-md-6'}>
                    <div className={'min-h-[180px] w-full bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg px-3 pt-3 font-Robot'}>
                        <h1 className={'text-[13px] text-gray-400 py-1 font-[400]'}>Today Revenue</h1>
                        <h2 className={'text-[20px] text-gray-500 py-1 font-[600]'}>$ {revenue}</h2>
                        <img src="src/assets/today-revenue.png" alt=""/>
                    </div>
                </div>
            </div>
            <div className={'row m-0'}>
                <div className={'col-md-12 pt-3'}>
                    <div className={'w-full min-h-44 px-3 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg flex justify-center'}>
daw
                    </div>
                </div>
            </div>
            {/*<div className={'w-36 aspect-square absolute bg-[#FFA16C] top-[-20px] rounded-full left-[-30px] bg-opacity-30'}></div>
            <div className={'w-28 aspect-square absolute bg-[#FFA16C] top-[-20px] rounded-full left-[-30px] bg-opacity-30'}></div>
            <div className={'w-36 aspect-square z-[2] absolute bg-[#FFA16C] bottom-[-20px] rounded-full right-[-50px] bg-opacity-30'}></div>
            <div className={'w-28 aspect-square absolute bg-[#FFA16C] bottom-[-20px] rounded-full right-[-50px] bg-opacity-30'}></div>
            <div className={'w-24 aspect-square absolute bg-[#FFA16C] bottom-[100px] rounded-full right-[-40px] bg-opacity-30'}></div>
            <div className={'w-24 aspect-square absolute bg-[#2c2c2c] bottom-[1px] rounded-full left-[-40px] bg-opacity-10'}></div>
            <div className={'w-10 aspect-square absolute bg-[#2c2c2c] bottom-[1px] rounded-full left-[-15px] bg-opacity-60'}></div>
            <div className={'w-10 aspect-square absolute bg-[#FFA16C] bottom-[-20px] rounded-full left-[10px] bg-opacity-60'}></div>*/}
            {/*<div className={'row m-0 font-cde'}>
                <div className={'col-md-12 flex justify-center py-4 font-[500] text-[13px] tracking-wide text-gray-500'}>Profile
                </div>
                <div className={'col-md-12 flex justify-center py-1'}>
                    <img src="src/assets/NicePng_cammy-png_1829287.png" alt="prfile" title={'profile'}
                         className={'w-[100px] border-[1px] border-gray-300 rounded-full object-cover mr-4 ml-2 cursor-pointer'}/>
                </div>
                <div className={'col-md-12 font-Robot text-center pt-2 font-[400] text-[16px] tracking-wide text-gray-600'}>Mrs Kasun Perera</div>
                <div className={'col-md-12 font-Robot text-center pb-4 font-[400] text-[13px] tracking-wide text-gray-400'}>kasunperera@info.com.dev</div>
                <div className={'col-md-12 px-16'}>
                    <div className={'bg-[#6AB29B] relative z-[10] w-full rounded-3xl py-10 bg-opacity-80'}></div>
                </div>
            </div>*/}
        </section>
    );
}

export default Profile;
