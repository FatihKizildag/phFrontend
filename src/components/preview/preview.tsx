import * as React from 'react';
import { useState, useEffect } from 'react';
import { Hotel } from '../hotel-card/hotel-card';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CardMedia,
  Tooltip,
} from '@mui/material';
import Slider from 'react-slick';
import StarIcon from '@mui/icons-material/Star';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import styles from './preview.module.scss';

interface PreviewProps {
  hotel: Hotel;
}

const Preview: React.FC<PreviewProps> = ({ hotel }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Kullanıcının favori otellerini localStorage'dan al
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const favoriteHotels = user?.favorites || [];

      // Otelin zaten favori olup olmadığını kontrol et
      setIsFavorite(favoriteHotels.includes(hotel._id));
    }
  }, [hotel._id]);

  const renderStars = (count: number) => {
    return (
      <>
        {[...Array(count)].map((_, index) => (
          <StarIcon key={index} style={{ color: '#FFD700' }} />
        ))}
      </>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Favori ekleme/çıkarma işlemi
  const handleFavoriteClick = async () => {
    if (!token) return; // Token yoksa işlemi sonlandır

    try {
      const response = await axios.post(
        'https://phbackend-9rp2.onrender.com/users/favorites',
        { hotelId: hotel._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Favori durumunu değiştir
        setIsFavorite(!isFavorite);

        // LocalStorage'daki kullanıcı bilgilerini güncelle
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          let updatedFavorites;

          if (isFavorite) {
            // Otel favorilerden çıkarılıyor
            updatedFavorites = user.favorites.filter((id: string) => id !== hotel._id);
          } else {
            // Otel favorilere ekleniyor
            updatedFavorites = [...user.favorites, hotel._id];
          }

          // Kullanıcı verilerini localStorage'da güncelle
          const updatedUser = { ...user, favorites: updatedFavorites };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        alert(isFavorite ? 'Removed from favorites.' : 'Added to favorites.');
      } else {
        alert('Failed to update favorite status.');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert('An error occurred while updating favorite status.');
    }
  };

  return (
    <Box className={styles.container} sx={{ p: 3 }}>
      <Card sx={{ borderRadius: '15px' }}>
        <Slider {...settings}>
          {hotel.image.map((imgSrc, index) => (
            <CardMedia
              key={index}
              component="img"
              height="500"
              image={imgSrc}
              alt={`${hotel.name} image ${index + 1}`}
            />
          ))}
        </Slider>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '5px', height: 'fit-content' }}>
          <Typography variant="h5" component="div" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {hotel.name} 
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnOutlinedIcon /> {hotel.city} / {hotel.country}
              {/* Favori Ekleme */}
              {token && (
                <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                  <Button
                    onClick={handleFavoriteClick}
                    sx={{ marginLeft: 2 }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon style={{ color: 'red' }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: 'gray' }} />
                    )}
                  </Button>
                </Tooltip>
              )}
            </div>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {hotel.description}
          </Typography>
          <Divider textAlign="left"></Divider>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Average Stars: {renderStars(Math.round(hotel.average_stars))}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Hygiene: {renderStars(Math.round(hotel.hygiene_star))}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Safety: {renderStars(Math.round(hotel.safety_star))}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Transportation: {renderStars(Math.round(hotel.transportation_star))}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Preview;
