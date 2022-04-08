import styled from 'styled-components';
import heart from '../img/2665.svg';
import brokenHeart from '../img/1F494.svg';

const Container = styled.div`
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    height: 30px;
    width: 150px;
    opacity: 0.65;
    text-align: center;

    & > .img {
        height: 30px;
    }

    @media screen and (max-width: 756px) {
        position: initial;
        margin-top: -20px;
        margin-bottom: 20px;
        justify-content: center;
        width: 100%;
    }
`;

type PropsT = {
    lives: number;
};

export const Lives = (props: PropsT) => {
    return (
        <Container className="lives-container">
            <img src={props.lives < 5 ? brokenHeart : heart} />
            <img src={props.lives < 4 ? brokenHeart : heart} />
            <img src={props.lives < 3 ? brokenHeart : heart} />
            <img src={props.lives < 2 ? brokenHeart : heart} />
            <img src={props.lives < 1 ? brokenHeart : heart} />
        </Container>
    );
};
