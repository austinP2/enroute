document.addEventListener('DOMContentLoaded', () => {
    const travelForm = document.getElementById('travelForm');
    const itineraryContent = document.querySelector('.itinerary-content');
    const submitButton = document.querySelector('.submit-btn');

    // Input validation functions
    const validateInputs = (formData) => {
        const errors = [];
        
        if (!formData.destination.trim()) {
            errors.push('Destination is required');
        }
        
        if (isNaN(formData.budget) || formData.budget <= 0) {
            errors.push('Please enter a valid budget amount');
        }
        
        if (isNaN(formData.duration) || formData.duration < 1 || formData.duration > 30) {
            errors.push('Duration must be between 1 and 30 days');
        }
        
        if (!formData.interests.trim()) {
            errors.push('Please enter your interests');
        }
        
        return errors;
    };

    const setLoadingState = (loading) => {
        submitButton.disabled = loading;
        if (loading) {
            submitButton.innerHTML = '<span class="loading-spinner"></span>Creating...';
            itineraryContent.innerHTML = '<p class="loading-text">Creating your personalized itinerary...</p>';
        } else {
            submitButton.textContent = 'Create Itinerary';
        }
    };

    const displayError = (message) => {
        itineraryContent.innerHTML = `<p class="error-text">${message}</p>`;
    };

    // Function to parse and format markdown text
    const formatMarkdown = (text) => {
        return text
            // Convert headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            
            // Convert bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            
            // Convert bullet points
            .replace(/^\s*[-*]\s(.*)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)\n/g, '<ul>$1</ul>')
            
            // Convert line breaks
            .replace(/\n/g, '<br>')
            
            // Clean up multiple breaks
            .replace(/<br><br>/g, '<br>')
            .replace(/<\/ul><br><ul>/g, '</ul><ul>')
            
            // Add section styling
            .replace(/<h2>/g, '<h2 class="itinerary-section">')
            .replace(/<h3>/g, '<h3 class="itinerary-subsection">');
    };

    travelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            destination: document.getElementById('destination').value,
            budget: parseFloat(document.getElementById('budget').value),
            duration: parseInt(document.getElementById('duration').value),
            interests: document.getElementById('interests').value
        };

        // Validate inputs
        const errors = validateInputs(formData);
        if (errors.length > 0) {
            displayError(errors.join('<br>'));
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            const response = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }

            const data = await response.json();

            if (data.success) {
                // Format and display the itinerary with markdown parsing
                const formattedItinerary = formatMarkdown(data.itinerary);
                itineraryContent.innerHTML = `
                    <div class="itinerary-text">
                        <div class="itinerary-header">
                            <h2>Trip to ${formData.destination}</h2>
                            <div class="itinerary-meta">
                                <span class="meta-item">Duration: ${formData.duration} days</span>
                                <span class="meta-item">Budget: $${formData.budget}</span>
                            </div>
                        </div>
                        <div class="itinerary-content-inner">
                            ${formattedItinerary}
                        </div>
                    </div>`;
            } else {
                displayError(data.error || 'Failed to create itinerary');
            }
        } catch (error) {
            console.error('Error:', error);
            displayError('Failed to create itinerary. Please try again later.');
        } finally {
            setLoadingState(false);
        }
    });

    // Add input validation feedback
    const inputs = travelForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.style.borderColor = '#2ecc71';
            } else {
                input.style.borderColor = '#e74c3c';
            }
        });
    });
}); 