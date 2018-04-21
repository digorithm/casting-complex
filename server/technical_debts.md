# Technical debts incurred in this project

Tech debts are inevitable. It's better to accept and document them than pretending that everything is perfect. As usual, most of these technical debts were incurred in order to deliver the project as early as possible.

## Models

## Routers

- Better error handling on model level, both for instance/class functions that I created and errors that could be thrown by sequelize. These errors are not properly captured and will be hard to debug without proper error handling.

- Tests are not exhaustive. I am not testing corner cases at all.

- In messages, there's no actual logic for toggling wasRead bool. It should be easy to implement this, since the model supports it.

- Router does not support parent messages, but the models do. A reply is just a message with .setParent(previousMessage).

- No search queries for now, will add them as needed.

- in (GET) `/breakdowns/:id/roles/:id` it must be checked if breakdown.id == role.BreakdownId

- No authentication at all at the moment. Anyone calling the resources will get data. This need to change. For example, to get the audition requests for a breakdown, the client must be the casting director that owns the breakdown.