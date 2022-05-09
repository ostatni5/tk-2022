# Component-based local filesystem image finder

The purpose of this app is to integrate many external components into one REST-based application that allows browsing local directories for images that fulfill certain criteria. The app will be distributed between a few instances that share the load of image processing and communicate via REST. Besides the backend search architecture, the app also features a web-based interface for defining the search criteria and displaying the results.

The project is developed for the "Component Technologies" class at AGH University of Science and Technology.

# Some example criteria would be:

-   **Metadata** - when a photo was taken, who took the photo
-   **Contents of an image** - Does the image contain people? Does it have any plants in it?
-   **Text** - Find images containing certain text.

# Graphical interface

## Overview

The graphical interface allows the user to search recursively for images in a given path.

The interface is minimalistic, consisting only of three components:

-   The path input field,
-   The module controls,
-   The result list.

![image](https://user-images.githubusercontent.com/58555777/166555841-82596157-67d2-462a-8c7e-cf22c1b58834.png)

The query can be additionally supplied with additional criteria via the module controls. those modules include:

-   The metadata module - EXIF based, ![image](https://user-images.githubusercontent.com/58555777/166554899-53e1073e-12ce-4a45-b5f0-5449a20b5e07.png)
-   The text content module - searching for images including the text of a given length or specific sentences, ![image](https://user-images.githubusercontent.com/58555777/166555115-f3ecce50-88cc-4f3c-b993-2e1ff651a80e.png)
-   The weather module - TODO,

## Building and running the interface

Prerequisites:

-   [NodeJS](https://nodejs.dev/) - v16.14.1 or greater,

To build the interface, firstly go to the /ui subdirectory:

    $ cd ui

Then install all dependencies:

    $ npm install

And lastly, run the dev build script:

    $ npm run dev

## UI project structure

The interface is written in svelte and typescript and is stored in the`/ui` subdirectory of the repository.

The GUI currently consists of 3 components:

-   `Form` - contains the search bar and the search module controls definitions, sends queries for images to the backend,
-   `ResultsList` - displays and filters the found images,
-   `ImageFinder` - a wrapper component for the other components.

As well as the following util scripts:

-   `flashOptions` - translates EXIF flash number codes to readable text,
-   `request.utils` - contains the logic for communicating with the backend server.

The dependencies, building and running scripts are defined in the standard`package.json` file.

# Backend architecture

## Overview

The backend consists of the main node that receives queries from the GUI and propagates requests, and side module nodes that filter the query results in a pipeline.

The server expects a request containing a **directory** and an object with the **module options**. When a new request is received, the **main node** searches recursively in the specified directory for images. When the node finds a **batch** (size 10) of images it creates a **request pipeline** defined in the **options object** and sends it to the **module nodes**. The nodes process the batch in sequence, while the **main node** sends in new **batches** as it finds them. Each processed batch is collected by the main node and added to the **result list**. After all, batches have been processed, the **result list** is returned to the **GUI**.

![image](https://user-images.githubusercontent.com/58555777/167266398-463073b4-77f7-405e-914e-a72e2a23a442.png)

## Building and running the server

Prerequisites:

-   [NodeJS](https://nodejs.dev/) - v16.14.1 or greater,
-   [Elixir](https://elixir-lang.org/) - v1.13.4 or greater,
-   [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) - v4.1.0.
-   [Python](https://www.python.org/) - v3.10 or greater,
-   [Pipenv](https://pipenv.pypa.io/) - v2022.5.2 or greater,

Building the backend requires building each node.

### Main and metadata nodes (NodeJS):

    $ cd server

Then install all dependencies:

    $ npm install

Run the nodes:

    $ npm run start

Testing the nodes:

    $ npm run test

### Text node (Elixir):

    $ cd text_server

Build steps:

    $ mix local.hex
    $ mix deps.get

Running text node:

    $ iex -S mix

Testing text node:

    $ mix test

### Weather node (Flask):

    $ cd weather_server

Build steps:

    $ python -m venv ./env

    For Windows:
    $ ./env/Scripts/Activate.ps1

    or for Linux/Mac:

    $ ./env/Scripts/Activate.bat

    Then:
    $ python -m pip install -r requirements.txt

Running the weather node from the root directory:

    $ python -m weather_server

    or from the weather_server directory:

    $ python ./

Testing the weather node from the root directory:

    $ python -m pytest ./weather_server/test/test_module.py

## Backend project structure

The backend consists of many lightweight nodes (REST servers) implemented in different technologies. The main and metadata nodes are both implemented in NodeJS, sharing some functionalities, and therefore are defined in the same directory -`node_servers`. The other modules each use different technologies and are defined in separate directories.

### Node Servers common directory

The `node_servers` directory contains the following directories:

-   `modules` - stores the main and metadata modules described in the later sections,
-   `classes` - defines abstract classes and interfaces that are shared between modules,
-   `utils` - contains implementations of common utility functions used in the modules.

### Main Module

The main module is a NodeJS REST server that resides in the main module directory. Its contents are:

-   `main.ts` - contains the definition of the main node and its functions: receiving queries from the UI and delegating tasks to module nodes,
-   `filesFinder.ts` - contains utility functions for finding images in a directory recursively.

### Metadata Module

The metadata module is also a NodeJS REST server that resides in the metadata module directory. It contains the following:

-   `metadata.ts` - contains the definition of the REST application along with the filtering logic,
-   `medatadaRequest.ts` - defines the request object that is received by this module,
-   `metadataOptions.interface.ts` - defines an interface for the possible filtering options that can be used in the REST request.

### Text Module

The text module is a simple Elixir REST application and is defined inside of the `text_server` directory, and consists of:

-   `mix.exs` - file, that defines the dependencies,
-   `/test` - directory, where tests and test-related utils are defined along with some test case images,
-   `/lib` - directory, which contains the functionality of the component.

Inside the lib directory, you can find the text_server module which contains the following files:

-   `application.ex` - the REST wrapper for the OCR logic,
-   `text_server_router.ex` - defines the REST API interface,
-   `ocr.ex` - this is where the text recognition logic resides.

### Weather Module

The weather module is a Flask REST server that resides in the weather module directory. It contains the following:

-   `/predict_weather_in_image` - directory, where the integrated model is defined,
-   `/test` - directory, where test-related utils are defined,
-   `check_json.py` - utility script for checking the validity of the JSON request,
-   `create_app.py` - utility script for creating the Flask application,
-   `weather_module.py` - the main class responsible for the handling of the requests and running the model,
-   `__main__.py` - the main script for the weather module.

Inside the `predict_weather_in_image` directory, you can find the following files:

-   `pwii.py` - the main model handler script,
-   `retrained_graph.pb` - the model graph,
-   `retrained_labels.txt` - the model labels,

### People Module

TODO
