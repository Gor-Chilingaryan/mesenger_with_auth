import React from 'react'
import styles from './userAvatarModal.module.css'

const AVATARS = [
	'/user-images/avatar-1.jpeg',
	'/user-images/avatar-2.jpeg',
	'/user-images/avatar-3.jpeg',
	'/user-images/avatar-4.jpeg',
	'/user-images/avatar-5.jpeg',
	'/user-images/avatar-6.jpeg',
	'/user-images/avatar-7.jpeg',
	'/user-images/avatar-8.jpeg',
	'/user-images/avatar-9.jpeg',
	'/user-images/avatar-10.jpeg',
	'/user-images/avatar-11.jpeg',
	'/user-images/avatar-12.jpeg',
]

function UserAvatarModal({ isOpen, onClose, onSelectAvatar }) {
	if (!isOpen) return null

	const handleOverlayClick = e => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const handleAvatarClick = avatar => {
		onSelectAvatar(avatar)
		onClose()
	}

	return (
		<div className={styles.modalOverlay} onClick={handleOverlayClick}>
			<div className={styles.modalContent}>
				<button className={styles.closeButton} onClick={onClose}>
					×
				</button>
				<h2 className={styles.title}>Select your avatar</h2>
				<div className={styles.avatarGrid}>
					{AVATARS.map((avatar, idx) => (
						<img
							key={idx}
							src={avatar}
							alt={`Avatar ${idx + 1}`}
							className={styles.avatarIcon}
							onClick={() => handleAvatarClick(avatar)}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default UserAvatarModal
