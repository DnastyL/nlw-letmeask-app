import {ButtonHTMLAttributes} from 'react';
import './button.scss'
import cx from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
  isModalButton?: boolean
};
    

export const Button = ({isOutlined = false, isModalButton = false, ...props}: ButtonProps) => {
  return(
       <button className={cx("button", {outlined: isOutlined, modalButton: isModalButton})} {...props}/>
    );
    
};
