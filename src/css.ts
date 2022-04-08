import { css } from 'styled-components';

export const closeButton = css`
    width: 35px;
    font-size: 30px;
    cursor: pointer;
    background-color: #820000;
    box-shadow: rgba(130, 0, 0, 0.4) 0px 4px;
    text-align: center;
    border-radius: 5px;
    padding-bottom: 3px;
    user-select: none;
    transition: 0.1s linear;

    &:hover {
        margin-top: 2px;
        margin-bottom: -2px;
        box-shadow: rgba(130, 0, 0, 0.4) 0px 2px;
    }
`;