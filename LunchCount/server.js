const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const { Console } = require('console');
var codeSchoolMap = new Map();
var temp = new Map();
var schoolDataMap = new Map();
var schoolID = "";
var adminSchoolMap = loadAdminMap(temp);
var validLog = false;
var isValidLogin = false;
const fs = require('fs').promises;

loadCodeMap(codeSchoolMap);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Create a 'views' directory in your project

app.use(bodyParser.json()); // Parse JSON bodies
var userSchoolData = new Map();
// Load schoolDataMap from the JSON file
async function loadSchoolDataFromFile() {
    const filePath = path.join(__dirname, 'schoolData.json'); // Adjust the file path as needed

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(fileContent);

        // Assuming parsedData is an array of key-value pairs
        schoolDataMap = new Map(parsedData);

        console.log('School data loaded from file successfully.');
    } catch (error) {
        console.error('Error loading school data from file:', error);
    }
}

// Call the function to load schoolDataMap when the server starts
loadSchoolDataFromFile();


app.use(session({
    secret: 'your-secret-key', // Change this to a secure secret
    resave: false,
    saveUninitialized: true,
}));
// Middleware to check if the user is authenticated
const isAuthenticatedUser = (req, res, next) => {
    // Check if the user is authenticated based on your logic
    // For example, you can check if the user has a valid session or token

    // Assuming you have a variable to store authentication status, modify this based on your authentication mechanism
    const isAuthenticatedUser = req.session.isValidLogin;

    if (isAuthenticatedUser) {
        // User is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to the login page or send an unauthorized response
        res.redirect('/'); // Change this to the login page route or handle it as needed
    }
};
// Middleware to check if the user is authenticated
const isAuthenticatedAdmin = (req, res, next) => {
    // Check if the user is authenticated based on your logic
    // For example, you can check if the user has a valid session or token

    // Assuming you have a variable to store authentication status, modify this based on your authentication mechanism
    const isAuthenticatedUser = req.session.validLog;

    if (isAuthenticatedUser) {
        // User is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to the login page or send an unauthorized response
        res.redirect('/adminLog'); // Change this to the login page route or handle it as needed
    }
};
// Serve static files (HTML, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
        res.render('login');
    });
    

// Handle login POST request
app.post('/login', (req, res) => {
    var { username, code } = req.body;
    req.session.schoolID = getUsernameSuffix(username.toString())
    // Check if the provided credentials match any verified user
    req.session.isValidLogin = codeSchoolMap.has(code) && req.session.schoolID === codeSchoolMap.get(code);
 // Set userSchoolData based on schoolID
 req.session.userSchoolData = schoolDataMap.get(req.session.schoolID);
 // Check if userSchoolData is defined before sending the result back to the client
 
 if (userSchoolData) {

     res.json({ success: req.session.isValidLogin });
 } else {
     // Handle the case when userSchoolData is undefined
     res.status(404).send('User data not found');
 }
});



    app.get('/main', isAuthenticatedUser,  (req, res) => {

        var schoolOptions = req.session.userSchoolData;

        // Assuming your schoolOptions structure contains an array of option sets
        res.render('main', { optionSets: schoolOptions });
    });
    
    app.get('/adminLog', (req, res) => {
        res.render('adminLog', {
        });
    });
    app.get('/adminMain', isAuthenticatedAdmin, (req, res) => {
        res.render('adminMain', {
        });
    });
    app.post('/adminLog', (req, res) => {
        var { username } = req.body;
        req.session.schoolID = getUsernameSuffix(username.toString());
        // Check if the provided credentials match any verified user
        if(adminSchoolMap.has(req.session.schoolID)) {
            req.session.validLog = adminSchoolMap.get(req.session.schoolID).has(username);
        }
         res.json({ success: req.session.validLog });
     
    });
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/data'); // Set the destination folder
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    },
});

const upload = multer({ storage: storage });

// Your existing route
app.post('/addItem', isAuthenticatedAdmin, (req, res) => {
    const { itemQuantity, itemType, itemNames, itemImages} = req.body;
    console.log('adadad')

    console.log(itemType)
    console.log(itemNames)
    console.log(itemQuantity)

    const itemPaths = [];

    // Validate inputs as needed
// Handle image uploads
itemImages.forEach((base64Image, index) => {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Save the buffer to a file (you can use a unique name or other logic)
    const imagePath = `public/data/itemImage_${index + 1}.png`;

    // Write the buffer to the file
    fs.writeFileSync(imagePath, imageBuffer);

    itemPaths.push(imagePath);
});


    // Save the updated data to the JSON file (optional)
    // saveDataToFile();

    res.json({ success: true, message: 'Items added successfully.', itemPaths });
});
    // Add this route to handle the request to add items

function loadAdminMap(tempMap) {
    var osuAdmin = new Set();
    osuAdmin.add("nicotine@osu.edu");
    osuAdmin.add("frank@osu.edu")
    tempMap.set('@osu.edu', osuAdmin);
return tempMap;
}
function loadCodeMap(tempMap) {
    tempMap.set('1234', '@osu.edu');
    tempMap.set('2345', '@kent.edu');
return tempMap;
}



function getUsernameSuffix(username) {
    const lastAtIndex = username.lastIndexOf('@');
    return lastAtIndex !== -1 ? username.substring(lastAtIndex) : '';
}
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


