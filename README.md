# FindYourThrone

Every time I go on a road trip I inevitably have to make a bathroom in the middle of no where. Most times the bathrooms I find are run down, gross, locked, outside of the gas station, etc. It makes using the bathroom uncomfortable and at times, I might have to stop two or three times just to find the right bathroom for me. 

Enter Find Your Throne! A bathroom rating mobile app that uses Google’s Places API to locate gas stations closest to you. From there you can choose a bathroom, view it’s rating, find it’s address, and even rate it yourself! This way you will always have the best bathroom experience possible. 

Some technical details: I create or find a bathroom in my database whenever a user clicks on a bathroom in the list. I then tie the bathroom reviews to the specific data base. I have two tables, bathrooms and bathroom_reviews. The bathroom_reviews table uses the bathroom ID to link together. The front end is in react native and runs on both android and iOS.

In order to run this locally you will need to create a Google places API key. From there you can CD into WatchTheThrone and “react-native run-ios” from the command line. First you might need to install  the React Native command line interface with “npm install -g react-native-cli”. To start the back end simply CD into backend and run “npm start”

 # Screenshots!
 
 Bathroom Page, pulls the bathroom's closet to you based on your location! 
