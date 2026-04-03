/**
 * Login page component.
 * Renders sign-in form and validation feedback.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import style from './login.module.css';
import { useLoginForm } from '@features/auth/hook/useLoginForm';
import InputWithLabel from '@components/input-label/InputWithLabel';
import ValidationMessages from '@components/validation-message/ValidationMessage';

/**
 * Displays login form UI powered by `useLoginForm`.
 * @returns {JSX.Element} Login screen.
 */
function Login() {
  const {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleSignIn,
    handleChange,
  } = useLoginForm();

  return (
    <div className={style.login_container}>
      <div className={style.login_content}>
        <h1 className={style.login_title}>SIGN IN</h1>
        <form className={style.login_form} onSubmit={handleSignIn}>
          <InputWithLabel
          inputStyle={style.input}
            type='email'
            name='email'
            labelText='Email Address'
            value={formData.email}
            changeValue={handleChange}
            onBlur={handleBlur}
          />

          <InputWithLabel
            inputStyle={style.input}
            type='password'
            name='password'
            labelText='Password'
            value={formData.password}
            changeValue={handleChange}
            onBlur={handleBlur}
          />

          <ValidationMessages
            status={validationStatus.email}
            errorTextStyle={style.error_text}
          >
            Please provide a valid email address
          </ValidationMessages>

          <ValidationMessages
            status={validationStatus.password}
            errorTextStyle={style.error_text}
          >
            Password must be 8+ chars, include a number and symbol (!@#$)
          </ValidationMessages>

          <Link to='/forgot-password' className={style.forgot_password_link}>
            Forgot Password?
          </Link>

          <div className={style.navigations_items}>
            <button
              type='submit'
              className={style.button}
              disabled={!isFormValid}
            >
              Sign in
            </button>
          

            <Link to='/registration' className={style.sign_up_link}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Login };
