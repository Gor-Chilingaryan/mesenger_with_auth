import React from 'react'
import style from './userInfo.module.css'
import { useUserInfo } from './useUserInfo'

function UserInfo() {
	const { userInfo, error, isLoding } = useUserInfo()

	if (isLoding) return <span className={style.loader}></span>
	if (error) return <div className={style.error}>Error: {error}</div>
	if (!userInfo) return null

	const { avatar, firstName, lastName, email, phone } = userInfo

	
}

export { UserInfo }
