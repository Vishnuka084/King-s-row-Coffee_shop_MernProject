
interface Props{
    value:number;
    isSelect:boolean;
    selectFun: (index:number) => void;
    onClicked: (index:number) => void;
}

const PaginationItem = (props:Props):JSX.Element => {
    return(
        <div onClick={() => {
            props.selectFun(props.value -1);
            props.onClicked(props.value);
        }}
            className={`h-7 aspect-square flex items-center justify-content-center rounded-full ${props.isSelect && 'bg-[#2c2c2c] text-white'} text-gray-400`}>
            <span>{props.value}</span>
        </div>
    );
}

export default PaginationItem;
