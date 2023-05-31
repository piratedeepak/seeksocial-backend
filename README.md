# SeekSocial

This is the README file for the SeekSocial application, which consists of a frontend client and a backend server.

## Frontend (Client)

The frontend client is located in the `client` directory. To run the client, navigate to the `client` directory and run the following command:

```
npm run client:dev
```

This command will start the development server for the frontend client.

### Environment Variables

You need to create an environment variable file named `.env` in the `client/src` directory. This file will contain the necessary environment variables for the frontend client. The variables are as follows:

```
REACT_APP_SEARCH_URL=
```

Replace the empty value with the URL for the search feature of your choice.

## Backend (SeekSocial)

The backend server is located in the root directory. To run the server, use the following command:

```
npm run server:dev
```

This command will start the server using Nodemon, which automatically restarts the server when changes are detected.

### Scripts

The following scripts are available in the project:

- `client:dev`: Starts the development server for the frontend client.
- `server:dev`: Starts the backend server using Nodemon.
- `start`: Builds the frontend client and starts the server.
- `build`: Builds the frontend client.
- `client:install`: Installs dependencies for both the frontend client.
- `install`: Installs dependencies for both the backend client.

To use these scripts, run the following command in the root directory:

```
npm run <script-name>
```

Replace `<script-name>` with the name of the script you want to run.

### Environment Variables

#### Backend (SeekSocial)

You need to create an environment variable file named `.env` in the `config` folder. This file will contain the necessary environment variables for the backend in the development environment. Please refer `.env.example`

Make sure to replace the empty values with your own values in the `.env` file.

#### Frontend (Client)

You also need to create an environment variable file named `.env` in the `client/src` directory. This file will contain the necessary environment variables for the frontend client. Please refer `.env.example`
