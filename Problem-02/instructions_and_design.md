# Currency Swap Form: Design and Setup Instructions

## Overview
This document outlines the design, planning, and step-by-step instructions for implementing a modern currency swap form application. The application will provide a user interface for swapping currencies with integrated token icons, live pricing data, and form validations.

## Project Initialization and Setup
1. Initialize the project using Vite with React and TypeScript.
   - Use Yarn as the package manager.
   - Command: `yarn create vite` (select the React + TS template)
2. Install necessary dependencies:
   - Material-UI (MUI) for UI components.
   - Tanstack Query for data fetching.
   - Zustand for state management (if needed).
   - Additional packages such as axios for HTTP requests if required.

## UI and Design Requirements
1. **Modern UI with Dark Mode:**
   - Implement dark mode using MUI theming. Allow users to switch themes if needed.
   - Employ a modern, responsive, and accessible design.
2. **Form Layout and Features:**
   - Create a currency swap form with:
     - An input field labeled "Amount to send".
     - An input field labeled "Amount to receive".
     - A submit button labeled "CONFIRM SWAP".
   - Integrate input validation that checks for valid numerical input and displays error messages.
   - Provide a loading indicator on submission by simulating a backend delay.
3. **Token Icon Integration:**
   - Use token icons from the repository available at:
     [Switcheo Token Icons](https://github.com/Switcheo/token-icons/tree/main/tokens)
   - For example, use the SVG icon from [SWTH](https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg).
4. **Price Information:**
   - Fetch token price data from [Token Prices](https://interview.switcheo.com/prices.json).
   - Compute exchange rates based on the retrieved data.
   - Omit tokens that do not have associated price data.
5. **Testing and Documentation:**
   - Write unit tests using Jest and React Testing Library to verify form functionality, input validations, and data fetching.
   - Document component design, state management, and testing procedures.
   - Ensure comprehensive project documentation via inline comments and an updated README.

## Execution and Deployment
1. **Development:**
   - Follow best practices for React, TypeScript, and modern frontend development.
   - Optimize component structure and promote code reusability.
2. **Testing:**
   - Write tests targeting the currency swap form component and its sub-components.
   - Validate user interactions, mocking data fetching as needed.
3. **Documentation:**
   - Update the README file with setup instructions, running guidelines, and testing procedures.
4. **Project Structure:**
   - Organize files logically:
     - src/
       - components/
       - hooks/
       - styles/
       - tests/
     - public/
   - Maintain clean code practices and modular design.

## Summary
The project must:
- Be properly initialized using Yarn, Vite, React, and TypeScript.
- Feature a modern UI with dark mode.
- Integrate token icons from the provided GitHub repository.
- Fetch live token price data from the specified URL.
- Include comprehensive unit tests.
- Be well-documented.

Ensure all aspects of these instructions are followed precisely to deliver an intuitive, attractive, and fully functional currency swap form application.