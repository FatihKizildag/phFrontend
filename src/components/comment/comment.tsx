import React, { useState } from 'react';
import styles from './comment.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';

export interface Comment {
  _id:string;
  value: string;
  hygiene_star: number;
  safety_star: number;
  transportation_star: number;
  likes: number;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    userType: string;
  };
  hotel: {
    hotel_name: string;
    _id: string;
  };
}

export interface CommentProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentProps> = ({ comment }) => {

  const renderStars = (starCount: number) => {
    return (
      <>
        {[...Array(starCount)].map((_, index) => (
          <StarIcon key={index} filled={true} />
        ))}
        {[...Array(5 - starCount)].map((_, index) => (
          <StarIcon key={index + starCount} filled={false} />
        ))}
      </>
    );
  };

  return (
    <div className={styles.commentCard}>
      <div className={styles.header}>
        <div className={styles.textXs}>
          <h4>{comment.user.first_name} {comment.user.last_name}</h4>
          <i>userType: {comment.user.userType}</i>
        </div>
        <h3>{comment.hotel.hotel_name}</h3>
      </div>
      <div className={styles.details}>
        <div className={styles.stars}>
          <p>Hygiene: {renderStars(comment.hygiene_star)}</p>
          <p>Safety: {renderStars(comment.safety_star)}</p>
          <p>Transportation: {renderStars(comment.transportation_star)}</p>
        </div>
        
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{comment.value}</p>
      </div>
      
    </div>
  );
};

interface StarIconProps {
  filled?: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ filled }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={filled ? styles.starFilled : styles.starEmpty}
      viewBox="0 0 20 20"
      fill="currentColor"
      style={{ width: '20px', height: '20px', color: 'gold' }}
    >
      <path
        d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"
      />
    </svg>
  );
};

export default CommentCard;
