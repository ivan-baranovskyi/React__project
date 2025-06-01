export interface User {
	id: string
	email: string
	username: string
	role: 'user' | 'admin'
	createdAt: string
}

export interface Meeting {
	id: string
	title: string
	description: string
	date: string
	startTime: string
	endTime: string
	participants: string[]
	createdBy: string
	createdAt: string
	status: 'scheduled' | 'canceled'
}
