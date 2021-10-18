const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasValidFields = require("../errors/hasValidFields");
const reservationService = require("../reservations/reservations.service");

///middleware///

const VALID_PROPERTIES_POST = ["table_name", "capacity"];
const VALID_PROPERTIES_PUT = ["reservation_id"];

//makes sure reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const data = await reservationService.read(reservation_id);
  if (data && data.status !== "seated") {
    res.locals.reservation = data;
    return next();
  } else if (data && data.status === "seated") {
    return next({
      status: 400,
      message: `reservation_id: ${reservation_id} is already seated.`,
    });
  } else {
    return next({
      status: 404,
      message: `reservation_id: ${reservation_id} does not exist.`,
    });
  }
}

//makes sure table exists
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  
  const data = await service.read(table_id);

  if (data) {
    res.locals.table = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `table_id: ${table_id} does not exist.`,
    });
  }
}

//validates capacity for table
function tableCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  
  const { people } = res.locals.reservation;
  
  if (capacity >= people) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity.",
    });
  }
}

//validates capacity is a number
function capacityIsNumber(req, res, next) {
  const { capacity } = req.body.data;

  if (typeof capacity === "number" && capacity > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `capacity field formatted incorrectly: ${capacity}. Needs to be a number.`,
    });
  }
}

//valides table name length
function tableNameLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) {
    return next();
  } else {
    return next({
      status: 400,
      message: "table_name must be at least 2 characters in length.",
    });
  }
}

//validates table status as free if no reservation assigned
function tableStatusFree(req, res, next) {
  if (res.locals.table.reservation_id === null) {
    return next();
  }
  return next({
    status: 400,
    message: "Table is already occupied.",
  });
}

//validates table status as occupied if reservation is assigned
function tableStatusOccupied(req, res, next) {
  if (res.locals.table.reservation_id !== null) {
    return next();
  }
  return next({
    status: 400,
    message: "Table is not occupied.",
  });
}

///CRUD///

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function create(req, res) {
  const table = await service.create(req.body.data);
  res.status(201).json({ data: table });
}

//seats(submits) a table
async function seat(req, res) {
  const { table } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const { table_id } = req.params;
  const updatedTableData = {
    ...table,
    table_id: table_id,
    reservation_id: reservation_id,
    status: "occupied",
  };
  const updatedTable = await service.seat(updatedTableData);
  //sets reservation status to seated using reservation id
  const updatedReservation = {
    status: "seated",
    reservation_id: reservation_id,
  };
  await reservationService.update(updatedReservation);
  res.json({ data: updatedTable });
}

//finishes(finazlizes) a table
async function finish(req, res) {
  await service.finish(
    res.locals.table.table_id,
    res.locals.table.reservation_id
  );
  res.status(200).json(`${req.params.table_id} table_id is occupied.`);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties(...VALID_PROPERTIES_POST),
    hasValidFields(...VALID_PROPERTIES_POST, "reservation_id"),
    tableNameLength,
    capacityIsNumber,
    asyncErrorBoundary(create),
  ],
  seat: [
    hasProperties(...VALID_PROPERTIES_PUT),
    hasValidFields(...VALID_PROPERTIES_PUT),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableCapacity,
    tableStatusFree,
    asyncErrorBoundary(seat),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableStatusOccupied,
    asyncErrorBoundary(finish),
  ],
};
