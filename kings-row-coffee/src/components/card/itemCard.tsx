import {FiMoreVertical} from "react-icons/fi";
import {useEffect, useRef, useState} from "react";
import {Edit, Trash} from "react-feather";
import Swal from "sweetalert2";
import axios from "axios";
import {useSpring, animated} from "@react-spring/web";
// @ts-ignore
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

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

interface Props {
    cardType: string;
    _id: string;
    name: string;
    desc: string;
    largeSize?: number;
    smallSize?: number;
    size?: number;
    price?: number;
    qty: number;
    image: string;
    onLoadAction: () => void;
    setCardData: (data: CoffeeData | DessertData, cardType: string) => void;
    showTosty: (title: string, message: string) => void;
}

const ItemCard = (props: Props): JSX.Element => {

    const options: string[] = ["Update", "", "Delete"];
    const [openOption, setOpenOption] = useState(false);
    const [bottom, setBottom] = useState(-120);
    const [isDelete, setIsDelete] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const iconRef = useRef<any>();
    const navigate = useNavigate();

    useEffect(() => {
        if (bottom === -120 && openOption) {
            setBottom(0)
        } else if (bottom === 0 && !openOption) {
            setBottom(-120);
        }
    }, [openOption])

    const handleWindowClick = (e: any): void => {
        if (openOption) {
            // @ts-ignore
            if (iconRef.current && !iconRef.current.contains(e.target)) {
                resetOption(false);
            }
        }
    }
    const handleUpdateDetails = (_id: string, url: string) => {

        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure do you to Edit this item!",
            showCancelButton: true,
            confirmButtonText: "Yes, edit it!",
            cancelButtonText: "No, cancel it!",
            customClass: {
                title: 'swal-title',
                popup: 'swal-popup',
                confirmButton: 'swal-update',
                cancelButton: 'swal-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                /*const config = {
                    headers: {
                        'Authorization': Cookies.get('token')
                    }
                };*/
                axios.get(url + _id)
                    .then(response => {
                        props.setCardData(response.data.data, props.cardType);
                    })
                    .catch(err => {
                        props.showTosty('Error', err.response.data.message);
                    });
            }
        });
    }

    const getToken = ():string|null => {
        const token = Cookies.get('token');
        if (!token) {
            Swal.fire({
                title: "Login expire !",
                text: "Please log in to continue!",
                showCancelButton: false,
                confirmButtonText: "OK!",
                customClass: {
                    title: 'swal-title',
                    popup: 'swal-popup',
                    confirmButton: 'swal-confirm',
                    cancelButton: 'swal-cancel'
                }
            });
            navigate('/login');
            return null;
        }else {
            return token;
        }
    }

    const handleDeleteItem = (_id: string, url: string) => {

        const token = getToken();
        if (token === null)
            return;

        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure do you to delete this item !",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, saved it!",
            customClass: {
                title: 'swal-title',
                popup: 'swal-popup',
                confirmButton: 'swal-confirm',
                cancelButton: 'swal-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                const config = {
                    headers: {
                        'Authorization': token
                    }
                };
                axios.delete(url + _id, config)
                    .then(res => {
                        props.showTosty('Success', res.data.message);
                        setIsDelete(true);
                        props.onLoadAction();
                    })
                    .catch(err => {
                        props.showTosty('Error', err.response.data.message);
                    });
            }
        });
    }

    const handleOptions = (option: string, _id: string) => {

        if (props.cardType === "coffee") {
            if (option === "Update") {
                handleUpdateDetails(_id, "http://localhost:8080/coffee/getById/");
            }
            if (option === "Delete") {
                handleDeleteItem(_id, "http://localhost:8080/coffee/");
            }
        } else {
            if (option === "Update") {
                handleUpdateDetails(_id, "http://localhost:8080/dessert/getById/");
            }
            if (option === "Delete") {
                handleDeleteItem(_id, "http://localhost:8080/dessert/");
            }
        }
        resetOption(!openOption);
    }
    window.addEventListener('click', handleWindowClick);

    const resetOption = (opt: boolean) => {
        setBottom(-120);
        setTimeout(() => {
            setOpenOption(opt);
        }, 500)

    }

    const styles = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        }
    })

    const leavingAnimation = useSpring({
        opacity: isDelete ?  0 : 1,
        transform: isDelete ? 'translateY(-100px)' : 'translateY(0)',
        onRest:() => {
            setTimeout( () => setIsVisible(true), 100)

        }
    });

    return  (

        <animated.div style={isDelete ? leavingAnimation : styles}
                      className={`${isVisible ? 'transition-all ease-in-out w-0 m-0 h-0' : 'm-2'} ${isDelete && 'transition-all'} w-[330px] h-[225px] bg-white rounded-[20px]  flex relative border-[1px] border-gray-200 m-2 shadow-[rgba(17,_17,_26,_0.05)_0px_0px_10px]`}>
            <div ref={iconRef}>
                <FiMoreVertical
                    onClick={() => setOpenOption(!openOption)}
                    className={`absolute right-2 top-4 text-sm text-gray-500 cursor-pointer active:bg-gray-100 rounded-full w-6 h-6 px-1`}/>
            </div>

            {
                openOption &&
                <ul
                    className={'w-full h-full z-30 absolute rounded-[20px] overflow-hidden flex justify-center'}>
                    <div
                        className={`w-44 bg-gray-50 gap-2 rounded-3xl border-[1px] border-gray-100 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] absolute ${bottom === -120 && 'bottom-[-120px]'} ${bottom === 0 && 'bottom-[10px]'} py-2 px-3 flex justify-center items-center transition-all duration-300 ease-linear`}>
                        {
                            options.map(option => {
                                return <li key={option}
                                           onClick={() => handleOptions(option, props._id)}
                                           className={`hover:text-[#FFA16C] transition-all ease-linear duration-100 cursor-pointer text-gray-500 flex justify-center items-center `}>{option === "Update" ?
                                    <Edit size={19} className={'border-r-[1px] border-gray-200'}/> : option === "" ? <hr className={'w-5 border-gray-500 rotate-90'}></hr> : <Trash size={19}/> }
                                </li>
                            })
                        }
                    </div>
                </ul>
            }
            {/*pic div*/}
            <div className={'w-[38%] h-full p-2.5'}>
                <div className={'w-full h-full bg-gray-100 rounded-xl flex justify-center items-center'}>
                    <img src={props.image} alt="coffee-image"/>
                </div>
                {/*button div*/}
            </div>
            {/*content*/}
            <div className={` w-[62%] h-full py-2 px-1 font-Robot`}>
                <div className={'w-full flex'}>
                    <h3 className={'font-round text-[18px] text-gray-700 font-bold'}>{props.name}</h3>
                </div>
                <p className={'font-cde pr-3 text-gray-400 pt-1 leading-5 text-[12px] min-h-[65px] overflow-y-scroll'}>{props.desc} </p>
                <div className={'font-Robot min-h-10 relative text-sm text-black text-[17px]'}>
                    {
                        props.largeSize ? <h1 className={'text-[#FFA16C] mb-1'}>Price</h1> :
                            <h1 className={'text-[#FFA16C] mb-1'}>Details</h1>
                    }
                    {
                        props.largeSize && <div className={'flex items-center pb-0.5'}>
                            <div
                                className={'w-14 bg-[#3c3c3c] text-white text-center rounded-xl text-[9px] tracking-wider py-[1px]'}>Large
                            </div>
                            <div className={'w-full leading-3 text-xs px-3'}>$ {props.largeSize}
                                <span className={'absolute right-[90px] pl-1 text-[11px] text-[#FFA16C]'}>USD</span>
                            </div>
                        </div>

                    }
                    {
                        props.smallSize && <div className={'flex items-center'}>
                            <div
                                className={'w-14 bg-[#3c3c3c] text-white text-center rounded-xl text-[9px] tracking-wider py-[1px]'}>Small
                            </div>
                            <div className={'w-full leading-3 text-xs px-3'}>$ {props.smallSize}
                                <span className={'absolute right-[90px] pl-1 text-[11px] text-[#FFA16C]'}>USD</span>
                            </div>
                        </div>
                    }
                    {
                        props.price && <div className={'flex items-center pb-0.5'}>
                            <div
                                className={'w-16 bg-[#3c3c3c] text-white text-center rounded-xl text-[10px] py-[1px]'}>Price
                            </div>
                            <div className={'w-full leading-3 text-xs px-3'}>$ {props.price}
                                <span className={'absolute right-[90px] pl-1 text-[11px] text-[#FFA16C]'}>USD</span>
                            </div>
                        </div>
                    }
                    {
                        props.size && <div className={'flex items-center pb-0.5'}>
                            <div
                                className={'w-16 bg-[#3c3c3c] text-white text-center rounded-xl text-[10px] py-[1px]'}>Grams
                            </div>
                            <div className={'w-full leading-3 text-xs px-3'}>{props.size}
                                <span className={'absolute right-[110px] pl-1 text-[11px] text-[#FFA16C]'}>g</span>
                            </div>
                        </div>
                    }

                </div>
                <div className={'w-full text-gray-400 text-[12px] mt-1.5'}>
                    <div className={'text-[#FFA16C]'}>Quantity</div>
                    <div className={''}>
                        <div className={'text-gray-600 text-sm font-Robot px-1'}>{props.qty}</div>
                    </div>
                </div>
            </div>
        </animated.div>
    )
}
export default ItemCard;
