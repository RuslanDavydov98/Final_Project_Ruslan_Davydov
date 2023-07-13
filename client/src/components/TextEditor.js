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
top: 20vh;
left: calc(${() => {
    const body = document.body;
    const computedStyle = getComputedStyle(body);
    return computedStyle.marginLeft
}
} + 50px);
`
const PostInput = styled.div`
background-color: white;
position: absolute;
color: black;
border: 2px solid black;
height: 50vh;
width: 380px;
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
height: 40px;
width: 120px;
top: 52vh;
left: 120px;
`

export default TextEditor;