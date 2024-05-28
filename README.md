# Solana Voting System

## Overview

The Solana Voting System is a web application that allows users to create voting topics and participate in the voting process. Once the voting period ends, the winning option is displayed.

### Project Link

[Solana Voting System](https://solana-voting-system.vercel.app/)

## Features

- Create and manage voting topics.
- Participate in voting for various options.
- Display winning options after the voting period ends.

## Screenshots

### Home Page

![Home Page](https://github.com/School-of-Solana/solana-program-edward821220/assets/105776097/e7c55354-5d97-49d4-9fbd-7dcec2ac6737)

- Displays a list of created voting topics.
- Shows "Ended" below topics whose voting period has ended.
- Includes "Airdrop" and "Create Vote" buttons for users to interact with.

### Create Vote Modal

![Create Vote Modal](https://github.com/School-of-Solana/solana-program-edward821220/assets/105776097/206f7ff0-63b4-42c6-a718-5d085aac68e4)

- Modal form that appears upon clicking the "Create Vote" button.
- Users can input the voting topic, options (up to 20), and the duration of the voting period in seconds.
- After submission, a new voting topic is added upon transaction completion.

### Voting Information Modal (Active Voting)

![Voting Information Modal (Active Voting)](https://github.com/School-of-Solana/solana-program-edward821220/assets/105776097/772ab421-b5b0-4c28-b806-eefed90dd237)

- Displays information about a specific voting topic upon clicking its button.
- Shows available options and current vote counts.
- Users can vote by clicking the "Vote" button next to their desired option.

### Voting Information Modal (Ended Voting)

![Voting Information Modal (Ended Voting)](https://github.com/School-of-Solana/solana-program-edward821220/assets/105776097/29909b0b-7707-485d-af62-8ce5e03c20f1)

- Displays voting information for a topic whose voting period has ended.
- Includes a crown icon next to the winning option.

## Usage

1. Visit the provided [Solana Voting System](https://solana-voting-system.vercel.app/) link.
2. Explore existing voting topics on the home page.
3. Click "Create Vote" to create a new voting topic and follow the modal instructions.
4. Participate in active voting by clicking on the respective voting topic and selecting an option.
5. View the results after the voting period ends.

## Notes

- This project is deployed on Solana Devnet.
- Users can utilize the "Airdrop" button if their wallet is empty.
