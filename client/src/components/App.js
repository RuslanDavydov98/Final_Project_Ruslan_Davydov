import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyled from "../GlobalStyled";
import CommonFeed from "./CommonFeed";
import Header from "./Header";
import Footer from "./Footer";
import HomeFeed from "./HomeFeed";
import Profile from "./Profile";
import Follows from "./Follows";
import Followed from "./Followed";
import Liked from "./Liked";
import UserProvider from "./CurrentUserContex";
import { useState } from "react";
import TextEditor from "./TextEditor";
import Settings from "./Settings";



function App() {



  const [postButtonActive, setPostButtonActive] = useState(false); //state for appear text editor for new post when button is clicked
  const [status, setStatus] = useState(false); //state for uploading page when added new post


  const showOrHideTextEditor = () => {
    setPostButtonActive(!postButtonActive);
  }

  
  


  return (
    <UserProvider>
    <BrowserRouter>
      <GlobalStyled/>
      <Header/>
      <Main>
        {postButtonActive ? <TextEditor postButtonActive={postButtonActive} setPostButtonActive={setPostButtonActive} status={status} setStatus={setStatus}/>  : <></>}
          <Routes>
            <Route path="/homefeed" element={<HomeFeed status={status}/>}/>
            <Route path="/" element={<CommonFeed/>}/>
            <Route path="/:userId" element={<Profile/>}/>
            <Route path="/followers/:userId" element={<Follows/>}/>
            <Route path="/followed/:userId" element={<Followed/>}/>
            <Route path="/liked/:userId" element={<Liked/>}/>
            <Route path="/settings/" element={<Settings/>}/>
          </Routes>
      </Main>
      <Footer showOrHideTextEditor={showOrHideTextEditor}/>
    </BrowserRouter>
    </UserProvider>
  );
}

const Main = styled.div`
padding-top: 70px;
color: white;
min-height: 100vh;
height: 100%;
background-color: black;

`

export default App;
