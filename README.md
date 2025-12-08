# 🍽️ Leftover Magic - Transform Your Ingredients into Delicious Recipes

<div align="center">
  <img src="https://github.com/user-attachments/assets/fff29c0a-ee6c-41ed-ac3c-3d11454afff0" alt="Leftover Magic Hero" width="800">
</div>

## 🌟 Overview

**Leftover Magic** is an innovative web application that helps you transform your leftover ingredients into delicious, creative meals. Powered by AI, this platform reduces food waste, saves money, and creates amazing culinary experiences from what you already have in your kitchen.

### 🎯 Mission
Turn food waste into food wonder! Every recipe helps reduce your environmental footprint while maximizing your grocery budget.

## ✨ Key Features

### 🤖 AI Recipe Generation
- **OpenAI-Powered**: Uses GPT-4o-mini to create unique recipes from your leftover ingredients
- **Customizable Parameters**: Set difficulty level, prep time, and dietary restrictions
- **Smart Suggestions**: Get personalized recipe recommendations based on your preferences
- **Save & Share**: Keep your favorite AI-generated recipes for future use

<div align="center">
  <img src="https://github.com/user-attachments/assets/f0909d37-abaf-4fad-b552-2592fbdba123" alt="AI Recipe Generator" width="600">
</div>

### 🥘 Smart Pantry Management
- **Expiry Tracking**: Never let food expire again with intelligent notifications
- **Inventory Management**: Keep track of all your ingredients with quantities
- **Visual Alerts**: Color-coded warnings for items approaching expiration
- **Recipe Suggestions**: Get recipe recommendations based on expiring ingredients

### 📅 AI-Powered Meal Planning
- **Weekly Planning**: Generate complete meal plans for the entire week
- **Pantry Integration**: Plans are based on your available ingredients
- **Breakfast, Lunch & Dinner**: Complete meal coverage for all occasions
- **Save Recipes**: Easily save planned meals to your personal collection

### 🎮 Gamification & Impact Tracking
- **Food Saver Points**: Earn points for every recipe you use
- **Level System**: Advance through levels as you reduce food waste
- **Achievements**: Unlock badges for reaching sustainability milestones
- **Environmental Impact**: Track CO₂ savings and money saved over time
- **Statistics Dashboard**: View your impact with beautiful visualizations

<div align="center">
  <img src="https://github.com/user-attachments/assets/9024e809-0b17-4e09-b66b-93bc51691bc9" alt="Features Section" width="600">
</div>

### 🔍 Recipe Discovery
- **Curated Database**: Browse hundreds of leftover-focused recipes
- **Advanced Search**: Filter by ingredients, difficulty, prep time, and more
- **Community Recipes**: Discover creations from fellow home cooks
- **Personal Collections**: Save and organize your favorite recipes

### 👤 User Management
- **Secure Authentication**: Powered by Supabase Auth
- **Personal Profiles**: Track your cooking journey and achievements
- **Recipe Collections**: Build your personal recipe library
- **Progress Tracking**: Monitor your sustainability impact over time

## 🛠️ Technology Stack

### Frontend
- **React 18.3+** with TypeScript for type-safe development
- **Vite** for lightning-fast build times and development
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** for beautiful, accessible UI components
- **React Router DOM** for seamless navigation
- **TanStack React Query** for efficient data fetching and caching

### Backend & Services
- **Supabase** for database, authentication, and edge functions
- **PostgreSQL** with Row Level Security (RLS) for data protection
- **OpenAI GPT-4o-mini** for AI-powered recipe generation
- **Supabase Edge Functions** for serverless API endpoints

### Key Dependencies
- **Form Handling**: React Hook Form with Zod validation
- **Date Management**: date-fns for date utilities
- **Icons**: Lucide React for beautiful iconography
- **Charts**: Recharts for data visualization
- **UI Enhancements**: Various Radix UI components

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ and npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **Supabase Account** for database and authentication
- **OpenAI API Key** for AI recipe generation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mwakidenis/reinvent-your-leftovers.git
   cd reinvent-your-leftovers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Setup**
   - Create a new Supabase project
   - Run the migration files in `/supabase/migrations/` to set up the database schema
   - Set up the OpenAI API key in your Supabase project settings for the edge function

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

### Building for Production
```bash
npm run build
```

### Linting & Code Quality
```bash
npm run lint
```

## 📊 Database Schema

The application uses a well-structured PostgreSQL database with the following key tables:

- **`profiles`** - User profiles and settings
- **`recipes`** - Recipe database with ingredients and instructions
- **`user_ingredients`** - Smart pantry tracking with expiry dates
- **`saved_recipes`** - User's saved recipe collections

All tables implement Row Level Security (RLS) for data protection.

## 🌱 Environmental Impact

### Our Mission
- **Reduce Food Waste**: Average household reduces food waste by 50%
- **Save Money**: Users save an average of $3.50 per recipe
- **Lower Carbon Footprint**: Each recipe prevents ~0.8kg of CO₂ emissions
- **Community Impact**: Join 10k+ happy cooks making a difference

### Sustainability Features
- **Expiry Notifications**: Prevent food from going bad
- **Creative Recipes**: Transform "waste" into delicious meals
- **Impact Tracking**: Visualize your environmental contribution
- **Educational Content**: Learn about sustainable cooking practices

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines
- Follow the existing code style and patterns
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📱 Deployment

The application can be deployed on various platforms:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Deploy with continuous integration
- **Supabase Hosting**: Use Supabase's built-in hosting features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenAI** for powerful AI recipe generation
- **Supabase** for excellent backend services
- **shadcn/ui** for beautiful UI components
- **Unsplash** for gorgeous food photography
- **The Community** of developers fighting food waste

---

<div align="center">
  <strong>🍽️ Transform your leftovers, transform the world! 🌍</strong>
  **Made with ❤️  for sustainable cooking 🥕 🌶️ by Mwaki Denis**
**Appreciating**
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%F0%9F%8D%B5-yellow?style=plastic)](https://wa.me/254798750585)
  
</div>
