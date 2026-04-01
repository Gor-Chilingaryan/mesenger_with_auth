/**
 * Validation rules and message component.
 * Centralizes field validators and renders inline validation feedback.
 */
import React from 'react'
import style from './validationMessage.module.css'

export const validationRules = {
	firstName: value => /^[a-zA-Zа-яА-ЯёЁ\- ]+$/.test(value) && value.length >= 2,
	lastName: value => /^[a-zA-Zа-яА-ЯёЁ\- ]+$/.test(value) && value.length >= 2,
	email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
	password: value =>
		/^(?=.*\d)(?=.*[!@#$%^&* _])\S+$/.test(value) && value.length >= 8,
	confirmPassword: (value, password) => value === password && value.length >= 8,
}

/**
 * Renders children only when field validation status is invalid.
 * @param {{status: string|null, validationMessageStyle?: string, validationMessageTextStyle?: string, children: React.ReactNode}} props - Component props.
 * @returns {JSX.Element|null} Validation message or null.
 */
function ValidationMessages({
	status,
	validationMessageStyle = style.validation_messages,
	validationMessageTextStyle = '',
	children,
}) {
	if (status === 'invalid') {
		return (
			<div className={validationMessageStyle}>
				<p className={style.validationMessageTextStyle}>{children}</p>
			</div>
		)
	}

	return null
}

export default ValidationMessages
