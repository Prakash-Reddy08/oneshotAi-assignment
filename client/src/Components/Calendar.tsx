import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiPrivate } from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../services/types";
import { formatTime } from "../services/helper";
import { toast } from "react-toastify";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<{ [date: string]: string[] }>(
    {}
  );
  const { id } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    apiPrivate
      .get("api/appointments/booked-slots")
      .then((response) => {
        setBookedSlots(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch booked slots:", error);
      });
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    const currentDateTime = new Date();
    const slotDateTime = new Date(
      selectedDate.toISOString().slice(0, 10) + " " + timeSlot
    );

    if (slotDateTime <= currentDateTime) {
      console.log("Cannot book past slots.");
      return;
    }

    if (
      selectedDate &&
      !bookedSlots[selectedDate.toISOString().slice(0, 10)]?.includes(timeSlot)
    ) {
      const toastId = toast.loading("Loading...");
      apiPrivate
        .post("api/appointments/book-slot", {
          date: selectedDate.toISOString().slice(0, 10),
          timeSlot,
          userId: id,
        })
        .then(() => {
          setBookedSlots((prevBookedSlots) => {
            const selectedDateKey = selectedDate.toISOString().slice(0, 10);
            const updatedBookedSlots = {
              ...prevBookedSlots,
              [selectedDateKey]: [
                ...(prevBookedSlots[selectedDateKey] || []),
                timeSlot,
              ],
            };
            return updatedBookedSlots;
          });
          toast.update(toastId, {
            render: "Booking Successful",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
            draggable: true,
          });
        })
        .catch((err) => {
          toast.update(toastId, {
            render: err.response.data.error || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
            draggable: true,
          });
        });
      console.log("Booking:", selectedDate, timeSlot);
    }
  };

  const availableTimeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 10;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  const isDateBooked = selectedDate
    ? availableTimeSlots.every((timeSlot) => {
        const slotDateTime = new Date(
          selectedDate.toISOString().slice(0, 10) + " " + timeSlot
        );
        return (
          bookedSlots[selectedDate.toISOString().slice(0, 10)]?.includes(
            timeSlot
          ) || slotDateTime <= new Date()
        );
      })
    : false;

  return (
    <CalendarContainer>
      <h2>Book Slots</h2>
      <DateSelectionContainer>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
        />
        {selectedDate && (
          <TimeSlotContainer>
            {availableTimeSlots.map((timeSlot) => {
              const slotDateTime = new Date(
                selectedDate.toISOString().slice(0, 10) + " " + timeSlot
              );
              const isPastSlot = slotDateTime < new Date();
              const isSlotBooked =
                bookedSlots[selectedDate.toISOString().slice(0, 10)]?.includes(
                  timeSlot
                ) || false;

              return (
                <TimeSlot
                  key={timeSlot}
                  onClick={() => handleTimeSlotClick(timeSlot)}
                  $booked={isSlotBooked}
                  $past={isPastSlot}
                  disabled={isSlotBooked || isPastSlot}
                >
                  {formatTime(timeSlot)}
                </TimeSlot>
              );
            })}
          </TimeSlotContainer>
        )}
      </DateSelectionContainer>
      {selectedDate && isDateBooked && (
        <BookedMessage>
          Slots are Completely Booked! Try Next available day
        </BookedMessage>
      )}
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const DateSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const TimeSlotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const TimeSlot = styled.button<{ $booked: boolean; $past: boolean }>`
  padding: 10px;
  background-color: ${({ $booked, $past }) =>
    $past ? "#dddddd" : $booked ? "#ff0000" : "#007bff"};
  color: ${({ $booked, $past }) => ($booked || $past ? "#000000" : "#ffffff")};
  border: none;
  border-radius: 5px;
  cursor: ${({ $booked, $past }) =>
    $booked || $past ? "not-allowed" : "pointer"};
  font-size: 16px;
  font-weight: bold;
  min-width: 80px;

  &:hover {
    background-color: ${({ $booked, $past }) =>
      $booked || $past ? "#ff0000" : "#007bff"};
  }
`;

const BookedMessage = styled.h2`
  color: red;
  margin-top: 20px;
  font-size: 18px;
`;

export default Calendar;
