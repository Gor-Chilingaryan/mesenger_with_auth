/**
 * Registration page component.
 * Renders sign-up form with field-level validation messages.
 */
import React from 'react';
import style from './registration.module.css';
import { Link } from 'react-router-dom';
import InputWithLabel from '@components/input-label/InputWithLabel';
import ValidationMessages from '@components/validation-message/ValidationMessage';
import { useRegistrationForm } from '@features/auth/hook/useRegistrationForm';

/**
 * Displays user registration UI.
 * @returns {JSX.Element} Registration screen.
 */
function Registration() {
  const {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleRegistration,
    handleChange,

  } = useRegistrationForm();

  return (
    <>
     {/* className={style.registration_container}> */}
      <div className={style.registration_content}>
        <h1 className={style.registration_title}>SIGN UP</h1>

        <form className={style.registration_form} onSubmit={handleRegistration}>
          <InputWithLabel
            inputStyle={style.input}
            type='text'
            name='firstName'
            labelText='First Name'
            value={formData.firstName}
            changeValue={handleChange}
            onBlur={handleBlur}
          />
          {/* <ValidationMessages status={validationStatus.firstName}>
            First Name is required
          </ValidationMessages> */}

          <InputWithLabel
            inputStyle={style.input}
            type='text'
            name='lastName'
            labelText='Last Name'
            value={formData.lastName}
            changeValue={handleChange}
            onBlur={handleBlur}
          />
          <ValidationMessages status={validationStatus.lastName}>
            Last Name is required
          </ValidationMessages>

          <InputWithLabel
            inputStyle={style.input}
            type='email'
            name='email'
            labelText='Email'
            value={formData.email}
            changeValue={handleChange}
            onBlur={handleBlur}
          />
          <ValidationMessages status={validationStatus.email}>
            Please provide a valid email address
          </ValidationMessages>

          <InputWithLabel
            inputStyle={style.input}
            type='password'
            name='password'
            labelText='Password'
            value={formData.password}
            changeValue={handleChange}
            onBlur={handleBlur}
          />
          <ValidationMessages status={validationStatus.password}>
            Password must be 8+ chars, include a number and symbol (!@#$)
          </ValidationMessages>

          <InputWithLabel
            inputStyle={style.input}
            type='password'
            name='confirmPassword'
            labelText='Confirm Password'
            value={formData.confirmPassword}
            changeValue={handleChange}
            onBlur={handleBlur}
          />
          <ValidationMessages status={validationStatus.confirmPassword}>
            Passwords do not match
          </ValidationMessages>

          <Link to='/forgot-password' className={style.forgot_password_link}>
            Forgot Password?
          </Link>

          <div className={style.navigations_items}>
            <button
              type='submit'
              className={style.registration_button}
              disabled={!isFormValid}
            >
              Sign Up
            </button>

            <Link to='/' className={style.sign_in_link}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export { Registration };
