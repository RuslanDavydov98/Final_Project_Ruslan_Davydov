import { useEffect, useContext, useState } from "react";
import { UserContext } from "./CurrentUserContex";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser"
import "../styles/custom-styles.css"
import { NavLink } from "react-router-dom";
import { FiHeart, FiTrash } from "react-icons/fi";
import { useParams } from "react-router-dom";



const Liked = () => {
    
    useEffect(() => {
        document.title = "Liked posts"
    }, [])

    const { userId } = useParams();

    const { currentUserFetch, currentUserId } = useContext(UserContext);

    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [likes, setLikes] = useState(null);

    useEffect(() => {
        fetch("/posts")
        .then(res => res.json())
        .then(resData => setPosts(resData.data.reverse()))

        fetch("/users")
        .then(res => res.json())
        .then(resData => setUsers(resData.data))

        fetch(`/likes/${userId}`)
        .then(res => res.json())
        .then(resData => setLikes(resData.data.reverse()))
    }, [refresh])

    useEffect(() => {
        document.title = "Common feed"
    }, [])


    const handleLike = (postId) => {
        fetch("/addlike",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                postId: postId,
                currentUserId: currentUserFetch._id
            })        
        }
        )
        .then(res => res.json())
        .then(resData => {setRefresh(!refresh)})
    }
    
    const checkCondition = (like) => {
        if (currentUserFetch){
            return like !== currentUserFetch._id
        }
    }

    const handleUnlike = (postId) => {
        fetch("/removelike",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                postId: postId,
                currentUserId: currentUserFetch._id
            })        
        }
        )
        .then(res => res.json())
        .then(resData => {setRefresh(!refresh)})
    }

    const deletePost = async (postId) => {
        fetch("/deletepost",
        {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                postId: postId
            })        
        }
        )
        .then(res => {
            if (res.ok){
                setRefresh(!refresh)
            }else{
                setRefresh(!refresh)
            }
        })
    }

    return (
        posts !== null && users !== null && likes !== null ? 
        <Wrapper>
        {
            likes.map(likeId => {
                return posts.map(post => {
                    if (post._id === likeId){
                        return users.map(user => {
                            if (user._id === post.authorID){
                                return (
                                    <PostWrapper key={user._id}>
                                        <UserInfo to={`/${user._id}`}>
                                            <UserPic src={user.picUrl} alt="user"/>
                                            <NameBlock>
                                                <Name>{user.name}</Name>
                                                <Handler>{`@${user.handler}`}</Handler>
                                            </NameBlock>
                                        </UserInfo>
                                        <PostBlock key={post._id}>
                                            <PostText>
                                                {user._id === currentUserId ? <DeleteButton onClick={() => {deletePost(post._id)}}><FiTrash/></DeleteButton> : <></>}
                                                {ReactHtmlParser(post.body)} {post.likes.length > 0 ? <NumOfLikes>{post.likes.length}</NumOfLikes> : <></>} {currentUserFetch !== null ? post.likes.every(like => checkCondition(like)) ? <LikeButton onClick={() => {handleLike(post._id)}}><FiHeart/></LikeButton> : <UnlikeButton onClick={() => {handleUnlike(post._id)}}><FiHeart style={{fill: "black"}}/></UnlikeButton> : <></>}</PostText>
                                        </PostBlock>
                                    </PostWrapper>
                                )
                            }
                        })
                    }
                })
            })
        }
        </Wrapper> : <>Loading...</>
    )
}


const PostWrapper = styled.div`
margin-bottom: 30px;
`

const DeleteButton = styled.div`
background: none;
border: none;
position: absolute;
cursor: pointer;
color: black;
font-size: 25px;
z-index: 900;
left: 88%;
`

const NumOfLikes = styled.p`
font-size: 20px;
margin-right: 10px;
position: relative;
top: 33px;
left: 83%;
`
const LikeButton = styled.button`
display: flex;
flex-wrap: wrap;
cursor: pointer;
background: none;
border: none;
font-size: 30px;
position: relative;
top: 10px;
left: 88%;
`

const UserInfo = styled(NavLink)`
text-decoration: none;
color: white;
display: flex;
border-bottom: 1px solid white;

@media (min-width: 320px) {
    width: 88vw;
    padding-bottom: 15px;
    margin-left: 3.5vw;
    margin-bottom: 15px;
}
`

const UnlikeButton = styled.button`
display: flex;
flex-wrap: wrap;
cursor: pointer;
background: none;
border: none;
font-size: 30px;
position: relative;
top: 10px;
left: 88%;
fill: black;
`

const NameBlock = styled.div`

@media (min-width: 320px) {
    margin-left: 15px;
    position: relative;
    top: 5px;
}

`

const UserPic = styled.img`
@media (min-width: 320px) {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
}
`

const Name = styled.p`
margin-bottom: 5px;
`

const Handler = styled.p`
opacity: 70%;
font-size: 15px;
`
const Wrapper = styled.div`
padding-bottom: 50px;
z-index: 1;
`
const PostBlock = styled.div`
width: 100vw;
`

const PostText = styled.div`
background-color: white;
color: black;

@media (min-width: 320px) {
    width: 80%;
    margin-bottom: 30px;
    border-radius: 10px;
    padding: 15px;
    position: relative;
    left: 3.5vw;
}

`
export default Liked