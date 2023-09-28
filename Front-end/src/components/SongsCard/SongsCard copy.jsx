import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import ReactAudioPlayer from "react-audio-player";
import { fetchSongs } from "../../Service/Api";
import "./SongsCard.css";

export default function CardCarousel({ cards }) {
  const [songs, setData] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Индекс текущей карточки

  useEffect(() => {
    async function getData() {
      const songsData = await fetchSongs();
      setData(songsData);
    }
    getData();
  }, []);

  // Функция для переключения на предыдущую карточку
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Функция для переключения на следующую карточку
  const nextCard = () => {
    if (currentCardIndex < songs.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader/>
        <CardMedia
          component="img"
          height="250"
          image={songs[currentCardIndex]?.coverUrl} // Отображаем только текущую карточку
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            {songs[currentCardIndex]?.artist}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {songs[currentCardIndex]?.track}
          </Typography>
        </CardContent>
        <ReactAudioPlayer src={songs[currentCardIndex]?.fileUrl} controls />
           <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton onClick={prevCard} disabled={currentCardIndex === 0}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={nextCard} disabled={currentCardIndex === songs.length - 1}>
            <SkipNextIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}
