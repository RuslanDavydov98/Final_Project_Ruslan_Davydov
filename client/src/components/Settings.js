import { useContext, useEffect, useState } from "react"
import { UserContext } from "./CurrentUserContex"
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

const Settings = () => {

    const {currentUserId, currentUserFetch} = useContext(UserContext)

    const navigate = useNavigate(); 

    const [value, setValue] = useState({
        name: "",
        handler: "",
        desc: ""
    })

    useEffect(() => {
        document.title = "Settings"
    }, [])

    const handleChange = (event) => {
        setValue({ ...value, [event.target.name]: event.target.value})
    }

    const applyChanges = () => {
        fetch("/updateuserinfo",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"},
            body: JSON.stringify({
                userId: currentUserId,
                name: value.name,
                handler: value.handler,
                desc: value.desc,
                picUrl: previewUrl
            })        
        }
        )
        .then(res => res.json())
        .then(resData => {navigate(`/${currentUserId}`)})
    }

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        
        const selectedFile = event.target.files[0];

        const fileReader = new FileReader();

        fileReader.readAsDataURL(selectedFile);
        fileReader.onload = () =>{
        setPreviewUrl(fileReader.result)
    }
    }

    return (
        currentUserFetch !== null ? <Wrapper>
            <Label htmlFor="avatar-input">
            {previewUrl ? <Image src={previewUrl} alt="Preview"/> : <Image src={currentUserFetch.picUrl} alt="Preview"/>}
            <UploadIcon><FiUpload/></UploadIcon>
            <Picture id="avatar-input" type="file" accept="image/*" onChange={(e) => {handleFileChange(e)}}></Picture>
            </Label>
            <Name name="name" placeholder={currentUserFetch.name} value={value.name} onChange={(e) => handleChange(e)}></Name>
            <Handler name="handler" placeholder={currentUserFetch.handler} value={value.handler} onChange={(e) => handleChange(e)}></Handler>
            <Desc name="desc" placeholder={currentUserFetch.desc.length > 0 ? currentUserFetch.desc : "Your description here!"} value={value.desc} onChange={(e) => handleChange(e)}></Desc>
            <Submit onClick={() => {applyChanges()}}>Submit</Submit>
        </Wrapper> : <>Loading...</>
    )
}

const Label = styled.label`
display: flex;
justify-content: center;
`


const UploadIcon = styled.div`
position: absolute;
opacity: 50%;
z-index: 999;
font-size: 50px;
color: white;
top: 4.3em;
left: 40%;
background-color: black;
padding-left: 10px;
padding-right: 10px;
padding-top: 6px;
padding-bottom: 6px;
border-radius: 50%;
`
const Image = styled.img`
width: 250px;
height: 250px;
object-fit: cover;
border-radius: 50%;
margin-top: 50px;
margin-bottom: 30px;
`

const Wrapper = styled.div`
font-family: Consolas, monaco, monospace;
display: flex;
justify-content: center;
flex-wrap: wrap;
`

const Picture = styled.input`
margin-bottom: 20px;
display: none;
`

const Submit = styled.button`
border: none;
background: none;
color: black;
background-color: white;
height: 60px;
width: 200px;
font-size: 30px;
cursor: pointer;
`

const Name = styled.input`
margin-bottom: 10px;
height: 40px;
width: 70vw;
font-size: 20px;
text-align: center;

`

const Handler = styled.input`
margin-bottom: 10px;
height: 40px;
width: 70vw;
font-size: 20px;
text-align: center;

`

const Desc = styled.input`
height: 100px;
width: 90vw;
font-size: 20px;
text-align: center;
margin-bottom: 20px;
`

export default Settings