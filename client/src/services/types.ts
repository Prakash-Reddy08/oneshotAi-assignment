export interface User {
  email: string;
  userId: number;
}

export interface RootState {
  auth: {
    isLoggedIn: boolean;
    user: User | null;
  };
}
export interface Booking {
  _id: string;
  date: string;
  timeSlot: string;
  isBooked: boolean;
}
