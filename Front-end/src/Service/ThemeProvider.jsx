import React, { useState, createContext, useContext, useCallback } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

const ThemeContext = createContext();

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  // Функция для переключения темы
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};


export const PlaylistContainer = ({ children }) => {
  const [playlists2, setPlaylists] = useState([]); // Инициализируйте список плейлистов

  // Функция для установки новых плейлистов
  const updatePlaylists = (newPlaylists) => {
    setPlaylists(newPlaylists);
  };

  return (
    // Рендерите детей (другие компоненты) и передавайте им данные и функции через пропсы
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { playlists2, updatePlaylists });
      })}
    </div>
  );
};