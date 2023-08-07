import { useContext, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import styled from "styled-components"
import { FiUserMinus } from "react-icons/fi"
import { UserContext } from "./CurrentUserContex";

const Followed = () => {
    
    const [users, setUsers] = useState(null)
    const [followed, setFollowed] = useState(null);
    const [refresh, setRefresh ] = useState(false);

    const {currentUserId} = useContext(UserContext)

    const { userId } = useParams();

    useEffect(() => {
        fetch("/users")
        .then(res => res.json())
        .then(resData => setUsers(resData.data))

        fetch(`/followed/${userId}`)
        .then(res => res.json())
        .then(resData => setFollowed(resData.data))
    }, [refresh, userId])

    const handleUnsubscribe = (userId) => {
        fetch("/unsubscribe",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                userId: userId,
                currentUserId: currentUserId
            })        
        }
        )
        .then(res => res.json())
        .then(resData => setRefresh(!refresh))
    }
    return (
        users !== null && followed !== null ? followed.length > 0 ? 
        <Wrapper>
            {followed.map(follower => {
                return users.map(user => {
                    if(user._id === follower){
                        return (
                        <FollowerWrapper key={user._id} to={`/${user._id}`}>
                            <UserPic src={user.picUrl}/>
                            <NameWrapper>
                            <Name>{user.name}</Name>
                            <Handler>@{user.handler}</Handler>
                            </NameWrapper>
                            {follower === currentUserId ? <></> : <Button onClick={() => handleUnsubscribe(follower)}> <FiUserMinus/> </Button>}
                        </FollowerWrapper>)
                    }
                })
            })}
        </Wrapper> : <Message>Followed no one</Message> : <p>Loading...</p>
    )
}


const Wrapper = styled.div`

`

const Button = styled.button`
background: none;
color: white;
border: none;
font-size: 25px;
position: absolute;
right: 5vw;
padding-top: 10px;
cursor: pointer;
z-index: 999;
`
const FollowerWrapper = styled(NavLink)`
text-decoration: none;
color: white;
display: flex;
margin-bottom: 10px;
padding-bottom: 20px;
padding-top: 10px;
border-bottom: 2px solid white;
padding-left: 10px;
`

const NameWrapper = styled.div`
display: block;
position: relative;
top: 1vh;
`

const UserPic = styled.img`
margin-right: 15px;
width: 50px;
height: 50px;
border-radius: 50%;
object-fit: cover;
`

const Name = styled.p`

`

const Handler = styled.p`
font-size: 15px;
margin-top: 5px;
opacity: 80%;
`

const Message = styled.p`
    text-align: center;
    font-size: 30px;
    margin-top: 10px;
`

export default Followed