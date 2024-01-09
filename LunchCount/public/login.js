document.addEventListener("DOMContentLoaded", function() {


    function login() {
          // Get the values from the input fields
          var usernameInput = "";
          usernameInput = document.getElementById('username').value;
          var codeInput = document.getElementById('code').value;

          // Create a data object to send to the server
          var data = {
              username: usernameInput,
              code: codeInput

          };

          // Send a POST request to the server with the login data
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            // Check the result from the server and redirect if needed
            if (result.success) {
                window.location.href = '/main';
            } else {
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    
 

    

  
// Add event listener to the submit button
    var loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }
    
})
