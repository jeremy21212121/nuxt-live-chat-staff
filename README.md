# Live support chat - staff front end

>built with Nuxt.js SSR, OAuth2, indexedDB & socket.io

This is one of three components of a live chat support system. The other pieces are [node-live-chat](https://github.com/jeremy21212121/node-live-chat) (a back end system built with Express & Socket.io) and a public client for embedding on a website which doesn't exist yet but will probably just be a Vue component that gets integrated into an existing Vue/Nuxt site.

This is being built for a specific client, but it's open-source in case it is useful for anyone.

## Overview

Here is a brief overview of features both completed and planned. This project is mostly aimed at desktop but I'm trying to make it as mobile friendly as possible. It is difficult to maintain background connections on mobile browsers and it is not a priority so it will have to wait.

### Auth

It uses google OAuth2, designed for a gsuite internal API key. This makes it easy to restrict access to members of a gsuite org.

### Staff dashboard

Lists various "sub-apps". Live chat is currently the only one.

### Live support

Two views: live and historical. Live is partially completed, showing the presence of new messages. Each client session generates a human readable name (I ported [humanhash](https://github.com/zacharyvoase/humanhash) from python) and an [identicon](https://en.wikipedia.org/wiki/Identicon) from the random socket ID, to make each convo more recognizable to humans. Coming soon includes the chat interface and desktop notifications.

The historical view will allow managers to review previous conversations. They will come from a RESTish endpoint provided by the back-end server.

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

```

Built with [Nuxt.js](https://nuxtjs.org).
