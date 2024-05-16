# AppDev URL Shortener (cuapp.dev)
## Author
This repository was created by [Archit Mehta](https://github.com/Archit404Error), Team Lead '24.

## Description
The AppDev URL shortener is an internal tool used by the team to generate shortlinks for marketing, internal forms, and miscellaneous links we wish to publicize. The tool also enables QR code generate and visit tracking to gauge engagement for various marketing campaigns.

## Tech Stack
The backend is built in TypeScript with Express, using a MongoDB database with schemas powered by [Typegoose](http://typegoose.github.io). The backend also handles authentication via [Firebase Auth](https://firebase.google.com/docs/auth/web/start)

The frontend was built in [NextJS 13](https://nextjs.org), which should potentially be updated to version 14.0+ in the future for improved performance. It also leverages a component library called [DaisyUI](https://daisyui.com) to simplify styling. The frontend is deployed on [Vercel](https://vercel.com)

## Usage
You should begin by installing both the frontend and backend dependencies by running `yarn` in each folder.

Next, duplicate the `.envtemplate` in `backend` and update the variables with their corresponding values. Begin running the backend via `yarn dev` in the `backend/` folder

In `frontend/`, copy the `.envtemplate` and rename it `.env.local`, entering the host (e.g., `localhost`) and the port on which the backend process is running (note that on the product deployment the server url has already been configured and can be modified on Vercel).

You can now begin running the frontend via `yarn dev`