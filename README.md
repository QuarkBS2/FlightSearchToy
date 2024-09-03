# Flight Search App

This project is based on Spring boot, React-Typescript and Docker, and requires the Amadeus API to work.
For more information on how to set up Amadeus API, go to Further Information

## Available Scripts

In the project directory, you can compose application using:

### `docker-compose up`

Composes all the necessary packages to run both React and Spring boot applications.\
(Might fail once. Run it twice if that happens.)

### `docker-compose down`

Deletes the created containers.\

## Learn More

Learn more about docker at: (https://docs.docker.com/)

## Further Information
This application requires to have connection to Amadeus API. 
If you want to try out this project, you have to create an account at: (https://developers.amadeus.com)
Once you created an account, set up an application at: (https://developers.amadeus.com/my-apps)
After that, you have to request your API KEY and API SECRET at your previously create Amadeus application.
Copy both keys and go to the file: flightsearch-backend > src > resources > application.properties
And paste them using the following format: 
amadeus.api.key=YOUR_API_KEY
amadeus.api.secret=YOUR_API_SECRET

In any case you can't make use of Amadeus API because of server errors, you can access to the demo data in the Postman mock server by changing the property amadeus.api.base.url (Dosen't work for the Flight Search component, only for  Flight Results):
amadeus.api.base.url=https://8b01c3f7-78b4-4746-b265-709ea899c5df.mock.pstmn.io/
You still need to add your API_KEY and your API_SECRET.
