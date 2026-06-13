# Culina

Culina is a simple recipe recommender web application built with React and Vite.
The application helps you find recipes based on the ingredients you have in your kitchen.

## Features

- **Add Ingredients**: Type in the ingredients you currently have on hand and add them to a list.
- **Generate Recipes**: Once you have added at least four ingredients, you can ask the AI to suggest a recipe.
- **AI Recommendation**: The app uses AI models (like Claude from Anthropic or Mistral from Hugging Face) to generate a personalized recipe from your ingredients.
- **Markdown Rendering**: Recipes are formatted and displayed clearly using markdown.
- **Smooth Auto-Scroll**: When a recipe is ready, the page automatically and smoothly scrolls down to show it.

## How to Set Up and Run the Project

1. **Install Dependencies**:
   Install all the packages required by the application. Run this command in your terminal:
   ```bash
   npm install
   ```

2. **Configure API Keys**:
   The application requires API keys to communicate with the AI services. You must set these in your environment variables:
   - `ANTHROPIC_API_KEY`: Used to fetch recipes from Chef Claude.
   - `HF_ACCESS_TOKEN`: Used to fetch recipes from Mistral.

3. **Start the Development Server**:
   Run the following command to start the app locally:
   ```bash
   npm run dev
   ```
   Or:
   ```bash
   npm start
   ```

4. **Build for Production**:
   To create a production-ready build, run:
   ```bash
   npm run build
   ```

5. **Preview the Production Build**:
   To preview your production build locally, run:
   ```bash
   npm run preview
   ```

## Technologies Used

- **React**: For building the user interface.
- **Vite**: For fast project building and local development.
- **React Markdown**: For rendering the markdown response from the AI.
- **Anthropic SDK**: For sending prompts to the Claude AI model.
- **Hugging Face Inference SDK**: For sending prompts to the Mistral AI model.
