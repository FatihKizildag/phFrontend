import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './filtration.module.scss';
import RoomCard, { Rooms } from '../../components/room-card/room-card';
import { TopBar } from '@/components/top-bar/top-bar';
import { Footer } from '@/components/footer/footer';
import { Slider, Checkbox, FormControlLabel, Button, Drawer, Modal, Box } from '@mui/material';
import axios from 'axios';
import STopBar from '@/components/signed-in-compenents/s-top-bar/s-top-bar';

const Filtration: React.FC = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);

  const featureOptions = [
    "wifi",
    "pool",
    "gym",
    "Mini Fridge",
    "Jacuzzi",
    "Balcony",
    "Room Service",
    "Mini Bar",
    "Parent Bathroom",
    "Terrace",
    "Bathroom with Bathtub",
    "Garden View",
  ];
  // URL oluşturma fonksiyonu
  const createFetchUrl = () => {
    const params = new URLSearchParams(location.search);
    const city = params.get('city');
    const checkInDate = params.get('checkInDate');
    const checkOutDate = params.get('checkOutDate');
    const adult = params.get('adult');
    const child = params.get('child');
    const priceMin = priceRange[0].toString();
    const priceMax = priceRange[1].toString();
    const features = selectedFeatures.join(',');

    const query: { [key: string]: string } = {};
    if (city) query.city = city;
    if (checkInDate) query.checkInDate = checkInDate;
    if (checkOutDate) query.checkOutDate = checkOutDate;
    if (adult) query.adult = adult;
    if (child) query.child = child;
    query.priceMin = priceMin;
    query.priceMax = priceMax;
    if (features) query.features = features;

    const queryString = new URLSearchParams(query).toString();
    return `https://phbackend-9rp2.onrender.com/rooms/search-rooms?${queryString}`;
  };

  const fetchRooms = async () => {
    const fetchUrl = createFetchUrl();
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    setHasToken(!!token);
    
    try {
      const response = await axios.get(fetchUrl);

      if (response.status === 200) {
        const roomsData: Rooms[] = response.data.map((room: any) => ({
          _id: room._id,
          title: room.title,
          adult: room.adult,
          child: room.child,
          doubleBed: room.doubleBed,
          singleBed: room.singleBed,
          features: room.features,
          hotel: {
            _id: room.hotel._id,
            hotel_name: room.hotel.hotel_name,
            city: room.hotel.city,
            average_star: room.hotel.average_star,
          },
          price: room.price,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        }));
        setRooms(roomsData);
      } else {
        setError('Failed to fetch rooms. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while fetching rooms.');
      console.error('Fetch rooms error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [location.search, priceRange, selectedFeatures]);

  const handlePriceChange = (event: any, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const feature = event.target.name;
    setSelectedFeatures((prevFeatures) =>
      event.target.checked
        ? [...prevFeatures, feature]
        : prevFeatures.filter((f) => f !== feature)
    );
  };

  const handleDetailsClick = (room: Rooms) => {
    setSelectedRoom(room);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleCreateReservation = async () => {
    if (!selectedRoom) return;

    const hotel = selectedRoom.hotel._id;
    const roomId = selectedRoom._id;
    const checkInDate = new URLSearchParams(location.search).get('checkInDate') || '';
    const checkOutDate = new URLSearchParams(location.search).get('checkOutDate') || '';
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.post('https://phbackend-9rp2.onrender.com/bookings', {
        roomId,
        hotel: hotel,
        checkInDate,
        checkOutDate,
      },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token'i Authorization başlığına ekle
        },
      });

      if (response.status === 200) {
        alert('Reservation successfully created! Details can be viewed in history page.');
        window.location.reload();
      } else {
        alert('Failed to create reservation. Please try again.');
      }
    } catch (error) {
      alert('Please login to make reservation.');
      console.error('Create reservation error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
      {hasToken ? <STopBar /> : <TopBar />} 
      </div>
      <div className={styles.content}>
        <h2>Search Results</h2>
        <div className={styles.main}>
          <div className={styles.filters}>
            <h3>Filters</h3>
            <div className={styles.slider}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={50}
              />
              <p>Price Range: ${priceRange[0]} - ${priceRange[1]}</p>
            </div>
            <div className={styles.features}>
              <h4>Features</h4>
              {featureOptions.map((feature) => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      name={feature}
                      onChange={handleFeatureChange}
                    />
                  }
                  label={feature}
                />
              ))}
            </div>
            <Button variant="contained" onClick={fetchRooms}>
              Search
            </Button>
          </div>
          <div className={styles.results}>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCard key={room._id} room={room} onDetailsClick={() => handleDetailsClick(room)} />
              ))
            ) : (
              <div>No rooms found.</div>
            )}
          </div>
        </div>
        <Modal open={drawerOpen} onClose={handleCloseDrawer}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width:'400px',
            height:'300px',
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '50px',
            backgroundColor: '#3acbe1',
            borderRadius: '10px',
          }}
        >
          <h2>Room Details</h2>
          {selectedRoom && (
            <div className={styles.drawerContent}> 
              <h3>{selectedRoom.title}</h3>
              <p>Hotel: {selectedRoom.hotel.hotel_name}</p>
              <p>City: {selectedRoom.hotel.city}</p>
              <p>Price: ${selectedRoom.price}</p>
              <button onClick={handleCreateReservation}>
                Create Reservation
              </button>
            </div>
          )}
        </Box>
      </Modal>
      </div>
      <Footer />
      
    </div>
  );
};

export default Filtration;
