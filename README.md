# Finance Dashboard

## Overview
Finance Dashboard is a web application that provides insights into financial data using interactive charts and authentication via Auth0.

## Features
- User authentication with Auth0
- Responsive UI with Tailwind CSS
- Financial data visualization using Recharts
- Navigation with React Router

## Installation
### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/finance-dashboard.git
   cd finance-dashboard
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```sh
   REACT_APP_AUTH0_DOMAIN=your-auth0-domain
   REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   REACT_APP_API_BASE_URL=your-api-url
   ```

## Usage
### Development Server
Run the app locally:
```sh
npm start
```

### Build for Production
```sh
npm run build
```

## Deployment
This app can be deployed using **Vercel**, **Netlify**, or **Firebase Hosting**.
To deploy with Vercel:
```sh
vercel --prod
```

## Technologies Used
- React.js
- React Router
- Tailwind CSS
- Recharts
- Auth0 Authentication

## License
This project is licensed under the MIT License.
