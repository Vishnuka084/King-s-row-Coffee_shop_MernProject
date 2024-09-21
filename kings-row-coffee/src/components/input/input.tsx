
interface Props {
    id:number;
    type: string;
    name: string;
    placeholder?: string;
    callBack: Function;
    value:string | number;
}

const Input = (props: Props): JSX.Element => {

    return (

        <div className={'relative w-full'}>
            <div className={'row py-2'}>
                <label className={'font-round text-[12px] text-gray-500 py-0.5 px-0.5'}>
                    {props.name}
                </label>
                <input value={props.value}
                       placeholder={props.placeholder}
                       type={props.type}
                       id={props.name}
                       onChange={event => props.callBack(event, props.name)}
                       className={'w-full py-2 placeholder:transition-all placeholder:duration-200 transition-all duration-200 rounded-[5px] border-[1px] border-gray-300 outline-none focus:border-[#ffa16c] focus:placeholder:pl-1 focus:shadow-[rgba(17,_17,_10,_0.1)_0px_0px_16px] font-round text-sm'}/>
            </div>

        </div>
    );
}

export default Input;
