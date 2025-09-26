# **App Name**: Web3 Disperser

## Core Features:

- Wallet Connection: Connect to a Web3 wallet using ReownKit and display the wallet address and balance.
- Fund Dispersal Form: A form to input recipient wallet address and amount (ETH/USDC). Calls a Firebase Function to send funds.
- Send Funds: Sends funds to the recipient by calling a backend API endpoint. Generative AI will be used as a tool, to monitor transactions and alert of potential risks before calling the function.
- Transaction History: A table displaying recent transactions, including recipient, amount, timestamp, and transaction hash. Initially populated with dummy data, and later fetched from a Firebase Function.

## Style Guidelines:

- Primary color: Saturated blue (#29ABE2) reflecting the reliability of blockchain transactions.
- Background color: Light blue (#E1F5FE), a desaturated version of the primary, providing a clean and professional feel.
- Accent color: Yellow (#FFD700), analogous to blue and offering contrast for CTAs.
- Font: 'Inter', a grotesque-style sans-serif. To be used for both headlines and body text.
- Use simple, line-based icons for clarity and a modern feel.
- Responsive layout using TailwindCSS grid and flexbox for optimal viewing on different devices.
- Subtle loading animations and transitions to enhance the user experience during wallet connection and fund dispersal.