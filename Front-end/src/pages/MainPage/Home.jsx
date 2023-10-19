import React, { useState } from "react";
import { Grid, Box, Container } from "@mui/material";;
import Player from "../../components/Player/Player";
import TopButton from "../../components/TopButton/TopButton";
import Listitem from "../../components/listItem";
import { useAuth } from '../../Service/AuthContext';
import { styled, useTheme } from "@mui/material";
import Search from "../../components/Search";

const Widget = styled("div")(({ theme }) => ({
    padding: 16,
    borderRadius: 15,
    width: "100%",
    maxWidth: "100%",
    margin: "auto",
    position: "relative",
    zIndex: 1,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
    backdropFilter: "blur(40px)",
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
  }));


const Home = () => {
    let userId = localStorage.getItem("userId");
    const { auth } = useAuth();
    const theme = useTheme();
    const [lists, setLists] = useState([]); //принимаем и храним список для Player
    const [selectedList, setSelectedList] = useState(null); //принимаем и храним список для проигрывания
    // const [addToPlaylist, setAddToPlaylist] = useState(null); //принимаем и храним песню для передачи в listitem
    
    // console.log("Home: ", lists);

        // Функция для установки новых плейлистов
    const getPlaylists = (newPlaylists) => {
    setLists(newPlaylists);
    };
        // Функция обновления плейлистов
    const upPlaylists = (newPlaylists) => {
    setLists(newPlaylists);
  };
        // Функция передачи песни из Search в Player  
    const handleAddToPlay = (song) => {
      // console.log([song]);
      setSelectedList([song]);
    };
        // Функция передачи песни из Search в listitem  
    // const addToPlaylist = (song) => {
    //   // console.log(song);
    //   setAddToPlaylist([song]);
    // };

    

  return (
    <Container theme={theme} component="main" maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Widget>
              <Search
                handleAddToPlay={handleAddToPlay}
                // addToPlaylist={addToPlaylist}
              />
            </Widget>
            </Grid>
          <Grid item xs={12} sm={6}>
              <Player
                playlists={lists}
                selectedList={selectedList} //передаем данные песни:выбраный лист из itemlist и из search
              />
            </Grid>
            <Grid item xs={12} sm={3}>
            {auth && <Widget>
              <Listitem
              userId={userId}
              getPlaylists={getPlaylists}
              upPlaylists={upPlaylists} // передаем функцию обновления листов
              onListSelect={setSelectedList}  //принимаем список листов
              />
              </Widget>}
            </Grid>
        </Grid>
        <TopButton/>
    </Container>
  );
};

export default Home;