import { ReactNode } from 'react';
import { ModalContainer } from './styled';

type PropsT = {
    children: ReactNode;
    title?: string;
    onClose?: () => void;
};

export const Modal = (props: PropsT) => {
    return (
        <ModalContainer>
            <div className="modal">
                <div className="modal-header">
                    <span>{props.title}</span>
                    {!!props.onClose ? (
                        <span className="close-btn" onClick={props.onClose}>
                            &times;
                        </span>
                    ) : undefined}
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
            </div>
        </ModalContainer>
    );
};
