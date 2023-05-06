"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

const { 
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
} = require("./handlers")



express()
    // Below are methods that are included in express(). We chain them for convenience.
    // --------------------------------------------------------------------------------

    // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
    .use(morgan("tiny"))
    .use(express.json({ limit: "100mb"}))

    // Any requests for static files will go into the public folder
    .use(express.static("public"))

    // Nothing to modify above or below this line
    // ---------------------------------
    .post("/adduser", addUser)

    .post("/addpost", addPost)

    .get("/users", getAllUsers)

    .get("/posts", getAllPosts)

    .get("/users/:userId", getUser)
    
    .get("/posts/:userId", getUserPosts)

    .get("/followers/:userId", getUserFollowers)

    .get("/likes/:userId", getLikedPosts)

    .get("/followed/:userId", getUserFollowed)

    .post("/subscribe", subscribeUser)

    .post("/unsubscribe", unsubscribeUser)

    .post("/addlike", addLike)

    .post("/removelike", removeLike)

    .post("/updateuserinfo", updateUserInformation)

    .delete("/deletepost", deletePost)

    // ---------------------------------
    // Nothing to modify above or below this line

    // this is our catch all endpoint.
    .get("*", (req, res) => {
        res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for.",
        });
    })


    // Node spins up our server and sets it to listen on port 8000.
    .listen(8000, () => console.log(`Listening on port 8000`));