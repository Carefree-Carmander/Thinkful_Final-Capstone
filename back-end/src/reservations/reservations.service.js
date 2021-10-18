const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .andWhereNot({ status: "cancelled" })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function update(updateReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updateReservation.reservation_id })
    .update(updateReservation, "*")
    .then((updatedReservations) => updatedReservations[0]);
}

function find(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  find,
};
