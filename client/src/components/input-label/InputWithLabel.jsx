import React from 'react'
import style from './inputWithLabel.module.css'

function InputWithLabel({
	type,
	name,
	disabled = false,
	groupStyle,
	labelStyle,
	inputStyle,
	labelText,
	value,
	changeValue,
	onBlur,
}) {
	return (
		<div className={`${groupStyle} ${style.input_group}`}>
			<label htmlFor={name} className={`${labelStyle} ${style.label}`}>
				{labelText}
			</label>
			<input
				disabled={disabled}
				id={name}
				type={type}
				name={name}
				className={`${inputStyle} ${style.input}`}
				value={value}
				onChange={changeValue}
				onBlur={onBlur}
			/>
		</div>
	)
}
export default InputWithLabel
