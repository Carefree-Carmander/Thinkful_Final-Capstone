const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasValidFields = require("../errors/hasValidFields");

const RequiredProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const VALID_PROPERTIES = [
  ...RequiredProperties,
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

/**
 * List handler for reservation resources
 */
//Middleware//

//make sure reservation exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;

  const data = await service.read(reservationId);

  if (data) {
    res.locals.reservation = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `reservation_id: ${reservationId} cannot be found.`,
    });
  }
}

//valides phone number
function mobileNumberValid(req, res, next) {
  const {
    data: { mobile_number },
  } = req.body;
  const justNums = mobile_number.replace(/\D/g, "");
  if (justNums.length === 10) {
    return next();
  }
  return next({
    status: 400,
    message: "mobile_number format is invalid.",
  });
}

//validates number of people
function numberOfPplValid(req, res, next) {
  const { people } = req.body.data;

  if (typeof people === "number" && people > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `people must be a whole number.`,
    });
  }
}

//validates reservation time
function timeValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const regex = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
  if (regex.test(reservation_time)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `reservation_time formatted incorrectly: ${reservation_time}.`,
    });
  }
}

//validates reservation date
function dateValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);
  if (date && date > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `reservation_date formatted incorrectly: ${reservation_date}.`,
    });
  }
}

//makes sure it's only for present and future dates
function presentAndFutureDates(req, res, next) {
  const {
    data: { reservation_date, reservation_time },
  } = req.body;

  const reservation = new Date(`${reservation_date} EST`).setHours(
    reservation_time.substring(0, 2),
    reservation_time.substring(3)
  );

  const now = Date.now();

  if (reservation > now) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }
}

//prevents reservations for tuesday
function closedTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const day = date.getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesday.",
    });
  } else {
    return next();
  }
}

//reservations only available for open business hours
function duringOpenHours(req, res, next) {
  const { reservation_time } = req.body.data;
  const open = 1030;
  const close = 2130;
  const reservation =
    reservation_time.substring(0, 2) + reservation_time.substring(3);
  if (reservation > open && reservation < close) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservations are only allowed between 10:30am and 9:30pm.",
    });
  }
}

//looking up reservations by either date or phone
async function byDateOrPhone(req, res, next) {
  const { date, mobile_number } = req.query;
  if (date) {
    const reservations = await service.list(date);
    if (reservations.length) {
      res.locals.data = reservations;
      return next();
    } else {
      return next({
        status: 404,
        message: `There are currently no pending reservations for ${date}`,
      });
    }
  }
  if (mobile_number) {
    const reservation = await service.find(mobile_number);
    res.locals.data = reservation;
    return next();
  }
}

//validates status
function statusValid(req, res, next) {
  const { status } = req.body.data;
  const validValues = ["booked", "seated", "finished", "cancelled"];
  if (validValues.includes(status)) {
    res.locals.status = status;
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid status: ${status}. Status must be one of these options: ${validValues.join(
        ", "
      )}`,
    });
  }
}

//if status is finished, cannot be updated
function statusNotFinished(req, res, next) {
  const { status } = res.locals.reservation;

  if (status === "finished") {
    return next({
      status: 400,
      message: `Status ${status} cannot be updated.`,
    });
  }
  return next();
}

//if status is not booked or undefined, it's cant be made into a new reservation
function statusBooked(req, res, next) {
  const { status } = req.body.data;

  if (status === undefined || status === "booked") {
    return next();
  } else {
    return next({
      status: 400,
      message: `Status cannot be set to ${status} when making a new reservation.`,
    });
  }
}

///CRUD///
async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const data = await service.list(date);
    res.json({
      data,
    });
  } else if (mobile_number) {
    const data = await service.find(mobile_number);
    res.json({
      data,
    });
  }
}

async function create(req, res) {
  const resFields = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);
  const reservation = await service.create(resFields);
  res.status(201).json({ data: reservation[0] });
}

function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

//updates status
async function updateStatus(req, res) {
  const { reservation, status } = res.locals;

  const updatedResData = {
    ...reservation,
    status: status,
  };

  const updatedRes = await service.update(updatedResData);

  res.status(200).json({ data: updatedRes });
}

//updates reservation body
async function updateReservation(req, res) {
  const { reservation } = res.locals;

  const { data } = req.body;

  const updatedResData = {
    ...reservation,
    ...data,
  };

  const updatedRes = await service.update(updatedResData);

  res.status(200).json({ data: updatedRes });
}

module.exports = {
  list: [asyncErrorBoundary(byDateOrPhone), asyncErrorBoundary(list)],
  create: [
    hasProperties(...RequiredProperties),
    hasValidFields(...VALID_PROPERTIES),
    mobileNumberValid,
    numberOfPplValid,
    timeValid,
    dateValid,
    presentAndFutureDates,
    closedTuesday,
    duringOpenHours,
    statusBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    hasProperties("status"),
    hasValidFields("status"),
    asyncErrorBoundary(reservationExists),
    statusValid,
    statusNotFinished,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    hasProperties(...RequiredProperties),
    hasValidFields(...VALID_PROPERTIES),
    asyncErrorBoundary(reservationExists),
    mobileNumberValid,
    numberOfPplValid,
    timeValid,
    dateValid,
    closedTuesday,
    presentAndFutureDates,
    duringOpenHours,
    statusValid,
    statusNotFinished,
    asyncErrorBoundary(updateReservation),
  ],
};
