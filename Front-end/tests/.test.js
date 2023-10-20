import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SignIn from '../src/pages/SignIn';

test('validates email format', () => {
  render(<SignIn />);
  const emailInput = screen.getByLabelText('Email Address');
  const emailErrorMessage = 'Please, enter a valid email address.';

  // Вводим некорректный email
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

  // Проверяем, что сообщение об ошибке отображается
  const errorText = screen.getByText(emailErrorMessage);
  expect(errorText).toBeInTheDocument();
});

test('validates password length', () => {
  render(<SignIn />);
  const passwordInput = screen.getByLabelText('Password');
  const passwordErrorMessage = 'Password must be between 4 and 10 characters.';

  // Вводим короткий пароль
  fireEvent.change(passwordInput, { target: { value: '123' } });

  // Проверяем, что сообщение об ошибке отображается
  const errorText = screen.getByText(passwordErrorMessage);
  expect(errorText).toBeInTheDocument();

  // Вводим слишком длинный пароль
  fireEvent.change(passwordInput, { target: { value: 'toolongpassword' } });

  // Проверяем, что сообщение об ошибке отображается
  expect(errorText).toBeInTheDocument();
});

test('submits the form with valid input', () => {
  render(<SignIn />);
  const emailInput = screen.getByLabelText('Email Address');
  const passwordInput = screen.getByLabelText('Password');
  const signInButton = screen.getByText('Sign In');

  // Заполняем поля ввода с корректными данными
  fireEvent.change(emailInput, { target: { value: 'valid-email@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'pass' } });

  // Нажимаем на кнопку "Sign In"
  fireEvent.click(signInButton);

  // Добавьте здесь ожидания, которые подтверждают успешное выполнение действия
});
