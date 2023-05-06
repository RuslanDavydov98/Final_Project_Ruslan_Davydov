import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/custom-styles.css"
import { UserContext } from "./CurrentUserContex";
import { useState, useContext } from "react";

const TextEditor = (props) => {

    const { currentUserFetch } = useContext(UserContext);
    
    const [value, setValue] = useState("");

    const submitPost = (textBody) => {
    
        fetch("/addpost",
    {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"},
        body: JSON.stringify({
            textBody: textBody,
            userId: currentUserFetch._id,
        })        
    }
    )
    .then(res => res.json())
    .then(resData => props.setStatus(!props.status))
    }

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}],
            ['bold', 'underline', 'strike', 'blockquote'],
            [{'align': []}],
            ['link', 'image', 'video'],
        ]
    }
    
    const formats = [
        'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 
        'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 
        'align', 'color', 'background'
    ];


    return (
        <Wrapper>
            <PostInput>
                <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats}/>
            </PostInput> 
            <PostButton onClick={() => {
                submitPost(value);
                props.setPostButtonActive(!props.postButtonActive);
                }}>Post</PostButton>
        </Wrapper>
    )
}

const Wrapper = styled.div`
position: fixed;
z-index: 999;
top: 1vh;
right: 98vw;
`
const PostInput = styled.div`
background-color: white;
position: absolute;
color: black;
border: 2px solid black;

@media (min-width: 320px) {
    height: 50vh;
    width: 93vw;
    left: 3.3vw;
    top: 20vh;
}

overflow: hidden;
overflow-y: scroll;
`

const PostButton = styled.button`
position: absolute;
background: none;
background-color: white;
color: black;
border: none;
font-weight: bold;
font-size: 20px;
cursor: pointer;
border: 3px solid black;

@media (min-width: 320px) {
    height: 40px;
    width: 120px;
    top: 72vh;
    left: 35vw;
}
`

export default TextEditor;