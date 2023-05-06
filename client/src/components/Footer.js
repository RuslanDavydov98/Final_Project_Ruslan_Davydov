import styled from "styled-components";
import {FiAlignJustify, FiHeart, FiPlusSquare, FiUser, FiUsers,} from "react-icons/fi"
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./CurrentUserContex";

const Footer = (props) => {

    const [buttonActive, setButtonActive] = useState(false);

    const { currentUserId } = useContext(UserContext);

    const handleClick = () => {
        props.showOrHideTextEditor();
    }
    return (
        currentUserId ? 
        <Wrapper>
            <NavButton to={`/liked/${currentUserId}`}><FiHeart/></NavButton>
            <NavButton to="/"><FiAlignJustify/></NavButton>
            <Button active={setButtonActive} onClick={() => {
                handleClick();
                setButtonActive(!buttonActive)}}><FiPlusSquare/></Button>
            <NavButton to="/homefeed"><FiUsers/></NavButton>
            <NavButton to={`/${currentUserId}`}><FiUser/></NavButton>
        </Wrapper> : <Wrapper>
            
        </Wrapper>
    )
}

const Wrapper = styled.div`
background-color: white;
color: black;
position: fixed;
bottom: 0px;
width: 100%;
display: flex;
justify-content: space-between;
border-top: 2px solid black;
z-index: 999;

@media (min-width: 320px) {
    height: 60px;
}

`

const NavButton = styled(NavLink)`
text-decoration: none;
border: none;
background: none;
font-size: 40px;
color: black;

&.active{
    background-color: black;
    color: white;
}

@media (min-width: 320px) {
    height: 60px;
    padding-top: 5px;
    padding-left: 15px;
    padding-right: 15px;
}
`

const Button = styled.button`
text-decoration: none;
border: none;
background: none;
font-size: 40px;
color: black;
cursor: pointer;

&.active{
    background-color: black;
    color: white;
}

@media (min-width: 320px) {
    height: 60px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
}
`
export default Footer