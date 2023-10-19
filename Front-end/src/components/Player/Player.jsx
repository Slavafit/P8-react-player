import React, { useState, useEffect, useRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import RepeatOneRoundedIcon from '@mui/icons-material/RepeatOneRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import ShuffleOnRoundedIcon from '@mui/icons-material/ShuffleOnRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchSongs } from "../../Service/Api";
import ReactPlayer from 'react-player'
import AddSongToPlaylist from "../Modales/AddSongToPlaylist"
import { useAuth } from '../../Service/AuthContext';
import NotAuthModal from '../Modales/NotAuthorized';
import axios from "axios";



const WallPaper = styled('div')(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(rgb(40, 0, 0) 0%, rgb(20, 0, 0) 100%)'
    : 'linear-gradient(rgb(0, 255, 255) 0%, rgb(0, 128, 128) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&:before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(at center center, rgb(120, 0, 0) 0%, rgba(120, 0, 0, 0) 64%)'
      : 'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
  },
  '&:after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(at center center, rgb(140, 0, 0) 0%, rgba(140, 0, 0, 0) 70%)'
      : 'radial-gradient(at center center, rgb(255, 255, 0) 0%, rgba(255, 255, 0, 0) 70%)',
    transform: 'rotate(30deg)',
  },
}));

const Widget = styled('div')(({ theme }) => ({
  padding: 15,
  borderRadius: 15,
  width: 400,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
}));

const CoverImage = styled('div')({
  width: '100%',
  height: '100%',
  Maxheight: '100%',
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '1rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function MusicPlayer({ playlists, selectedList }) {
  
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const reactPlayerRef = useRef(null);
  const { auth } = useAuth();
  const theme = useTheme();
  const [position, setPosition] = React.useState(32);
  const [paused, setPaused] = React.useState(true);
  const [volume, setVolume] = React.useState(30);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [openAddSongModal, setOpenAddSongModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [openNotAuthModal, setOpenNotAuthModal] = useState(false);
  
  // console.log("Player: ", songs);
    // useEffect(() => {
    //   async function getData() {
    //     try {
    //       setLoading(true);
    //       const songsData = await fetchSongs();
    //       setSongs(songsData);
    //       setLoading(false);
    //     } catch (error) {
    //       console.error('Error loading songs:', error);
    //       setLoading(false);
    //     }
    //   }
    //   getData();
    // }, []);

    useEffect(() => {
      fetchSongs();
    }, []);

    const fetchSongs = async ()  => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/songs');
        setSongs(response.data);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }

    

    const handlePreviousTrack = () => {
      if (shuffle) {
        // Если включен случайный режим, выберите случайную песню вместо предыдущей
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentTrackIndex); // Убедитесь, что это не текущая песня
        setCurrentTrackIndex(randomIndex);
      } else {
        // В противном случае переключитесь на предыдущий трек (если есть)
        if (currentTrackIndex > 0) {
          setCurrentTrackIndex(currentTrackIndex - 1);
        }
      }
    };

    const handleNextTrack = () => {
      if (shuffle) {
        // Если включен случайный режим, выберите случайную песню вместо следующей
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentTrackIndex); // Убедитесь, что это не текущая песня
        setCurrentTrackIndex(randomIndex);
      } else {
        // В противном случае переключитесь на следующий трек (если есть)
        if (currentTrackIndex < songs.length - 1) {
          setCurrentTrackIndex(currentTrackIndex + 1);
        }
      }
    };

  const handleSeek = (newValue) => {
    setPosition(newValue);

    const newTime = (newValue / 100) * duration; // Предполагается, что newValue в диапазоне от 0 до 100
    reactPlayerRef.current.seekTo(newTime);
  };
  
  const handleProgress = ({ playedSeconds }) => {
    if (!seeking) {
      setPosition((playedSeconds / duration) * 100); // Преобразуйте значение played в проценты
    }
  };

  const handleMuteToggle = () => {      //обработчик для кнопки "Volume Off"
    setMuted(!muted);
  };
  
  const handleDuration = (d) => {
    setDuration(d);
  };

  const seeking = false; // Установите это значение в true, когда начинаете перемотку
  function formatDuration(value) {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  //кнопка репит
  const handleRepeatToggle = () => {
    setRepeat(!repeat);
  };

  const handleEnded = () => {
    if (repeat) {
      reactPlayerRef.current.seekTo(0);
      setPaused(false);
    } else {
      if (shuffle) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentTrackIndex);
        setCurrentTrackIndex(randomIndex);
      } else {
        if (currentTrackIndex < songs.length - 1) {
          handleNextTrack();
        }
      }
    }
  };
  
  //функция случайного выбора
  const handleShuffleToggle = () => {
    setShuffle(!shuffle);
  };


  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    // Обработчик нажатия на иконку добавления песни
    const handleAddToPlaylistClick = (song) => {
      if (auth) {
        setSelectedSong(song);  // Устанавливаем выбранную песню в состояние selectedSong
        setOpenAddSongModal(true);  // Открываем диалоговое окно для добавления песни
      } else {
        // Показать модальное окно с предупреждением
        setOpenNotAuthModal(true);
      }
    };


    // Используем useEffect для мониторинга изменений selectedList
  useEffect(() => {
    if (selectedList) {
      // console.log("selectedList:", selectedList);
      // console.log("songs: ", songs);
      setSongs(selectedList);
    } else {
      setSongs([]); // Если selectedList отсутствует, сбросить список песен
    }
  }, [selectedList]);

    //затемнение экрана во время загрузки
    if (loading) {
    return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loading}>
    <CircularProgress color="inherit" />
    </Backdrop>
    };

    return (
    <Container theme={theme} component="main" maxWidth="xs">
      <Widget>
      <CssBaseline />
      {songs[currentTrackIndex] && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <CoverImage>
              <img
                alt={songs[currentTrackIndex].artist}
                src={songs[currentTrackIndex].coverUrl}
              />
          </CoverImage>
          <Box sx={{ mt: 1.5, minWidth: 0, textAlign: 'left' }}>
            <Typography noWrap>
              <b>{songs[currentTrackIndex].artist}</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              {songs[currentTrackIndex].track}
            </Typography>
          </Box>
        </Box>
        )}
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={100}
          onChange={(_, value) => handleSeek(value)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(Math.floor(position * (duration / 100)))}</TinyText>
          <TinyText>{formatDuration(Math.floor(duration - (position * (duration / 100))))}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
            <IconButton aria-label="Repeat" title="Repeat song" onClick={handleRepeatToggle}>
              {repeat ? (
                <RepeatOneRoundedIcon fontSize="small" htmlColor={mainIconColor} />
              ) : (
                <RepeatRoundedIcon fontSize="small" htmlColor={mainIconColor} />
              )}
          </IconButton>
          <IconButton aria-label="previous song" title="Previous song" onClick={handlePreviousTrack}>
            <SkipPreviousRoundedIcon fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            title="Play/pause"
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton aria-label="next song" title="Next song" onClick={handleNextTrack}>
            <SkipNextRoundedIcon fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label="Shuffle" title="Random playing" onClick={handleShuffleToggle}>
            {shuffle ? (
              <ShuffleOnRoundedIcon fontSize="small" htmlColor={mainIconColor} />
            ) : (
              <ShuffleRoundedIcon fontSize="small" htmlColor={mainIconColor} />
            )}
          </IconButton>
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
          <IconButton aria-label="Volume Off" onClick={handleMuteToggle}>
            {muted ? (
              <VolumeOffRoundedIcon fontSize="large" htmlColor={mainIconColor} />
            ) : (
              <VolumeMuteRoundedIcon fontSize="large" htmlColor={mainIconColor} />
            )}
          </IconButton>
          <VolumeDownRounded htmlColor={lightIconColor} />
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={(event, newValue) => {
                setVolume(newValue); // Обновляем состояние громкости при изменении Slider
              }}
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  backgroundColor: '#fff',
                  '&:before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                  },
                },
              }}
            />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}>
            <IconButton aria-label="Like" title='Like'>
            {auth && <ThumbUpOffAltIcon fontSize="medium" htmlColor={mainIconColor} />}
          </IconButton>
            <IconButton aria-label="DisLike" title='DisLike'>
            {auth && <ThumbDownOffAltIcon fontSize="medium" htmlColor={mainIconColor} />}
          </IconButton>
          <IconButton aria-label="Song to list" title='Add to list'
                onClick={() => handleAddToPlaylistClick(songs[currentTrackIndex])}>
              <FavoriteBorderRoundedIcon fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box >
      </Widget>
       <ReactPlayer
        ref={reactPlayerRef}
        url={songs[currentTrackIndex] ? songs[currentTrackIndex].fileUrl : null}
        playing={!paused}
        volume={muted ? 0 : volume / 100}
        // controls={true}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded} // Обработчик завершения трека
        />
          {auth && <AddSongToPlaylist
          open={openAddSongModal}
          onClose={() => setOpenAddSongModal(false)}
          selectedSong={selectedSong}
          playlists={playlists}
        />}
      <NotAuthModal
       open={openNotAuthModal}
       onClose={() => setOpenNotAuthModal(false)} />
      <WallPaper />
    </Container>
  );
}
