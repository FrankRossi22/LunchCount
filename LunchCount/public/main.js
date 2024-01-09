document.addEventListener("DOMContentLoaded", function() {
    var datasets = ['optionsSet1', 'optionsSet2']; // Define the order of datasets
    var currentDatasetIndex = 0;
    var selectedOptions = {}; // Store selected options for each dataset
 	
    showOptions(datasets[currentDatasetIndex]);

    function showOptions(dataset) {
        // Hide all option sets
        var loginContainer = document.getElementById('loginContainer');
        var allOptionSets = document.querySelectorAll('.options-container');
        var button = document.getElementById('submitButton');
        button.style.display = 'initial'

        
        allOptionSets.forEach(function(optionSet) {
            optionSet.style.display = 'none';})
        

        // Show the selected option set
        var selectedOptionSet = document.getElementById(dataset);
        if (selectedOptionSet) {
            selectedOptionSet.style.display = 'initial';
        }
    } 
    function hideAll(dataset) {
        // Hide all option sets
        var allOptionSets = document.querySelectorAll('.options-container');
        allOptionSets.forEach(function(optionSet) {
            optionSet.style.display = 'none';
        });
        // Hide the submit button
        var submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    }

    function submitOptions() {
        var selectedDataset = datasets[currentDatasetIndex];
        var selectedOption = document.querySelector('input[name="optionSet' + (currentDatasetIndex + 1) + '"]:checked');

        if (selectedOption) {
            selectedOptions[selectedDataset] = selectedOption.value;

            // Move to the next dataset
            currentDatasetIndex++;
            if (currentDatasetIndex < datasets.length) {

                showOptions(datasets[currentDatasetIndex]);
            } else {
                alert("You have completed all datasets.");
                hideAll(datasets[currentDatasetIndex])
                displaySelectedOptions();
                // Optionally, you can reset the form or perform other actions here
            }
        } else {
            alert("Please select one option from the current set before submitting.");
        }
    }

    function displaySelectedOptions() {
        var selectedOptionContainer = document.getElementById('selectedOptionContainer');
        if (selectedOptionContainer) {
            var result = "Selected options: ";
            for (var dataset in selectedOptions) {
                result += `- ${selectedOptions[dataset]} - `;
            }

            var selectedOptionDiv = document.createElement('div');
            selectedOptionDiv.innerHTML = result;

            // Append the new content to the container
            selectedOptionContainer.appendChild(selectedOptionDiv);
        }
    }

    // Add event listener to the submit button
    var submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', submitOptions);
    }
})

