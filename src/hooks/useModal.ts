import { useState } from "react";

export default function useModal(){
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        return setIsOpen(!isOpen);
    }

    return{
        isOpen,
        toggle,
    };
}