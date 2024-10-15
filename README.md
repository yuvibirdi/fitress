# FITRIS: Fitness Meets Tetris

**FITRIS** is an innovative exercise game that combines fitness routines with the classic game of Tetris. The game uses AI-powered exercise detection to make working out engaging and fun. With **OpenCV** detecting exercise movements and a responsive game design, FITRIS transforms your workout into game controls, making fitness more interactive.

## Features

- **AI-Powered Exercise Detection**: Uses **OpenCV** to recognize different fitness movements like squats, push-ups, jumping jacks, and more.
- **Interactive Gameplay**: Fitness routines control the Tetris blocks, providing a fun, real-time workout challenge.
- **ReactJS Frontend**: A dynamic and user-friendly interface built with **ReactJS**.
- **Flask Backend**: Secure and efficient backend logic developed with **Flask**.
- **Motivational Game Design**: Challenges and rewards keep you motivated throughout your workout.
- **Customizable Exercises**: Users can select different exercises to match their fitness level.

## Tech Stack

- **Frontend**: ReactJS
- **Backend**: Flask
- **AI/Exercise Detection**: OpenCV
- **UI/UX Design**: Adobe XD / Figma

## How It Works

1. **Setup Your Webcam**: FITRIS requires access to your webcam to detect your movements.
2. **Play Tetris**: Your movements control the Tetris blocks. For example, squats may rotate a block.
4. **Stay Fit**: The game tracks your performance, offering a fun and interactive way to stay active.

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/fitris.git
    cd fitris
    ```

2. Install the dependencies for the backend:

    ```bash
    pip install -r requirements.txt
    ```

3. Install the frontend dependencies:

    ```bash
    cd frontend
    npm install
    ```

4. Start the Flask backend:

    ```bash
    cd ..
    python app.py
    ```

5. Start the React frontend:

    ```bash
    cd frontend
    npm start
    ```

6. Open your browser and go to `http://localhost:3000`.

## Usage

- Ensure your webcam is connected and allowed in the browser.
- Select the exercises you want to perform.
- Play the game while performing the chosen exercises. Each movement controls a different part of the Tetris gameplay.

