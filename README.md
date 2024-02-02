# Azure Group Assignment Management Tool

This is a tauri app that uses react as the frontend framework. It uses the Microsoft Graph API to look up groups and find what assignments the group has on apps, configuration profiles, scripts, proactive remediations, etc.

## Features

- Easily identify the configuration profiles, apps, policies and remediations that are assigned to a group.
- Retrieve group information such as membership type, dynamic membership rule and devices belonging to the group.

## Future Features

- Export a list of all assignments to an Excel document
- Selectively clone assignments from one group to another
- Export script content for device scripts
- Export a Win32 app's .intunewin file

## Installation

To run this app, you need to have Node.js, the tauri-cli, and Rust installed on your system.

To install the dependencies, run the following commands in the project directory:

```
npm install
cargo install tauri-cli --force
```

To start the app in development mode, run:

```
npm run tauri dev
```

To build the app for production, run:

```
npm run tauri build
```

The output binaries will be in the `src-tauri/target/release` folder.

## Usage

To use the app, you need to have a Microsoft account and app registration. The configured redirect url for the app registration should be http://locahost. Log in and grant the app permission to access the Graph API. You can do this by clicking on the Sign in button on the app and following the instructions.

Once you are signed in, you can enter the name a group in the search box and click on the lookup group. The app will display the assignments that the group has for configuration profiles, apps, remediations etc.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
