const knex = require("../db/connection");

// function list() {}

function create() {
  return knex("reservations")
    .insert(reservation, "*")
  .then((createdRecords) => createdRecords[0])
}

// function read() {}

// function update() {}

module.exports = {
  // list,
  // read,
  create,
  // update,
};
