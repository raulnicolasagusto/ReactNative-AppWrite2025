## HECHO CON EL VIDEO DE PEDROTECH : React Native Full Course 2025 | Become a React Native Pro in 4 Hours

LINK DEL VIDEO : https://www.youtube.com/watch?v=J50gwzwLvAk&t=14753s

# React Native App with Appwrite Integration

This is a React Native app built with Expo that integrates with Appwrite for authentication and database functionality.

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git

## Setup Instructions

### 1. Setup Appwrite

1. Create an Appwrite account at [https://appwrite.io](https://appwrite.io)
2. Create a new project in Appwrite
3. Create the following collections:

   - **Habits Collection**
     - Fields:
       - title (string)
       - description (string)
       - user_id (string)
       - created_at (timestamp)
       - updated_at (timestamp)
     - Indexes:
       - user_id (string)

   - **Completions Collection**
     - Fields:
       - habit_id (string)
       - user_id (string)
       - completed_at (timestamp)
     - Indexes:
       - user_id (string)
       - habit_id (string)

4. Create a new API key for your project
5. Note down your Appwrite endpoint URL and API key

### 2. Setup the Project

1. Clone the repository
   ```bash
   git clone [your-repo-url]
   cd react2025
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Appwrite configuration:
   ```
   APPWRITE_ENDPOINT=your_appwrite_endpoint
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   ```

4. Start the development server
   ```bash
   npx expo start
   ```

5. Run the app in your preferred environment:
   - Android emulator: `npx expo start --android`
   - iOS simulator: `npx expo start --ios`
   - Web: `npx expo start --web`

### 3. Appwrite Configuration

The app uses the following Appwrite collections:

- **Habits Collection**
  - Stores user habits
  - Each habit has a title, description, and user_id
  - Used to track user's daily habits

- **Completions Collection**
  - Tracks habit completions
  - Stores habit_id, user_id, and completion timestamp
  - Used to calculate streaks and statistics

### 4. Features

- User authentication using Appwrite
- Habit tracking with streaks
- Real-time habit completion tracking
- Statistics and analytics
- Responsive UI for mobile and web

### 5. Development

The project uses:

- Expo Router for navigation
- React Native Paper for UI components
- Appwrite for backend services
- TypeScript for type safety

## Troubleshooting

1. If you encounter any Appwrite connection issues:
   - Verify your `.env` file is properly configured
   - Check if your Appwrite instance is running
   - Verify network connectivity

2. If you encounter any build issues:
   - Clear the Expo cache: `npx expo start --clear`
   - Reinstall dependencies: `npm install`

## Support

For issues and feature requests, please open an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
