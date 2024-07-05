import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './landing.module.scss';
import { TopBar } from '../../components/top-bar/top-bar';
import { STopBar } from '../../components/signed-in-compenents/s-top-bar/s-top-bar';
import { SearchBar } from '../../components/search-bar/search-bar';
import SlideHotels from '../../components/slide-hotels/slide-hotels';
import { Footer } from '../../components/footer/footer';
import { Hotel } from '../../components/hotel-card/hotel-card';

const Landing: React.FC = () => {
  const [top_hotels, setTopHotels] = useState<Hotel[]>([]);
  const [safety_hotels, setSafetyHotels] = useState<Hotel[]>([]);
  const [hygienic_hotels, setHygienicHotels] = useState<Hotel[]>([]);
  const [reachable_hotels, setReachableHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Kullanıcı oturum durumu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('https://phbackend-9rp2.onrender.com/hotels');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: any[] = await response.json();
        // console.log('Fetched hotels:', data);

        const fetchedHotels: Hotel[] = data.map((hotel: any) => ({
          _id: hotel._id,
          name: hotel.hotel_name,
          image: hotel.image || 'D:/phFrontend/src/assets/images/hotel.png',
          description: hotel.hotel_desc,
          average_stars: hotel.average_star || 0,
          hygiene_star: hotel.hygiene_star,
          safety_star: hotel.safety_star,
          transportation_star: hotel.transportation_star,
          city: hotel.city,
          country: hotel.country,
        }));

        const top_hotels = fetchedHotels
          .sort((a: Hotel, b: Hotel) => b.average_stars - a.average_stars)
          .slice(0, 8);

        const safety_hotels = fetchedHotels
          .sort((a: Hotel, b: Hotel) => b.safety_star - a.safety_star)
          .slice(0, 8);

        const hygienic_hotels = fetchedHotels
          .sort((a: Hotel, b: Hotel) => b.hygiene_star - a.hygiene_star)
          .slice(0, 8);

        const reachable_hotels = fetchedHotels
          .sort((a: Hotel, b: Hotel) => b.transportation_star - a.transportation_star)
          .slice(0, 8);

        setTopHotels(top_hotels);
        setSafetyHotels(safety_hotels);
        setHygienicHotels(hygienic_hotels);
        setReachableHotels(reachable_hotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    // Kullanıcı oturum durumunu kontrol edin
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      // console.log('local', localStorage.getItem('isLoggedIn'));

      setIsLoggedIn(loggedIn);
      //console.log('logged in: ', loggedIn);
    };

    fetchHotels();
    checkLoginStatus();
    //console.log('check status: ', checkLoginStatus);

  }, []);

  const handleSearch = (criteria: { city: string; checkInDate: string; checkOutDate: string; adult: number; child: number }) => {
    // Arama kriterlerini URL parametrelerine ekleyerek Filtration sayfasına yönlendiriyoruz
    navigate(`/filtration?city=${encodeURIComponent(criteria.city)}&checkInDate=${criteria.checkInDate}&checkOutDate=${criteria.checkOutDate}&adult=${criteria.adult}&child=${criteria.child}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {isLoggedIn ? <STopBar /> : <TopBar />}
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
        <SearchBar onSearch={handleSearch} />
        </div>
        <div className={styles.middle}>
          <h3>Featured Hotels</h3>
          <SlideHotels hotels={top_hotels} />
          <h3>Most Hygienic</h3>
          <SlideHotels hotels={hygienic_hotels} />
          <h3>Most Trusted</h3>
          <SlideHotels hotels={safety_hotels} />
          <h3>Easiest to reach</h3>
          <SlideHotels hotels={reachable_hotels} />
        </div>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
