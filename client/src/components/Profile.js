import { useContext, useEffect, useState } from "react"
import { UserContext } from "./CurrentUserContex"
import { useParams } from "react-router-dom"
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { NavLink } from "react-router-dom";
import { FiHeart, FiAlignJustify, FiTrash } from "react-icons/fi";

const Profile = () => {
    const {userId} = useParams();

    const {currentUserId, currentUserFetch} = useContext(UserContext);

    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [posts, setPosts] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [checkFollow, setCheckFollow] = useState(true)
    const [likes, setLikes] = useState(null)
    const [allPosts, setAllPosts] = useState(null)

    const buttons = ["Posts", "Liked"];

    const [active, setActive] = useState(buttons[0])
    
    useEffect(() => {
        document.title = "Profile"
    }, [])

    useEffect(() => {
        if(currentUserFetch){
            setCheckFollow(currentUserFetch.followed.some(followed => followed === userId))
        }
    },[currentUserFetch])

    useEffect(() => {
        fetch(`/users/${userId}`)
        .then(res => res.json())
        .then(resData => setUser(resData.data))

        fetch(`/posts/${userId}`)
        .then(res => res.json())
        .then(resData => setPosts(resData.data.reverse()))
        
        fetch(`/likes/${userId}`)
        .then(res => res.json())
        .then(resData => setLikes(resData.data.reverse()))

        fetch("/users")
        .then(res => res.json())
        .then(resData => setUsers(resData.data))

        fetch("/posts")
        .then(res => res.json())
        .then(resData => setAllPosts(resData.data.reverse()))
    }, [userId, refresh])

    const handleSubscribe = () => {
        fetch("/subscribe",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                userId: userId,
                currentUserId: currentUserFetch._id
            })        
        }
        )
        .then(res => res.json())
        .then(resData => {setRefresh(!refresh); setCheckFollow(true)})

    }

    const handleUnsubscribe = () => {
        fetch("/unsubscribe",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                userId: userId,
                currentUserId: currentUserFetch._id
            })        
        }
        )
        .then(res => res.json())
        .then(resData => {setRefresh(!refresh); setCheckFollow(false)})
    }

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
        user !== null && posts !== null && likes !== null && currentUserFetch ? <Wrapper>
            <UserPic src={user.picUrl} alt="user"/>
            <UserName>{user.name}</UserName>
            <UserTag>{`@${user.handler}`}</UserTag>
            {currentUserId !== userId ? checkFollow ? <Subscribe onClick={() => handleUnsubscribe()}>Unfollow</Subscribe> : <Subscribe onClick={() => handleSubscribe()}>Follow</Subscribe> : <></>}
            <FollowersBlock>
                <Follows to={`../followers/${userId}`}>{`${user.followers.length} Followers`}</Follows>
                <Follows to={`../followed/${userId}`}>{`${user.followed.length} Followed`}</Follows>
            </FollowersBlock>
            {user.desc.length > 0 ? <DescBlock>{user.desc}</DescBlock> : <></>}
            <Tabs>
                {buttons.map(button => {
                    return (
                        <TabsToggle 
                        id = {button}
                        key = {button}
                        active = {active === button}
                        onClick = {() => setActive(button)}>
                            {button === "Posts" ? <FiAlignJustify/> : <FiHeart/>}
                        </TabsToggle>
                    )
                    })
                }
            </Tabs>
            {active === "Posts" ?<PostsBlock>
                {posts.length !== 0 ? 
                posts.map(post => {
                    return (
                        <SinglePost key={post._id}>
                            {user._id === currentUserId ? <DeleteButtonForLikes onClick={() => {deletePost(post._id)}}><FiTrash/></DeleteButtonForLikes> : <></>}
                            {ReactHtmlParser(post.body)} {post.likes.length > 0 ? <NumOfLikes>{post.likes.length}</NumOfLikes> : <></>} {post.likes.every(like => checkCondition(like)) ? <LikeButton onClick={() => {handleLike(post._id)}}><FiHeart/></LikeButton> : <UnlikeButton onClick={() => {handleUnlike(post._id)}}><FiHeart style={{fill: "black"}}/></UnlikeButton>}
                        </SinglePost>
                    )
                }) : <Message>To see your post you have to post something first</Message>}
            </PostsBlock> : <></>}
            {active === "Liked" ? <PostsBlock>
            {
            likes.map(likeId => {
                return allPosts.map(post => {
                    if (post._id === likeId){
                        return users.map(user => {
                            if (user._id === post.authorID){
                                return (
                                    <PostWrapper key={user._id}>
                                        <UserInfo to={`/${user._id}`}>
                                            <UserPicForPost src={user.picUrl} alt="user"/>
                                            <NameBlock>
                                                <Name>{user.name}</Name>
                                                <Handler>{`@${user.handler}`}</Handler>
                                            </NameBlock>
                                        </UserInfo>
                                        <PostBlock key={post._id}>
                                            <PostText>
                                                {user._id === currentUserId ? <DeleteButtonForLikes onClick={() => {deletePost(post._id)}}><FiTrash/></DeleteButtonForLikes> : <></>}
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
            </PostsBlock> : <></>}
        </Wrapper> : <p>Loading...</p>
    )
}

const DeleteButton = styled.div`
background: none;
border: none;
position: relative;
margin-bottom: 5px;
cursor: pointer;
color: black;
font-size: 25px;
z-index: 900;
left: 90%;
`

const DeleteButtonForLikes = styled.div`
background: none;
border: none;
position: relative;
margin-bottom: 5px;
cursor: pointer;
color: black;
font-size: 25px;
z-index: 900;
left: 90%;

`

const PostWrapper = styled.div`
margin-bottom: 30px;
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

const Name = styled.p`
margin-bottom: 5px;
`

const Handler = styled.p`
opacity: 70%;
font-size: 15px;
`

const NameBlock = styled.div`

@media (min-width: 320px) {
    margin-left: 15px;
    position: relative;
    top: 5px;
}

`
const UserPicForPost = styled.img`
@media (min-width: 320px) {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
}
`

const Tabs = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    height: 50px;
    border-top: 2px solid black;
    `

    const TabsName = styled.button`
    background: none;
    border: none;
    font-size: 25px;
    font-weight: bold;
    color: white;
    text-align: center;
    width: 300px;
    font-family: Consolas, monaco, monospace;

    &:hover{
    color: black;
    background-color: white;
    }
    `
    const TabsToggle = styled(TabsName)`
    ${({ active }) =>
    active &&
    `
    color: black;
    background-color: white;
    `}
    `

const Message = styled.p`
text-align: center;
margin: 10px;
`
const Subscribe = styled.button`
cursor: pointer;
background-color: white;
color: black;
border: none;

@media (min-width: 320px) {
    margin-top: 15px;
    width: 150px;
    height: 40px;
    font-size: 20px;
}
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

const Wrapper = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;

@media (min-width: 320px) {
    
}
`

const UserPic = styled.img`
@media (min-width: 320px) {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    margin-top: 50px;
}
`
const UserName = styled.p`
text-align: center;

@media (min-width: 320px) {
    margin-top: 20px;
    font-size: 25px;
}
`

const UserTag = styled.p`
opacity: 80%;

@media (min-width: 320px) {
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 18px;
}
`

const FollowersBlock = styled.div`
display: flex;
flex-direction: row;
width: 100%;
justify-content: space-between;
border: 2px solid white;

@media (min-width: 320px) {
    margin-top: 15px;
    padding: 15px;
}
`

const Follows = styled(NavLink)`
text-decoration: none;
color: white;

@media (min-width: 320px) {
    padding-left: 40px;
    padding-right: 40px;
}
`

const DescBlock = styled.div`
width: 100%;
text-align: center;
color: black;
background-color: white;
font-size: 20px;
padding: 20px;
`
const PostsBlock = styled.div`

@media (min-width: 320px) {
    margin-top: 10px;
    margin-bottom: 60px;
}

`

const SinglePost = styled.div`
background-color: white;
color: black;

@media (min-width: 320px) {
    padding-left: 40px;
    padding-right: 40px;
    margin-bottom: 15px;
    border-radius: 10px;
    width: 80vw;
    padding: 15px;
}
`

// const UserInfo = styled.div`

// `

// const Name = styled.p`

// `

// const ProfilePic = styled.img`

// `

// const handler = styled.p`

// `
export default Profile