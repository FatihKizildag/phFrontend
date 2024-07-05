import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './search-bar.module.scss';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import PersonCountPopover from '../person-count/person-count';

interface SearchBarProps {
  onSearch?: (criteria: { city: string; checkInDate: string; checkOutDate: string; adult: number; child: number }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [locations, setLocations] = useState<{ city: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<{ city: string } | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://phbackend-9rp2.onrender.com/hotels');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: any[] = await response.json();

        const uniqueCities = Array.from(new Set(data.map(hotel => hotel.city)))
          .map(city => ({ city }));

        setLocations(uniqueCities);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSearchClick = () => {
    if (selectedCity && checkInDate && checkOutDate && (adults + children > 0)) {
      const searchParams = new URLSearchParams({
        city: selectedCity.city,
        checkInDate,
        checkOutDate,
        adult: adults.toString(),
        child: children.toString(),
      }).toString();

      navigate(`/filtration?${searchParams}`);
      localStorage.setItem('searchParams', searchParams);
    } else {
      alert('Please fill in all search criteria.');
    }
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Box className={styles.container} sx={{ p: 3 }}>
      <div className={styles.content}>
        <div className={styles.label}>
          <Autocomplete
            options={locations}
            getOptionLabel={(option) => option.city}
            onChange={(event, value) => setSelectedCity(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                placeholder="Choose city"
                fullWidth
              />
            )}
          />
        </div>

        <div className={styles.label}>
          <TextField
            fullWidth
            label="Check-In Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            inputProps={{ min: getTodayDateString() }}
          />
        </div>
        <div className={styles.label}>
          <TextField
            fullWidth
            label="Check-Out Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            inputProps={{ min: getTodayDateString() }}
          />
        </div>

        <div className={styles.label}>
          <TextField
            fullWidth
            label="People"
            value={`${adults} Adults, ${children} Children`}
            onClick={handlePopoverOpen}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>

        <div className={styles.right}>
          <button onClick={handleSearchClick}>
            Search
          </button>
        </div>
      </div>

      <PersonCountPopover
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        adults={adults}
        setAdults={setAdults}
        children={children}
        setChildren={setChildren}
      />
    </Box>
  );
}
