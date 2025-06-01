# Meeting Reservations App

A React-based web application for managing meeting reservations with user authentication and a responsive UI.

## Features
- User registration and login with Firebase Authentication.
- Create, edit, and cancel meeting reservations.
- Calendar view with FullCalendar.
- Responsive design using Material UI.
- Mock backend with JSON Server.

## Installation
1. Clone the repository: `git clone https://github.com/ivan-baranovskyi/React__project.git`
2. Install dependencies: `npm install`
3. Set up Firebase: Create a Firebase project, enable Email/Password authentication, and add config to `src/firebase.ts`.
4. Run JSON Server: `npm run server`
5. Start the app: `npm start`

## Usage
- Register or log in to access the dashboard.
- Create meetings with title, date, time, and participants.
- View meetings in a list or calendar view.

## Technologies
- React 18, TypeScript, Material UI, FullCalendar, Formik, Yup, Firebase, Axios, JSON Server