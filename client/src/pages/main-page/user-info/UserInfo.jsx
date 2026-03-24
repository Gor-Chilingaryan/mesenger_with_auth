import React from 'react'
import style from './userInfo.module.css'
import { useUserInfo } from './useUserInfo'
import InputWithLabel from '../../../components/input-label/InputWithLabel'
import { Link } from 'react-router-dom'
import cameraPlusIcon from '../../../assets/icons/camera-plus.svg'
function UserInfo() {
	const {
		userInfo,
		error,
		isLoading,
		handleDesableInput,
		disableInput,
		handleChange,
		handleSaveValues,
		handleLogout,
	} = useUserInfo()

	if (isLoading) return <span className={style.loader}></span>
	if (error) return <div className={style.error}>Error: {error}</div>
	if (!userInfo) return null

	const userInfoData = [
		{
			id: 'firstName',
			name: 'firstName',
			type: 'text',
			label: 'First Name',
			value: userInfo.firstName,
		},
		{
			id: 'lastName',
			name: 'lastName',
			type: 'text',
			label: 'Last Name',
			value: userInfo.lastName,
		},
		{
			id: 'email',
			name: 'email',
			type: 'email',
			label: 'Email',
			value: userInfo.email,
		},
		{
			id: 'phone',
			name: 'phone',
			type: 'tel',
			label: 'Phone',
			value: userInfo.phone,
		},
	]

	return (
		<div className={style.userInfo_container}>
			<div>
				<img
					src={userInfo.avatar}
					alt={'User Avatar'}
					className={style.userInfo_avatar}
				/>
				{!disableInput && (
					<img
						onClick={() => console.log('open Modal with avatars')}
						src={cameraPlusIcon}
						className={style.addAvatarIcon}
						alt='add avatar icon'
					/>
				)}
			</div>

			<div className={style.userInformation}>
				{userInfoData.map(field => {
					return (
						<InputWithLabel
							key={field.id}
							id={field.id}
							type={field.type}
							name={field.name}
							groupStyle={style.input_group}
							labelStyle={style.label}
							inputStyle={style.input}
							labelText={field.label}
							value={field.value || ''}
							changeValue={handleChange}
							disabled={disableInput}
						/>
					)
				})}
			</div>

			{disableInput ? (
				<button className={style.editButton} onClick={handleDesableInput}>
					Edit
				</button>
			) : (
				<div className={style.button_group}>
					<button className={style.cancelButton} onClick={handleDesableInput}>
						Cancel
					</button>
					<button className={style.saveButton} onClick={handleSaveValues}>
						Save
					</button>
				</div>
			)}

			<Link to='/' onClick={handleLogout} className={style.logoutButton}>
				LOG OUT
			</Link>
		</div>
	)
}

export { UserInfo }
