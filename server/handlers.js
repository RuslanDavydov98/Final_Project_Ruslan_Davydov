const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

//add user in database
const addUser = async (req, res) => {
    const {id, email, name, nickname, picture} = req.body;

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const user = await db.collection("users").findOne( { _id: id} );

    if(!user){
        await db.collection("users").insertOne({
            _id: id,
            email: email,
            name: name,
            handler: nickname,
            picUrl: picture,
            posts: [],
            followers: [],
            followed: [],
            likes: [],
            desc:""
        })

        res.status(201).json({ status: 201, message: "User added!" });
    }

    client.close();
}

//add post in database
const addPost = async (req, res) => {

    const {textBody, userId} = req.body;
    const id = uuidv4();

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const user = await db.collection("users").findOne({ _id: userId })

    if(user){

        await db.collection("users").updateOne( {_id: userId }, { $push: {posts: id }} );

        await db.collection("posts").insertOne(
            {   
                _id: id,
                body: textBody,
                authorID: userId,
                likes: [],
                comments: [],
            }
        )

        res.status(201).json({ status: 201, message: "post added!" })
    }else{
        res.status(404).json({ status: 404, message: "user not found" })
    }

    client.close();

}

const getAllPosts = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const posts = await db.collection("posts").find().toArray();

    if (posts){
        res.status(200).json({ status: 200, data: posts})
    }else{
        res.status(404).json({ status: 404, message: "No posts found!"})
    }

    client.close();
    
}

const getAllUsers = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const users = await db.collection("users").find().toArray();

    if (users){
        res.status(200).json({ status: 200, data: users})
    }else{
        res.status(404).json({ status: 404, message: "No users found!"})
    }

    client.close();
    
}

const getUser = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const {userId} = req.params;

    const user = await db.collection("users").findOne( { _id: userId });

    if(user){
        res.status(200).json({ status: 200, data: user, message: "User found!"})
    }else{
        res.status(404).json( {status: 404, message: "User not found! "})
    }

    client.close();
}

const getUserPosts = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const {userId} = req.params;

    const posts = await db.collection("posts").find( {authorID: userId }).toArray();

    if(posts){
        res.status(200).json({ status: 200, data: posts, message: "Posts here"})
    }else{
        res.status(404).json( {status: 404, message: "Posts not found! "})
    }

    client.close();
}

const subscribeUser = async ( req, res ) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { userId, currentUserId } = req.body;

    const user = await db.collection("users").findOne( { _id: userId } );
    const currentUser = await db.collection("users").findOne( { _id: currentUserId } );

    if ( user, currentUser ){
        const userFollowers = user.followers;
        const currentUserFollowed = currentUser.followed;

        const checkCondition = (fol, user) => {
            return fol !== user
        }

        if(userFollowers.every(follower => checkCondition(follower, currentUserId))){
            
            userFollowers.push(currentUserId);
            currentUserFollowed.push(userId);

            await db.collection("users").updateOne( {_id: userId}, {$set: {followers: userFollowers}} )
            await db.collection("users").updateOne( {_id: currentUserId}, {$set: {followed: currentUserFollowed}} )

            res.status(201).json({status: 201, message: "Updated!"})
        }else{
            res.status(409).json({status:409, message: "Already subsribed"})
        }

        
    }else{
        res.status(404).json({status: 404, message: "Users not found!"})
    }

    client.close();
}

const unsubscribeUser = async ( req, res ) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { userId, currentUserId } = req.body;

    const user = await db.collection("users").findOne( { _id: userId } );
    const currentUser = await db.collection("users").findOne( { _id: currentUserId } );

    if ( user, currentUser ){

        const userFollowers = user.followers;
        const currentUserFollowed = currentUser.followed;

        const checkCondition = (fol, user) => {
            return fol !== user
        }
        
        const newUserFollowers = userFollowers.filter(follower => checkCondition(follower, currentUserId))

        const newCurrentUserFollowed = currentUserFollowed.filter(followed => checkCondition(followed, userId))


        await db.collection("users").updateOne( {_id: userId}, {$set: {followers: newUserFollowers}} )
        await db.collection("users").updateOne( {_id: currentUserId}, {$set: {followed: newCurrentUserFollowed}} )

        res.status(201).json({status: 201, message: "Updated!"})
    }else{
        res.status(404).json({status: 404, message: "Users not found!"})
    }

    client.close();
}

const getUserFollowers = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { userId } = req.params;

    const user = await db.collection("users").findOne( {_id: userId} );

    if(user){
        res.status(200).json( {status: 200, data: user.followers} );
    }else{
        res.status(404).json( {status: 404, message: "User not found!"} );
    }

    client.close();
}

const getUserFollowed = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { userId } = req.params;

    const user = await db.collection("users").findOne( {_id: userId} );

    if(user){
        res.status(200).json( {status: 200, data: user.followed} );
    }else{
        res.status(404).json( {status: 404, message: "User not found!"} );
    }

    client.close();
}

const addLike = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { postId, currentUserId } = req.body;

    const user = await db.collection("users").findOne( { _id: currentUserId } );
    const post = await db.collection("posts").findOne( { _id: postId } );

    if (user, post){

        const checkCondition = (postId, like) =>{
            return like === postId;
        }

        if(user.likes.some(like => checkCondition(postId, like))){
            res.status(409).json({status:409, message: "Already liked!"});
        }else{

            const userLikes = user.likes;
            const postLikes = post.likes;

            userLikes.push(postId);
            postLikes.push(currentUserId);

            await db.collection("users").updateOne( {_id: currentUserId}, {$set: {likes: userLikes }});
            await db.collection("posts").updateOne( { _id: postId }, {$set: {likes: postLikes }});

            res.status(201).json( {status: 201, message: "Liked!" } );
        }
    }else{
        res.status(404).json({status: 404, message: "Miss some info!"});
    }

    client.close();
}


const removeLike = async (req,res) => {
    
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { postId, currentUserId } = req.body;

    const user = await db.collection("users").findOne( { _id: currentUserId } );
    const post = await db.collection("posts").findOne( { _id: postId } );

    if (user, post){

        const postLikes = post.likes;
        const userLikes = user.likes;

        const checkCondition = (postId, like) =>{
            return like !== postId;
        }

        const newPostLikes = postLikes.filter(like => checkCondition(currentUserId, like));
        const newUserLikes = userLikes.filter(like => checkCondition(postId, like));

        await db.collection("users").updateOne( {_id: currentUserId}, {$set: {likes: newUserLikes }});
        await db.collection("posts").updateOne( { _id: postId }, {$set: {likes: newPostLikes }});

        res.status(201).json({status: 201, message: "Like removed!"});
    }else{
        res.status(404).json({status: 401, message: "Missing some information!"});
    }

    client.close();
}

const getLikedPosts = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const { userId } = req.params;

    const user = await db.collection("users").findOne( { _id: userId } );

    if (user) {
        const likeArray = user.likes;
        res.status(200).json({ status: 200, data: likeArray})
    }else{
        res.status(404),json({status: 404, message: "User not found!"})
    }
    

    client.close();
}

const deletePost = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const {postId} = req.body;

    if (postId){
        await db.collection("posts").deleteOne({_id: postId})

        res.status(204).json( {status: 204, message: "Post deleted!" } );
    }else{
        res.status(404).json( { status: 404, message: "Post not found!" })
    }

    client.close();
}


const updateUserInformation = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Final_project");

    const {userId, name, handler, picUrl, desc} = req.body;

    const user = await db.collection("users").findOne( {_id: userId });

    if (user){
        
        if (name) {
            await db.collection("users").updateOne({ _id: userId }, { $set: {name: name} })
        }

        if (handler) {
            await db.collection("users").updateOne({ _id: userId }, { $set: {handler: handler} })
        }

        if (picUrl){
            await db.collection("users").updateOne({ _id: userId }, { $set: {picUrl: picUrl} })
        }

        if (desc){
            await db.collection("users").updateOne({ _id: userId }, { $set: {desc: desc} })
        }

        res.status(200).json( {status: 200, message: "Updated!"} )
    }else{
        res.status(404).json( {status: 404, message: "User not found!"} )
    }

    client.close()
}


module.exports = {
    addUser,
    addPost,
    getAllPosts,
    getAllUsers,
    getUser,
    getUserPosts,
    subscribeUser,
    unsubscribeUser,
    getUserFollowed,
    getUserFollowers,
    addLike,
    removeLike,
    getLikedPosts,
    deletePost,
    updateUserInformation

}