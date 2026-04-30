# Mia - AI-Powered E-Commerce Shopping Assistant

A modern, fully functional e-commerce platform integrated with **Llama 3**, featuring a smart shopping assistant that understands natural language, searches products, tracks orders, and manages cancellations.

GitHub Repo - https://github.com/sheda3838/ecommerce-chatbot.git

---

## Project Overview
This project demonstrates the power of local LLMs in e-commerce. **Mia**, the AI assistant, doesn't just respond to queries; she actively helps users find products based on their budget, style, and occasion, manages their cart, and provides real-time order support—all through a seamless chat interface.

## Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (Persistent & Lightweight) |
| **AI Engine** | Llama 3.2 3B (via Ollama) |
| **State Management** | React Context API |

---

## Key Features

### AI Shopping Assistant (Mia)
- **Natural Language Search:** Mia extracts categories, colors, budget ranges, and styles to query the database automatically.
- **Dynamic Suggestions:** Mia anticipates user needs by suggesting next actions (e.g., "Check stock", "Reorder item").
- **Order Management:** Secure order lookups linked to user accounts.
- **Stock Awareness:** Real-time checking of product availability.
- **Contextual Memory:** Remembers conversation history within a session.

### User System & Security
- **Unified Auth:** Comprehensive Signup/Login flow for customers and admins.
- **Account Dashboard:** Users can track their order history and manage cancellations.
- **Session Persistence:** Secure user sessions stored in localStorage.

### E-Commerce Functionality
- **Dynamic Shop:** Filter and browse products by category and price.
- **Product Details:** Dedicated pages for deep-dives into product specs.
- **Persistent Cart:** Items stay in your cart even after a page refresh.
- **Full Checkout Flow:** Demo-mode checkout with order number generation.

### Admin Dashboard
- **Live Stats:** Real-time revenue, order counts, and product analytics.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) for the catalog.
- **Order Control:** Manage order statuses (Pending, Shipped, Delivered).
- **Conversation Logs:** Grouped chat histories to monitor AI-customer interactions.

---

## Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Ollama** installed from [ollama.com](https://ollama.com)

### 2. Prepare the AI
1. Install Ollama and pull the Llama 3.2 3B model:
```bash
ollama pull llama3.2:3b
```
2. **IMPORTANT:** Start the Ollama server in a separate terminal:
```bash
ollama serve
```

## Note on AI Setup
Make sure the Ollama service is active. If the AI doesn't respond, ensure `ollama serve` is running and accessible at `http://localhost:11434`.

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The server will run on `http://localhost:3000` and automatically initialize the database.*

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The website will be available at `http://localhost:5173`*

---

## Admin & User Access
To access the administrative dashboard or user account:
1. Navigate to the **Sign In** page.
2. Use the credentials below to access the Admin Dashboard.
3. **Admin Credentials:**
   - **Email:** `admin@gmail.com`
   - **Password:** `admin123`
4. **Test User:** You can create your own account via the **Sign Up** page.

---

## Project Structure
```text
ecommerce-chatbot/
├── backend/
│   ├── db/            # SQLite configuration and init scripts
│   ├── routes/        # API endpoints (Products, Orders, Chat, Admin)
│   ├── services/      # AI logic and Prompt engineering
│   └── server.js      # Main Express entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI & Page components
│   │   ├── context/    # Cart and Session state
│   │   └── App.jsx     # Routing and Layout
│   └── tailwind.config.js
└── README.md
```

---

## How the AI Works
The system uses **Intent-Based Tagging** to bridge the gap between LLM text and Database actions:
- **`[SEARCH]`**: Triggered when Mia has enough info to find products.
- **`[ORDER_LOOKUP]`**: Securely fetches order history for the logged-in user.
- **`[STOCK_CHECK]`**: Triggered when availability questions are asked.
- **`[SUGGESTIONS]`**: Generates 2-3 logical next steps to guide the user.

**Fallback Logic:** If no exact matches are found for a search, the system intelligently relaxes filters (e.g., ignoring style or color) to suggest the closest alternative products, ensuring the customer never sees a dead-end.

The backend parses these tags, executes SQL queries, and returns structured data which the frontend then renders as interactive cards.

---

## Future Improvements
- **Image Generation:** Integrate AI to generate product mockups on the fly.
- **Payment Integration:** Replace demo mode with Stripe/PayPal.
- **Advanced Analytics:** Heatmaps for product clicks within the chat.

---

## Screenshots
[Home Page](./images/home_page.png)
[Chat Interface](./images/chat_interface.png)
[Admin Dashboard](./images/admin_dashboard.png)

---
