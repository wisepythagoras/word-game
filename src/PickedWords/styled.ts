import styled from 'styled-components';
import { closeButton } from '../css';

export const Container = styled.div`
    max-width: 340px;
    margin: auto;

    & > ol {
        color: #fafafa;

        & > li {
            margin-left: -20px;
            margin-right: 0px;

            &:not(:last-child) {
                margin-bottom: 10px;
            }

            & > .word {
                color: #fafafa;
                font-size: 30px;
                display: flex;
                justify-content: space-between;

                & > span:nth-child(2) {
                    ${closeButton}
                }
            }
        }
    }

    & > h2 {
        font-size: 30px;
        text-shadow: 4px 3px 0 #222, 6px 5px 0 #024166;
        color: #fafafa;
    }

    & > .no-words {
        color: #333;
        font-size: 20px;
    }
`;
