## en route
# AI Travel Itinerary Generator

A Flask-based web application that generates personalized travel itineraries using Google's Gemini AI. The application takes user inputs such as destination, budget, duration, and interests to create comprehensive travel plans with detailed daily activities, accommodation recommendations, and cost breakdowns.

## Features

- **Personalized Itinerary Generation**: Creates custom travel plans based on user preferences
- **Budget-Conscious Planning**: Ensures all recommendations stay within specified budget
- **Comprehensive Output**: Includes:
  - Trip overview
  - Accommodation recommendations
  - Daily itinerary with activities
  - Restaurant recommendations
  - Local tips and customs
  - Detailed cost breakdown
- **Input Validation**: Ensures all required fields are properly filled
- **Responsive API**: RESTful endpoint for itinerary generation
- **CORS Enabled**: Supports cross-origin requests

## Technologies Used

- **Backend**: Python, Flask
- **AI Integration**: Google Gemini Pro API
- **Additional Libraries**: 
  - `flask-cors`
  - `python-dotenv`
  - `google.generativeai`

## Prerequisites

Before running this application, make sure you have:

- Python 3.7 or higher installed
- A Google Gemini API key
- pip (Python package manager)

## Installation

1. Clone the repository

2. Install required dependencies

3. Add your Gemini API key

4. Start the Flask server

