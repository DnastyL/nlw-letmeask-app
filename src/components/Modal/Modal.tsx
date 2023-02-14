import "./modal.scss";
import { ReactNode } from "react";

interface modalType {
  children: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export const Modal = ({ isOpen, children, toggle }: modalType) => {
  return (
    <>
      {isOpen ? (
        <div className="modal-overlay" onClick={toggle}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>{children}</div>
        </div>
      ) : null}
    </>
  );
};
