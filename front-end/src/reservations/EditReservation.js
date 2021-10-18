import React from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const { reservation_id } = useParams();

  return (
    <section>
      <div className="headingBar d-md-flex my-3 p-2">
        <h1>Edit Reservation</h1>
      </div>
      <ReservationForm reservation_id={reservation_id} />
    </section>
  );
}
