# FCA Open-Source Catalog

This project is built with Vue.js and serves as a catalog of the open-source FCA (Firebolt Certification App) builds. The application allows users to browse and view different builds, including PR (Pull Request) and Tag builds.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

```bash
cd vueApp

npm install
```

### Development

```bash
npm run dev
```
This will start the Vue development server. You can view the application in your browser at http://localhost:5173.

### Deployment

To build the app run `npm run build`. This will create a `dist` folder that contains the build files. Add the build files to the root of the `github-io-deployment` branch of FCA.