import React from 'react';
import styles from "./fav-hotel.module.scss";
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface HotelCardProps {
  _id: string;
  name: string;
  image: string;
  description: string;
  average_stars: number;
  onRemoveFavorite: (hotelId: string) => Promise<void>;
  onClick?: (id: string) => void;
}

const FavoriteHotelCard: React.FC<HotelCardProps> = ({ _id, name, image, description, average_stars, onRemoveFavorite, onClick }) => {
  

  const handleRemoveFavorite = async () => {
    await onRemoveFavorite(_id);
  };

  const renderStars = (count: number) => {
    return (
      <>
        {[...Array(count)].map((_, index) => (
          <StarIcon key={index} style={{ color: '#FFD700' }} />
        ))}
      </>
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick(_id);
      
      localStorage.setItem('hotelId',_id);
    }
  };


  return (
    <div  onClick={handleClick} className={styles.container}>
      <div className={styles.cardClass}>
        <img className={styles.media} src={image[0]} alt={name} />
        <div className={styles.content}>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className={styles.actions}>
          
          {renderStars(Math.round(average_stars))}
          
          <FavoriteIcon className={styles.favoriteButton} onClick={handleRemoveFavorite}>
          </FavoriteIcon>
          
        </div>
        
      </div>
    </div>
  );
}

export default FavoriteHotelCard;
