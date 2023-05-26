import { useEffect, useContext, useState } from "react";
import { UserContext } from "./CurrentUserContex";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser"
import "../styles/custom-styles.css"
import { NavLink } from "react-router-dom";
import { FiHeart, FiTrash } from "react-icons/fi";



const HomeFeed = (props) => {

    const { currentUserFetch } = useContext(UserContext);

    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        document.title = "Home Feed";
        
    }, [])

    useEffect(() => {
        fetch("/posts")
        .then(res => res.json())
        .then(resData => setPosts(resData.data.reverse()))

        fetch("/users")
        .then(res => res.json())
        .then(resData => setUsers(resData.data))
    }, [refresh])

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
        return like !== currentUserFetch._id
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
        posts !== null && users !== null && currentUserFetch ? 
        <Wrapper>
        {currentUserFetch.posts.length > 0 || currentUserFetch.followed.length > 0 ? 
            posts.map(post => {
                if (post.authorID === currentUserFetch._id){
                    return (
                        <PostWrapper key={`post: ${post._id}`}>
                            <UserInfo to={`/${currentUserFetch._id}` }>
                            <UserPic src={currentUserFetch.picUrl} alt="user"/>
                            <NameBlock>
                                <Name>{currentUserFetch.name}</Name>
                                <Handler>{`@${currentUserFetch.handler}`}</Handler>
                            </NameBlock>
                            </UserInfo>
                            <PostBlock>
                                <PostText>
                                <DeleteButton onClick={() => {deletePost(post._id)}}><FiTrash/></DeleteButton>
                                {ReactHtmlParser(post.body)} {post.likes.length > 0 ? <NumOfLikes>{post.likes.length}</NumOfLikes> : <></>} {post.likes.every(like => checkCondition(like)) ? <LikeButton onClick={() => {handleLike(post._id)}}><FiHeart/></LikeButton> : <UnlikeButton onClick={() => {handleUnlike(post._id)}}><FiHeart style={{fill: "black"}}/></UnlikeButton>}</PostText>
                            </PostBlock>
                        </PostWrapper>
                    )
                }else{
                    return currentUserFetch.followed.map(followed => {
                        if (followed === post.authorID){
                            return users.map(user => {
                                if (post.authorID === user._id){
                                    return (
                                        <PostWrapper key={`post: ${post._id}`}>
                                        <UserInfo to={`/${user._id}`}>
                                            <UserPic src={user.picUrl} alt="user"/>
                                            <NameBlock>
                                                <Name>{user.name}</Name>
                                                <Handler>{`@${user.handler}`}</Handler>
                                            </NameBlock>
                                        </UserInfo>
                                        <PostBlock>
                                            <PostText>{ReactHtmlParser(post.body)} {post.likes.length > 0 ? <NumOfLikes>{post.likes.length}</NumOfLikes> : <></>} {post.likes.every(like => checkCondition(like)) ? <LikeButton onClick={() => {handleLike(post._id)}}><FiHeart/></LikeButton> : <UnlikeButton onClick={() => {handleUnlike(post._id)}}><FiHeart style={{fill: "black"}}/></UnlikeButton>}</PostText>
                                        </PostBlock>
                                        </PostWrapper>
                                    )
                                }
                            })
                        }
                    })
                }
            })
        : <Message>You don't have posts to see, please post something or follow someone to see their posts</Message>}
        </Wrapper> : <>Loading...</>
    )
}

const Message = styled.p`
text-align: center;
margin: 10px;
`
const PostWrapper = styled.div`
margin-bottom: 30px;
`

const DeleteButton = styled.div`
background: none;
border: none;
position: relative;
cursor: pointer;
color: black;
font-size: 25px;
z-index: 900;
left: 90%;
margin-bottom: 5px;
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



export default HomeFeed