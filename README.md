# Component based local filesystem image finder

The purpose of this app is to integrate many external components into one REST based application that allows to browse local directories for images that fullfil certain criteria. The app will be distributed along a few instances that share the load of image processing and communicate via REST. Besides the backend search architecture, the app also features a web based interface for defining the search criteria and displaying the results.

The project is developed for the "Component Technologies" class at AGH University of Science and Technology.

# Some example criteria would be:

- **Metadata** - when was a photo taken, who took the photo
- **Contents of an image** - Does the image contain people? Does it have any plants in it?
- **Text** - Find images containing certain text.

# Graphical interface

## Overview

Graphical allows the user to to search recursively for images in a given path.

The interface is minimalistic, consisting only of three components:
 - The path input field,
 - The module controls,
 - The result list.

![image](https://user-images.githubusercontent.com/58555777/166555841-82596157-67d2-462a-8c7e-cf22c1b58834.png)

The query can be aditionalty supplied with aditional criteria via the module controls. those modules include: 
 - The metadata module - exif based,![image](https://user-images.githubusercontent.com/58555777/166554899-53e1073e-12ce-4a45-b5f0-5449a20b5e07.png)
 - The text content module - searching for images including text of a given length or specific sentences,![image](https://user-images.githubusercontent.com/58555777/166555115-f3ecce50-88cc-4f3c-b993-2e1ff651a80e.png)
 - The weather module - TODO,


## Building the interface

Prerequisites:
 - [NodeJS](https://nodejs.dev/) - v16.14.1 or greater,

To build the interface, firstly go to the /ui subdirectory:
    
    $ cd ui
Then install all dependencies:
    
    $ npm install
And lastly run the dev build script:

    $ npm run dev


## UI project structure

The interface is written in svelte and typescript and is stored in the `/ui` subdirectory of the repository.

The GUI currently consists of 3 components:
 - Form - contains the searchbar and the search module controls definitions, sends queries for images to the backend,
 - ResultsList - displays and filters the found images,
 - ImageFinder - a wrapper component for the other components.

As well as the following util scripts:
 - flashOptions - translates exif flash number codes to readable text,
 - request.utis - contains the logic for communicating with the backend server.

The dependencies, building and running scripts are defined in the standard `package.json` file.

# Backend architecture

**TODO**
