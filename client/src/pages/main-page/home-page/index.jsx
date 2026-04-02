/**
 * Home page component.
 * Composes authenticated layout with top navigation and user profile panel.
 */
import React from 'react'
import { Navigation } from '../navigation'
import { UserInfo } from '../user-info'
/**
 * Renders the main authenticated landing page.
 * @returns {JSX.Element} Home page layout.
 */
function HomePage() {
	return (
		<div>
			<header>
				<Navigation />
			</header>
			<main>
				<UserInfo />
			</main>
		</div>
	)
}

export { HomePage }
