# To run the code

## Installation

### Install nvm (optional)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Running the above command downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

This is optional you can choose to directly install node directly (node >= 16.0.0)

### Install node using nvm

`nvm install 16.16.0`

### Install yarn (optional)

`npm install --global yarn`

This is optional, you can choose to use `npm` itself.

### Install node dependencies

`yarn install` or `npm install`

## Database setup

Create the database and run migrations:

```sh
createdb time_deposit
yarn migrate
yarn seed
```

## Run the server

### Dev server while watching

`yarn dev`

### Test suite while watching

`yarn test`

### Run server

`yarn start`

## Triggering endpoints via Swagger

1. Start the server: `yarn dev` or `yarn start`
2. Open http://localhost:3000/api-docs in a browser
3. Use the Swagger UI to try the two endpoints:
   - **GET /time-deposits** – list all time deposits with withdrawals
   - **PUT /time-deposits/balance** – update balances using interest rules

Or use curl:

```sh
curl http://localhost:3000/time-deposits
curl -X PUT http://localhost:3000/time-deposits/balance
```
