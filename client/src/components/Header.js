import styled from "styled-components"
import logo from "../assets/logo.svg"
import { useContext, useState } from "react"
import { FiSettings, FiLogIn, FiLogOut} from "react-icons/fi"
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "./CurrentUserContex";
import { NavLink } from "react-router-dom";

const Header = () => {
    const [active, setActive] = useState(false);
    const { loginWithRedirect, logout } = useAuth0();

    const {user} = useContext(UserContext);

    return (
        <Wrapper>
            <Button isActive={active} onClick={() => {
                setActive(!active)
            }}><Logo src={logo} alt="logo"/></Button>
            {active ? <DropMenu>
                {user ? <><DropButton onClick={() => {logout({ logoutParams: { returnTo: window.location.origin } })}}><FiLogOut/> Log out</DropButton>
                <DropButtonSettings to="/settings"><FiSettings/> Settings</DropButtonSettings></> : <DropButton onClick={() => {loginWithRedirect()}}><FiLogIn/> Log in</DropButton>}
            </DropMenu> : <></>}
        </Wrapper>
    )
}

const DropMenu = styled.div`
position: absolute;
background-color: white;
display: flex;
flex-direction: column;

@media (min-width: 320px) {
    width: 150px;
    left: 29%;
    top: 100%;
}
`

const DropButton = styled.button`
background: none;
border: none;
cursor: pointer;
font-size: 20px;
text-align: center;

@media (min-width: 320px) {
    padding-top: 10px;
    padding-bottom: 10px;
}

:hover{
    color: white;
    background-color: black;
}
`

const DropButtonSettings = styled(NavLink)`
text-decoration: none;
color: black;
background: none;
border: none;
cursor: pointer;
font-size: 20px;
text-align: center;

@media (min-width: 320px) {
    padding-top: 10px;
    padding-bottom: 10px;
}

:hover{
    color: white;
    background-color: black;
}
`


const Wrapper = styled.div`
background-color: black;
border-bottom: 0.5px solid white;
position: fixed;
width: 100%;
z-index: 999;

@media (min-width: 320px) {
    height: 60px;
}

@media (min-width: 1024px) {
    height: 60px;
}
`

const Logo = styled.img`



@media (min-width: 320px) {
    height: 60px;
}


`

const Button = styled.button`
background: none;
border: none;
cursor: pointer;


@media (min-width: 320px) {
    margin-left: 40%;
}
`

export default Header