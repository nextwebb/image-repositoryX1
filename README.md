# image-repository-backend
Image-repository-backend service
This is a Node.JS api for an image repository built for the Shopify Backend Developer Intern Challenge.
## Tech Stack

- Backend:
  - MongoDB
  - Node.js
  - Mongoose
  - TypeScript
  - Jest
  - Express.js

## How to use

- Install npm dependencies:

```sh
yarn install
```

- Start Mongodb Instance

```sh
docker compose -f mongodb.yaml up
```

- Start development server

```sh
yarn start:dev
```
- Push to upstream branch without test

```sh
git push --no-verify
```
#### Features
- ADD image(s) to the repository
   - one/bulk/enormous amount of images
   - private/public (permissions)
   - secure uploads
  
#### Usage
> Requires node v10+ and  mongodb
```shell
$ mkdir <folder>
$ cd <folder>
$ git clone https://nextwebb/image-repository.git .
$ yarn install
$ yarn run start:dev
```

#### Endpoints
```js
// response format:
{
   ok: boolean,
   message: string,
   data: object
}

// auth
// sign up
POST - "/api/v1/auth/signup"
// login
POST - "/api/v1/auth/signin"

// images
// upload image(s)
POST - "/api/v1/repository"
headers - Authorization: "Bearer <token>"
        - ContentType: "multipart/formdata"
```