from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def validate_input(data):
    errors = []
    
    if not data.get('destination'):
        errors.append('Destination is required')
    
    try:
        budget = float(data.get('budget', 0))
        if budget <= 0:
            errors.append('Budget must be greater than 0')
    except ValueError:
        errors.append('Invalid budget value')
    
    try:
        duration = int(data.get('duration', 0))
        if duration < 1 or duration > 30:
            errors.append('Duration must be between 1 and 30 days')
    except ValueError:
        errors.append('Invalid duration value')
    
    if not data.get('interests'):
        errors.append('Interests are required')
    
    return errors

def generate_travel_prompt(destination, budget, duration, interests):
    prompt = f"""Act as an experienced travel advisor creating a detailed itinerary. 
    Please create a comprehensive travel plan for the following parameters:
    
    Destination: {destination}
    Duration: {duration} days
    Budget: ${budget} USD
    Traveler Interests: {interests}

    Format your response using the following markdown structure:
    
    # Trip Overview
    [Brief overview of the destination and what makes it special for the traveler's interests]

    ## Accommodation Recommendations
    - List of recommended hotels/accommodations within budget
    - Include estimated costs per night
    - Mention the best areas to stay based on interests

    ## Daily Itinerary
    [For each day, use the following structure:]

    ### Day X
    - **Morning**: [Activity] - $[cost]
    - **Afternoon**: [Activity] - $[cost]
    - **Evening**: [Activity/Restaurant] - $[cost]
    
    ## Restaurant Recommendations
    - List top restaurant recommendations with price ranges
    - Include local specialties and must-try dishes

    ## Local Tips and Customs
    - Important cultural considerations
    - Local customs to be aware of
    - Transportation tips
    - Money-saving advice

    ## Cost Breakdown
    - Accommodation: $X
    - Activities: $X
    - Food and Dining: $X
    - Transportation: $X
    - Miscellaneous: $X
    
    Please ensure:
    1. All recommendations stay within the total budget of ${budget} USD
    2. Activities match the traveler's interests
    3. Each cost is clearly listed
    4. Use markdown formatting consistently
    5. Highlight important information with **bold text**
    6. Use bullet points for lists
    7. Include specific details and local insights"""

    return prompt

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-itinerary', methods=['POST'])
def generate_itinerary():
    try:
        data = request.json
        
        # Validate inputs
        validation_errors = validate_input(data)
        if validation_errors:
            return jsonify({
                'error': 'Validation failed: ' + '; '.join(validation_errors),
                'success': False
            }), 400

        destination = data.get('destination')
        budget = float(data.get('budget'))
        duration = int(data.get('duration'))
        interests = data.get('interests')

        # Generate prompt and get response from Gemini
        prompt = generate_travel_prompt(destination, budget, duration, interests)
        response = model.generate_content(prompt)

        if not response.text:
            raise Exception("Failed to generate itinerary content")

        # Return the generated itinerary
        return jsonify({
            'itinerary': response.text,
            'success': True
        })

    except Exception as e:
        app.logger.error(f"Error generating itinerary: {str(e)}")
        return jsonify({
            'error': f"An error occurred: {str(e)}",
            'success': False
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 