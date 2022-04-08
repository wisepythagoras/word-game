import styled from 'styled-components';

export const Title = styled.h1`
    color: #fafafa;
    text-align: center;
    text-shadow: 4px 3px 0 #222, 6px 5px 0 #024166;
    font-size: 40px;
    margin-bottom: 40px;
`;

export const Loading = styled.h3`
    color: #fafafa;
    text-align: center;
`;

export const Container = styled.div`
    max-width: 500px;
    margin: auto;
    padding: 10px;

    & > .hints {
        color: #fafafa;
        max-width: 340px;
        margin: auto;
        animation: fade-in 0.35s linear;

        & > ol {
            margin-left: -20px;

            & > li > h3.found {
                text-decoration: line-through;
                color: #04705c;
            }
        }

        & > h2 {
            font-size: 30px;
            text-shadow: 4px 3px 0 #222, 6px 5px 0 #024166;
        }
    }

    & > .footer {
        color: #555;
        font-size: 12px;
        margin-top: 60px;
        text-align: center;
        opacity: 0.3;
        transition: 0.2s linear;

        & a {
            font-weight: bold;
            color: #666;
        }

        &:hover {
            opacity: 1;
        }
    }

    & > .picked-words {
        animation: fade-in 0.35s linear;
    }

    @keyframes fade-in {
        0%, 30%, 50%, 70% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;
