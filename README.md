![Logo RentX](.github/rentx.png)

RentX is a car rental API developed during Rocketseat Ignite bootcamp.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=rentx&uri=https%3A%2F%2Fgithub.com%2Florenasg1%2Fignite-rentx%2Fblob%2Fmain%2F.github%2FInsomnia_2021-05-10)

## Tech
- Typescript
- Nodejs
- TypeORM
- Postgres
- Redis 
- Docker
- AWS (EC2, SES, Route53)

## Features
- Account
  - Create user
  - Authentication with jwt and refresh tokens
  - Send forgot password email
  - Reset password
  - Update user avatar
  - Show user profile
- Cars
  - Create cars
  - List cars
  - List available cars
  - Create car specifications
  - Create car categories
  - Import categories (csv files)
  - Upload car photos (multiple files)
- Rentals
  - Create rental
  - List rentals by user
  - Closing the rent (car return)


## How to use
1. Clone the project and install the dependencies with `npm` or `yarn`
2. Setup a postgres database and the ormconfig file
3. Run `typeorm migration:run` to execute the migrations
4. Run `yarn dev` to start the delopment server
