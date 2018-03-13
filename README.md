# Casting Complex 

## Starting App

**Without Migrations**

```
npm install
npm start
```

**With Migrations**

```
npm install
node_modules/.bin/sequelize db:migrate
npm start
```

**Running seeds**

```
node_modules/.bin/sequelize db:seed:all
```

If developing, remember to keep `sync({force: true})` and run `npm start` to clean the database (if needed).

If you wanna add more default values to models such as `hair` or `eyes`, update values to the file `seed.json` and run the seeds generation.

## Running Tests

We have added some [Mocha](https://mochajs.org) based test. You can run them by `npm test`