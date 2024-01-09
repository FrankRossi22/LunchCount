document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('addItemBtn').addEventListener('click', function () {
        document.getElementById('addItemForm').style.display = 'block';
    });

    document.getElementById('itemQuantity').addEventListener('input', function () {
        var itemQuantity = parseInt(document.getElementById('itemQuantity').value, 10);
        var itemNamesContainer = document.getElementById('itemNamesContainer');
        itemNamesContainer.innerHTML = ''; // Clear previous content

        for (var i = 1; i <= itemQuantity; i++) {
            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Enter name for Item ' + i;
            input.name = 'itemName' + i;

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = 'itemImage' + i;
            fileInput.accept = 'image/*';
            fileInput.multiple = true;

            itemNamesContainer.appendChild(input);
            itemNamesContainer.appendChild(fileInput);
        }
    });

    document.getElementById('submitItemBtn').addEventListener('click', function () {
        var type = document.getElementById('itemType').value;
        var quantity = document.getElementById('itemQuantity').value;

        // Validate inputs as needed
        if (!type || !quantity) {
            alert('Please fill out all required fields.');
            return;
        }

        var names = [];
        var images = [];

        for (var i = 1; i <= quantity; i++) {
            var itemName = document.getElementsByName('itemName' + i)[0].value;
            if (!itemName) {
                alert('Please fill out all item names.');
                return;
            }
            names[i - 1] = itemName;

            var imageInput = document.getElementsByName('itemImage' + i)[0];
            images.push(...imageInput.files);
        }

        var data = {
            itemQuantity: quantity,
            itemType: type,
            itemNames: names,
            itemImages: images
        };


        fetch('/addItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error adding items:', error);
        });

        // Hide the form after submission
        document.getElementById('addItemForm').style.display = 'none';
    });
});