import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Booking, RootState } from "../services/types";
import { formatTime } from "../services/helper";
import { toast } from "react-toastify";
import useAxiosPrivate from "../customHooks/usePrivateRoute";

const Appointments: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { id } = useSelector((state: RootState) => state.auth);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate
      .get(`api/appointments/user-bookings/${id}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user bookings:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelBooking = (bookingId: string) => {
    const toastId = toast.loading("Loading...");
    axiosPrivate
      .delete(`api/appointments/cancel-booking/${bookingId}`)
      .then(() => {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        toast.update(toastId, {
          render: "Cancelled Bookings",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error("Failed to cancel booking:", error);
        toast.update(toastId, {
          render: "Failed to cancel booking",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          draggable: true,
        });
      });
  };

  return (
    <BookingContainer>
      <h2>Your Bookings</h2>
      {bookings.map((booking) => (
        <BookingItem key={booking._id}>
          <span>{new Date(booking.date).toDateString()}</span>
          <span>{formatTime(booking.timeSlot)}</span>
          <CancelButton onClick={() => handleCancelBooking(booking._id)}>
            Cancel
          </CancelButton>
        </BookingItem>
      ))}
    </BookingContainer>
  );
};

const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const BookingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const CancelButton = styled.button`
  padding: 5px 10px;
  background-color: #ff0000;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #b30000;
  }
`;
export default Appointments;
