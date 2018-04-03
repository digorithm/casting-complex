# Technical debts incurred in this project

Tech debts are inevitable. It's better to accept and document them than pretending that everything is perfect. As usual, most of these technical debts were incurred in order to deliver the project as early as possible.

## Models

## Routers

- Better error handling on model level, both for instance/class functions that I created and errors that could be thrown by sequelize. These erros are not properly captured and will be hard to debug without proper error handling

- Tests are not exhaustive. I am not testing corner cases at all.

