# AyuScript Client

This is a script aimed to enhance the experience of game [florr.io](https://florr.io/) with zero injection to canvas APIs.

## How to use
### For users
#### Requirement
Tampermonkey installed on your browser
#### Install
You should install our script from [official website](https://ayuscript.cc/) to get a best experience.
### For developers
#### Requirement
- Node.js 18 or newer
- Yarn
- protoc
#### Develop
- Run `yarn run proto:generate` to compile the protocol buffers.
- Run `yarn run dev` to start the development server.
- Don't forget to run a server from [this GitHub repository](https://github.com/AyuScript/AyuScript-Server) or write one by yourself, or only partial functionalities can be enabled.
#### Build
- Create a `.env.production` file, with the same format as `.env.development`
- Run `yarn run proto:generate` to compile the protocol buffers.
- Run `yarn run build` to build the script.