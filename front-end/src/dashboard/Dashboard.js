import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import Tables from "../tables/Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [dashboardError, setDashboardError] = useState([]);
  const [tables, setTables] = useState([]);

  const history = useHistory();
  const query = useQuery().get("date");
  if (query) date = query;

  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboard() {
      try {
        setDashboardError([]);
        const reservationDate = await listReservations(
          { date },
          abortController.signal
        );
        setReservations(reservationDate);
      } catch (error) {
        setReservations([]);
        setDashboardError([error.message]);
      }
    }
    loadDashboard();
    return () => abortController.abort();
  }, [date]);

   useEffect(() => {
     const abortController = new AbortController();

     async function loadTables() {
       try {
         setDashboardError([]);
         const tableList = await listTables(abortController.signal);
         setTables(tableList);
       } catch (error) {
         setTables([]);
         setDashboardError([error.message]);
       }
     }
     loadTables();
     return () => abortController.abort();
   }, []);

  const handlePreviousDateClick = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDateClick = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const handleTodayDateClick = () => {
    history.push(`dashboard?date=${today(date)}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <button
            type="button"
            className="btn btn-primary"
            data-testid="previous-date"
            onClick={handlePreviousDateClick}
          >
            <span className="oi oi-minus" />
          </button>
        </div>
        <span className="input-group-text">{date}</span>
        <div className="input-group-prepend">
          <button
            type="button"
            className="btn btn-primary"
            data-testid="next-date"
            onClick={handleNextDateClick}
          >
            <span className="oi oi-plus" />
          </button>
        </div>
        <div>
          <button
            className="btn btn-dark mx-3"
            type="button"
            onClick={handleTodayDateClick}
          >
            Today
          </button>
        </div>
      </div>
      <ErrorAlert error={dashboardError} />
      <Reservations reservations={reservations} />
      <Tables tables={tables} />
    </main>
  );
}

export default Dashboard;
