/**
 * New password page component.
 * Lets user set and confirm a new password after email verification step.
 */
import React from 'react';
import style from './newPassword.module.css';
import { Link } from 'react-router-dom';

import InputWithLabel from '@components/input-label/InputWithLabel';
import { useNewPassword } from '@features/auth/hook/useNewPassword';
import ValidationMessages from '@components/validation-message/ValidationMessage';

/**
 * Displays password reset form UI.
 * @returns {JSX.Element} New-password screen.
 */
function NewPassword() {
  const {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleSavePassword,
  } = useNewPassword();
  return (
    <>
      <div className={style.reset_password_content}>
        <h1 className={style.reset_password_title}>CREATE NEW PASSWORD</h1>
        <form
          className={style.reset_password_form}
          onSubmit={handleSavePassword}
        >
          <InputWithLabel
            inputStyle={style.input}
            type='password'
            name='password'
            labelText='New Password'
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

          <div className={style.navigate_items}>
            <button
              type='submit'
              className={style.button}
              disabled={!isFormValid}
            >
              Save
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

export { NewPassword };
