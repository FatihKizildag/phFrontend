import React from 'react';
import styles from './booking-card.module.scss';
import { Box, Typography } from '@mui/material';
 import {User} from '../../AuthContext'

export interface Booking {
  _id: string;
  room: {
    _id: string;
    title: string;
    hotel: string;
  };
  user: User;
  hotel: {
    _id: string;
    hotel_name:string;
    city: string;
  };
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  updatedAt: string;
}

interface RoomCardProps {
  booking: Booking;
}

const BookCard: React.FC<RoomCardProps> = ({ booking }) => {
  const checkInDate = new Date(booking.checkInDate).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString();

  return (
    <Box className={styles.roomCard}>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <p>Check-In: {checkInDate}</p>
        <p>Check-Out: {checkOutDate}</p>
      </div>
        <p>Dear <b>{booking.user.first_name} {booking.user.last_name}</b></p>
        <p>Hotel Name: <b>{booking.hotel.hotel_name}</b></p>
        <p>Room title: <b>{booking.room.title}</b></p>
        
        <br />
        <Typography variant="body2" color="textSecondary">
          Created At: {new Date(booking.createdAt).toLocaleDateString()}
          <p style={{display:"flex", justifyContent:"center"}}>Contact us for reservation changes</p>
        </Typography>
    </Box>
  );
};

export default BookCard;
