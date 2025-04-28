document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.dot');
    const keys = document.querySelectorAll('.key:not(.delete)');
    const deleteButton = document.querySelector('.key.delete');
    const submitButton = document.querySelector('.submit-btn');
    let passcode = '';
    const maxLength = 4;

    // Handle number key presses
    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (passcode.length < maxLength) {
                passcode += key.textContent;
                updateDots();
                updateSubmitButton();
            }
        });
    });

    // Handle delete button
    deleteButton.addEventListener('click', () => {
        if (passcode.length > 0) {
            passcode = passcode.slice(0, -1);
            updateDots();
            updateSubmitButton();
        }
    });

    // Update the dots to show filled/unfilled state
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < passcode.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    // Update submit button state
    function updateSubmitButton() {
        submitButton.disabled = passcode.length !== maxLength;
    }

    // Handle submit button click
    submitButton.addEventListener('click', async () => {
        if (passcode.length === maxLength) {
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';

                const response = await fetch('http://localhost:3000/api/passcode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ passcode }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to submit passcode');
                }

                // Show success message
                alert('Passcode submitted successfully!');
                
                // Reset the interface
                passcode = '';
                updateDots();
                updateSubmitButton();
                submitButton.textContent = 'Submit';
            } catch (error) {
                console.error('Error:', error);
                alert('Error submitting passcode: ' + error.message);
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            }
        }
    });
}); 