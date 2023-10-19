import React, { useState } from "react";
import {
  ListItemText,
  Box,
  ListItem as MuiListItem,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ClearIcon from "@mui/icons-material/Clear";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import NotAuthModal from "./Modales/NotAuthorized";
import { useAuth } from "../Service/AuthContext";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  // '& .MuiInputBase-input': {
  //   padding: theme.spacing(1, 1, 1, 0),
  //   // vertical padding + font size from searchIcon
  //   paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  //   transition: theme.transitions.create('width'),
    width: '100%',
  //   [theme.breakpoints.up('sm')]: {
  //     width: '12ch',
  //     '&:focus': {
  //       width: '20ch',
  //     },
  //   },
  // },
}));

const TinyText = styled(Typography)(({ theme }) => ({
    fontSize: "0.8rem",
    opacity: 0.7,
    fontWeight: 500,
    letterSpacing: 0.2,
    marginTop: 4,
    fontFamily: "monospace",
    display: "flex",
    color: theme.palette.mode === "light" ? "red" : "white", // Выбор цвета в зависимости от темы
    alignItems: "center",
  }));

const SearchComponent = ({ handleAddToPlay, addToPlaylist }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [serverResponse, setServerResponse] = useState("");
  const [openNotAuthModal, setOpenNotAuthModal] = useState(false);
  const { auth } = useAuth();

  //   console.log("Search: ", serverResponse);
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/song/?search=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      setServerResponse(error.response.data.message);
      console.error("Error searching:", error);
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery("");
    setServerResponse("");
  };

  //обработчик клавиш
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      clearSearchResults();
    }
  };
  // Обработчик нажатия на иконку добавления песни
  // const handleAddToPlaylist = (song) => {
  //     if (auth) {
  //         // console.log(song);
  //         addToPlaylist(song);
  //     } else {
  //     // Показать модальное окно с предупреждением
  //     setOpenNotAuthModal(true);
  //     }
  // };

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="left">
        <IconButton size="medium" onClick={handleSearch}>
          <SearchIcon fontSize="inherit" />
        </IconButton>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <IconButton size="medium" onClick={() => clearSearchResults()}>
          <ClearIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <TinyText>{serverResponse}</TinyText>
      <Box display="flex" flexDirection="row" alignItems="left">
        {searchResults.map((result, index) => (
          <MuiListItem key={index}>
            <ListItemText primary={result.artist} secondary={result.track} />
            <IconButton
              aria-label="Play"
              title="Play"
              onClick={() => handleAddToPlay(result)}
            >
              <PlayArrowIcon fontSize="medium" />
            </IconButton>
            {/* <IconButton aria-label="Song to list" title='Add to list'
                    onClick={() => handleAddToPlaylist(result)}>
                <FavoriteBorderRoundedIcon fontSize="small"/>
                </IconButton> */}
          </MuiListItem>
        ))}
      </Box>
      <NotAuthModal
        open={openNotAuthModal}
        onClose={() => setOpenNotAuthModal(false)}
      />
    </>
  );
};

export default SearchComponent;
