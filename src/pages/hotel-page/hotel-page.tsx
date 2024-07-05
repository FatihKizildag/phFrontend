import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Footer } from '@/components/footer/footer';
import { TopBar } from '@/components/top-bar/top-bar';
import { STopBar } from '../../components/signed-in-compenents/s-top-bar/s-top-bar'
import styles from './hotel-page.module.scss';
import { Tabs, Tab, Box } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import CommentIcon from '@mui/icons-material/Comment';
import Preview from '@/components/preview/preview';
import axios from 'axios';
import { Hotel } from '../../components/hotel-card/hotel-card';
import HotelComment from '@/components/hotel-comment/hotel-comment';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function HotelPage() {
  const { _id } = useParams<{ _id: string }>(); // URL'den otel ID'sini almak
  const [value, setValue] = React.useState(0);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // localStorage'da token olup olmadığını kontrol et
    const token = localStorage.getItem('token');
    setHasToken(!!token);

    const fetchHotel = async () => {
      try {
        const response = await axios.get(`https://phbackend-9rp2.onrender.com/hotels?_id=${_id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        
        if (Array.isArray(data) && data.length > 0) {
          const fetchedHotel: Hotel = {
            _id: data[0]._id,
            name: data[0].hotel_name,
            image: data[0].image || [],
            description: data[0].hotel_desc,
            average_stars: data[0].average_star || 0,
            hygiene_star: data[0].hygiene_star,
            safety_star: data[0].safety_star,
            transportation_star: data[0].transportation_star,
            city: data[0].city,
            country: data[0].country,
          };
          setHotel(fetchedHotel);
          
        }
      } catch (error) {
        console.error('Error fetching hotel:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      {hasToken ? <STopBar /> : <TopBar />} 
      <div className={styles.content}>
        <Box sx={{ width: '100%'}}>
          <Tabs value={value} onChange={handleChange} aria-label="hotel tabs">
            <Tab label="Preview" icon={<PreviewIcon />} {...a11yProps(0)} />
            <Tab label="Comments" icon={<CommentIcon />} {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            {hotel && <Preview hotel={hotel} />}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <HotelComment/>
          </CustomTabPanel>
        </Box>
      </div>
      <Footer />
    </div>
  );
}
