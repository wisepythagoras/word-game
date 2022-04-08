import styled from 'styled-components';
import { closeButton } from '../css';

export const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fafafa;

    & > .modal {
        background-color: #222;
        margin: auto;
        padding: 25px;
        border: 5px;
        width: 70vw;
        max-width: 350px;
        border-radius: 5px;

        & > .modal-header {
            font-size: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            font-weight: bold;

            & > span:first-child {
                text-shadow: 4px 3px 0 #222, 6px 5px 0 #024166;
            }

            & > span:nth-child(2) {
                ${closeButton}
            }
        }

        & > .modal-body {
            font-size: 20px;
        }
    }
`;
