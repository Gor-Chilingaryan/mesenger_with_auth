import React, { useState } from 'react'
import style from './homePage.module.css'
import { Navigation } from '../navigation/Navigation'
import {UserInfo} from '../user-info/UserInfo'

function HomePage() {
	return (
		<div className={style.homePage_container}>
			<header className={style.header}>
				<Navigation />
			</header>
			<main className={style.main}>
				<UserInfo />
			</main>
		</div>
	)
}

export { HomePage }
