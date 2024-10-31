import { Icon } from "@iconify/react/dist/iconify.js";

const IconText = ({iconName, displayText, active}) => {
    return (
        <div className="flex items-center justify-start cursor-pointer">
            <div className="px-5 p-2">
                <Icon icon={iconName} color={active ? "white" : "gray"} fontSize={25}/>
            </div>
            <div className={`${ active ? "text-white" : "text-gray-400"} text-sm font-semibold hover:text-white`}>{displayText}</div>
        </div>
    );
}

export default IconText;
