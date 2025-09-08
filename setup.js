import axios from 'axios';
import fs from 'fs';

const registrationDetails = {
    email: "snehaprajapati3110@gmail.com",
    name: "Sneha Prajapati",
    mobileNo: "9555401345",
    githubUsername: "Sneha-3110",
    rollNo: "2201640100293", 
    accessCode: "sAWTuR" 
};

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

async function performSetup() {
    try {
        console.log("Attempting to register...");
        const registerResponse = await axios.post(`${API_BASE_URL}/register`, registrationDetails);
        const { clientID, clientSecret } = registerResponse.data;

        if (!clientID || !clientSecret) {
            throw new Error("Registration failed. ClientID or ClientSecret not received.");
        }

        console.log("Registration Successful!");
        console.log("ClientID:", clientID);
        console.log(" ClientSecret:", clientSecret);
        console.log("\nIMPORTANT: Save your ClientID and ClientSecret securely. You cannot retrieve them again.\n");

        console.log("Attempting to get an Authorization Token...");
        const authPayload = { ...registrationDetails, clientID, clientSecret };
        const authResponse = await axios.post(`${API_BASE_URL}/auth`, authPayload);
        const { access_token } = authResponse.data;

        if (!access_token) {
            throw new Error("Authentication failed. Access Token not received.");
        }

        console.log("Authentication Successful!");
        console.log("Access Token:", access_token);

        const credentials = {
            clientID,
            clientSecret,
            accessToken: access_token
        };
        fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 2));
        console.log("\nCredentials saved to credentials.json file.");

    } catch (error) {
        console.error("An error occurred during setup:");
        console.error(error.response ? error.response.data : error.message);
    }
}

performSetup();