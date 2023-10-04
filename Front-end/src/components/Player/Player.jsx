import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, IconButton } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ReactPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { fetchSongs } from "../../Service/Api";

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [songs, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const songsData = await fetchSongs();
        setData(songsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    }
    getData();
  }, []);

  const handlePreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < songs.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };


    if (loading) {
    return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loading}>
    <CircularProgress color="inherit" />
    </Backdrop>
    };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'left' }}>
        <img src={songs[currentTrackIndex].coverUrl} alt="Album Art" style={{ width: '100%' }} />
        <Typography variant="h5" style={{ margin: '10px 0' }}>{songs[currentTrackIndex].artist}</Typography>
        <Typography variant="subtitle1">{songs[currentTrackIndex].track}</Typography>
        <Typography style={{ textAlign: 'center' }}>
          <IconButton onClick={handlePreviousTrack} >
            <SkipPreviousIcon fontSize="large" />
          </IconButton>
          <IconButton onClick={handleNextTrack}>
            <SkipNextIcon fontSize="large"/>
          </IconButton>
        </Typography>
        <ReactPlayer
          src={songs[currentTrackIndex].fileUrl}
          autoPlay={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleNextTrack}
        />
      </Paper>
    </Container>
  );
}

export default AudioPlayer;
