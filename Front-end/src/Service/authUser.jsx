import axios from 'axios';


// Функция для аутентификации пользователя
const authUser = async (email, password) => {
  try {
    // Проверить, есть ли токен в localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Если токен уже есть в localStorage, используйте его для аутентификации
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      return true;
      } else {
      // Отправить запрос на сервер с именем пользователя и паролем
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      // Получить JWT-токен из ответа сервера
      const token = response.data.token;
      // Сохранить токен в localStorage или в памяти приложения
      localStorage.setItem('token', token);
      // Вернуть успех
      return true;
    }
  } catch (error) {
    // Вернуть ошибку аутентификации
    console.log("Error auth");
    return false;
  }
};

// Функция для добавления токена в заголовок запроса
const addTokenToHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export { authUser, addTokenToHeaders };