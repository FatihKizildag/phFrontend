import "./rezervation.scss";
import Sidebar from "../../../components/admin-components/sidebar/sidebar";
import Navbar from "../../../components/admin-components/navbar/navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Pagination
} from "@mui/material";

interface Hotel {
  _id: string;
  hotel_name: string;
}

interface Reservation {
  _id: string;
  room: { _id: string; title: string };
  user: { _id: string; first_name: string; last_name: string };
  hotel: { _id: string; hotel_name: string; city: string };
  checkInDate: string;
  checkOutDate: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

const Rezervations: React.FC = () => {
  const { data: myHotelData } = useFetch("https://phbackend-9rp2.onrender.com/users/my-hotel");
  const hotels: Hotel[] = myHotelData as Hotel[] || [];

  const [activeTab, setActiveTab] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    if (hotels.length > 0) {
      fetchReservations(hotels[activeTab]._id);
    }
  }, [hotels, activeTab]);

  const fetchReservations = async (hotelId: string) => {
    try {
      const response = await axios.get(
        `https://phbackend-9rp2.onrender.com/hotels/bookings?hotelId=${hotelId}`
      );
      setReservations(response.data.reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (reservationId: string, newStatus: boolean) => {
    // Update status logic here
    console.log("Update reservation status:", reservationId, newStatus);
    // Placeholder for axios.put request
    /*
    axios.put('https://phbackend-9rp2.onrender.com/bookings', {
      reservationId,
      status: newStatus
    }).then(response => {
      console.log(response.data);
      fetchReservations(hotels[activeTab]._id); // Refresh reservations
    }).catch(error => {
      console.error("Error updating reservation status:", error);
    });
    */
  };

  const paginatedReservations = reservations.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Rezervations</h1>
        </div>
        <div className="bottom">
          <div className="right">
            {hotels.length > 0 && (
              <>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="hotel tabs">
                  {hotels.map((hotel, index) => (
                    <Tab key={hotel._id} label={hotel.hotel_name} />
                  ))}
                </Tabs>
                <Box p={3}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Guest Name</TableCell>
                          <TableCell>Room Title</TableCell>
                          <TableCell>Hotel Name</TableCell>
                          <TableCell>Check-In Date</TableCell>
                          <TableCell>Check-Out Date</TableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedReservations.map((reservation) => (
                          <TableRow key={reservation._id}>
                            <TableCell sx={{textTransform:"capitalize"}}>{`${reservation.user.first_name} ${reservation.user.last_name}`}</TableCell>
                            <TableCell>{reservation.room.title}</TableCell>
                            <TableCell>{reservation.hotel.hotel_name}</TableCell>
                            <TableCell>{new Date(reservation.checkInDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(reservation.checkOutDate).toLocaleDateString()}</TableCell>
                            
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box mt={2} display="flex" justifyContent="center">
                    <Pagination
                      count={Math.ceil(reservations.length / rowsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                </Box>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rezervations;
