import ItemCard from "../components/card/itemCard.tsx";
import React, {createRef, useEffect, useState} from "react";
import AddCoffee from "../components/layout/add/add.coffee.tsx";
import AddDessert from "../components/layout/add/add.dessert.tsx";
import axios from "axios";
import EmptyItem from "../components/component/empty/empty.item.tsx";
import {toast, ToastContainer} from "react-toastify";
import * as ToastUtil from "../util/toastUtil.tsx";

interface CoffeeData {
    _id: string;
    name: string;
    desc: string;
    largeSize: number;
    smallSize: number;
    qty: number;
    image: string;
}

interface DessertData {
    _id: string;
    name: string;
    desc: string;
    size: number;
    price: number;
    qty: number;
    image: string;
}

const Item = (): JSX.Element => {

    const [coffeeState, setCoffeeState] = useState(true);
    const [dessertState, setDessertState] = useState(false);

    const [coffeeData, setCoffeeData] = useState<CoffeeData[]>([]);
    const [dessertData, setDessertData] = useState<DessertData[]>([]);
    const coffeeRef = createRef();
    const dessertRef = createRef();
    const toastId = React.useRef<any>(null);

    const setCardDataToRef = (data: CoffeeData | DessertData, cardType: string) => {

        if (cardType === "coffee") {
            // @ts-ignore
            coffeeRef?.current?.setCoffee(data);
            return;
        }
        // @ts-ignore
        dessertRef?.current?.setDessert(data);
    }

    const setCoffee = (coffee: CoffeeData) => {
        // @ts-ignore
        coffeeRef?.current?.setCoffee(coffee);
    }

    const setDessert = (dessert: DessertData) => {
        // @ts-ignore
        dessertRef?.current?.setDessert(dessert);
    }

    const fetchData = (): void => {

        console.log(coffeeState)
        if (coffeeState) {
            // 'http://localhost:8080/emplaoyee?size=100&page=1'
            axios.get('http://localhost:8080/coffee/getAll')
                .then(response => {
                    setCoffeeData(response.data.data);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            // 'http://localhost:8080/emplaoyee?size=100&page=1'
            axios.get('http://localhost:8080/dessert/getAll')
                .then(response => {
                    setDessertData(response.data.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    useEffect(() => {
        fetchData();
    }, [dessertState, coffeeState]);


    const changeButton = (event: any): void => {
        switch (event.target.innerText) {
            case 'Coffee':
                setCoffeeState(true);
                setDessertState(false);
                break;
            case 'Dessert':
                setCoffeeState(false);
                setDessertState(true);
                break;
        }
    }

    const showNotify = (title: string, message: string) => {
        toast.dismiss(toastId.current);
        toastId.current = ToastUtil.error(title, message);
    }

    return (
        <section className={'w-full h-full bg-white flex'}>
            <ToastContainer toastClassName={"toast-class"} bodyClassName={"toast-body"}/>
            <div className={'w-[78%] h-full'}>
                <div className={'pl-10 py-4 font-Index tracking-wider'}>
                    <h1 className={'text-2xl font-bold text-[#3c3c3c]'}>Items</h1>
                    <h4 className={'text-[12px] text-gray-400'}>Good morning kasun. You have added new 4 items .</h4>
                </div>
                <div
                    className={'mx-10 border-[1px] w-fit border-gray-300 bg-gray-100 rounded-lg text-gray-500 text-[13px] font-cde'}>
                    <button onClick={changeButton}
                            type={'button'} className={`py-2 w-[70px] border-r-[1px] border-gray-300 transition-all ease-linear duration-200 delay-100
                            ${coffeeState && 'w-[85px] text-white bg-[#2c2c2c] rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'}`}>Coffee
                    </button>
                    <button onClick={changeButton}
                            type={'button'} className={`py-2 w-[70px] transition-all ease-linear duration-200 delay-100
                            ${dessertState && 'w-[85px] text-white bg-[#2c2c2c] rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'}`}>Dessert
                    </button>
                </div>
                <div
                    className={'w-full h-[80vh] flex flex-wrap mt-4 overflow-y-scroll px-10 pt-3 pb-12 bg-[#f6f6f6] border-t-[1px] border-gray-200'}>
                    {
                        coffeeState ?
                            coffeeData.length > 0 ? coffeeData.map(value => {
                                    return <ItemCard
                                        showTosty={showNotify}
                                        cardType={"coffee"}
                                        onLoadAction={fetchData}
                                        setCardData={setCardDataToRef}
                                        qty={value.qty}
                                        key={value._id}
                                        smallSize={value.smallSize}
                                        largeSize={value.largeSize}
                                        name={value.name}
                                        _id={value._id}
                                        desc={value.desc}
                                        image={`http://localhost:8080/images/${value.image}`}/>
                                })
                                :
                                <EmptyItem/>
                            :

                            dessertData.length > 0 ? dessertData.map(value => {
                                    return <ItemCard
                                        cardType={"dessert"}
                                        onLoadAction={fetchData}
                                        setCardData={setCardDataToRef}
                                        qty={value.qty}
                                        key={value._id}
                                        size={value.size}
                                        price={value.price}
                                        name={value.name}
                                        _id={value._id}
                                        desc={value.desc}
                                        showTosty={showNotify}
                                        image={`http://localhost:8080/images/${value.image}`}/>
                                })
                                :
                                <EmptyItem/>
                    }
                </div>
            </div>

            <div className={'w-[22%] h-full border-l-2 border-gray-200 bg-white px-4 py-12'}>
                {
                    coffeeState ? <AddCoffee ref={coffeeRef}
                                             onLoadAction={fetchData}
                                             onSetCoffee={setCoffee}
                                             showTosty={showNotify}/> :
                        <AddDessert ref={dessertRef}
                                    onLoadAction={fetchData}
                                    onSetDessert={setDessert}
                                    showTosty={showNotify}/>
                }
            </div>

        </section>
    );
}

export default Item;
