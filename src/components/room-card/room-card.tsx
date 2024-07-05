import React from 'react';
import styles from './room-card.module.scss';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

export interface Rooms {
  _id: string;
  title: string;
  price: number;
  adult: number;
  child: number;
  totalCapacity: number;
  doubleBed: number;
  singleBed: number;
  features: string[];
  hotel: {
    _id: string;
    hotel_name: string;
    city: string;
    average_star: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface RoomCardProps {
  room: Rooms;
  onDetailsClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onDetailsClick }) => {
  const renderStars = (count: number) => {
    return (
      <>
        {[...Array(count)].map((_, index) => (
          <StarIcon key={index} style={{ color: '#FFD700' }} />
        ))}
      </>
    );
  };

  return (
    <article className={styles.card}>
      
      <div className={styles.projectInfo}>
        <div className={styles.flex}>
          <div className={styles.projectTitle}>{room.hotel.hotel_name}</div>
          <span>City: {room.hotel.city}</span>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <span>{room.title}</span>
            <span>{room.doubleBed} Double Bed</span>
            <span>{room.singleBed} Single Bed</span>
            <span>{renderStars(Math.round(room.hotel.average_star))}</span>
          </div> 
          
          <div className={styles.right}>
            <span>{room.adult} Adult, {room.child} Child</span>
            <span>{room.price}$</span>
            <button onClick={onDetailsClick}>Clik for Rezervation</button>
          </div>
        </div>
        
        {/* 
        <div>
          <h4>Features:</h4>
          <ul>
            {room.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div> 
        */}
      </div>
    </article>
  );
}

export default RoomCard;