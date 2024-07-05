import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import styles from './favorites.module.scss';
import FavoriteHotelCard from '../../components/fav-hotel/fav-hotel';
import { STopBar } from '@/components/signed-in-compenents/s-top-bar/s-top-bar';
import { Footer } from '@/components/footer/footer';
import { useNavigate } from 'react-router-dom';

interface Hotel {
  id: string;
  name: string;
  image: string;
  description: string;
  average_stars: number;
}

const FavoriteHotels: React.FC = () => {
  const { user } = useAuth();
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFavoriteHotels = async () => {
      if (!user) {
        setError('User not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const favoriteHotelIds = user.favorites;
        if (!favoriteHotelIds || favoriteHotelIds.length === 0) {
          setFavoriteHotels([]);
          setLoading(false);
          return;
        }

        const response = await fetch('https://phbackend-9rp2.onrender.com/hotels');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const hotelsData = await response.json();
        const filteredHotels = hotelsData.filter((hotel: any) => favoriteHotelIds.includes(hotel._id));
        
        const fetchedHotels: Hotel[] = filteredHotels.map((hotel: any) => ({
          id: hotel._id,
          name: hotel.hotel_name,
          image: hotel.image || 'default.jpg',
          description: hotel.hotel_desc,
          average_stars: hotel.average_star || 0,
        }));

        setFavoriteHotels(fetchedHotels);
        
        
      } catch (error) {
        console.error('Error fetching favorite hotels:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteHotels();
  }, [user]);
  const handleHotelClick = (_id: string) => {
    navigate(`/hotel/${_id}`);
    console.log("id",_id);
    
  };
  const handleRemoveFavorite = async (hotelId: string) => {
    if (!user) {
      setError('User not found');
      return;
    }

    try {
      // Favoriden kaldırma işlemi
      const updatedFavorites = user.favorites.filter(id => id !== hotelId);
      const updatedUser = { ...user, favorites: updatedFavorites };

      // Kullanıcı bilgilerini güncelle
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setFavoriteHotels(favoriteHotels.filter(hotel => hotel.id !== hotelId));

      // İsteğe bağlı: Sunucuya favori güncellemesini bildirme
      await fetch(`https://phbackend-9rp2.onrender.com/users/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hotelId }),
      });

    } catch (error) {
      console.error('Error removing favorite:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <STopBar />
      <div className={styles.content}>
        <h2>Account Settings</h2>
          {favoriteHotels.length === 0 ? (
            <div>No favorite hotels found.</div>
          ) : (
            favoriteHotels.map(hotel => (
              <FavoriteHotelCard
                key={hotel.id}
                _id={hotel.id}
                name={hotel.name}
                image={hotel.image}
                description={hotel.description}
                average_stars={hotel.average_stars}
                onRemoveFavorite={handleRemoveFavorite}
                onClick={handleHotelClick}
              />
            ))
          )}
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default FavoriteHotels;
