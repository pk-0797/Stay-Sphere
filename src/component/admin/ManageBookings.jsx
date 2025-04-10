import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Chip,
  Divider,
  TextField,
  Paper,
} from "@mui/material";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/booking/getallbookings");
        const bookingsData = response.data.data;

        const mappedData = bookingsData.map((booking) => ({
          ...booking,
          guestName: booking.guestId?.fullName || "N/A",
          guestEmail: booking.guestId?.email || "N/A",
          guestPhone: booking.guestId?.phoneNo || "N/A",
          propertyTitle: booking.propertyId?.title || "N/A",
          propertyLocation: booking.propertyId?.address || "N/A",
          hostName: booking.hostId?.fullName || "N/A",
          hostEmail: booking.hostId?.email || "N/A",
          hostPhone: booking.hostId?.phoneNo || "N/A",
        }));

        const sortedData = mappedData.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.bookingDate);
          const dateB = new Date(b.createdAt || b.bookingDate);
          return dateB - dateA;
        });

        setBookings(sortedData);
      } catch (error) {
        toast.error("Failed to fetch bookings");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusColor = (status) => {
    if (status === "Confirmed") return "success";
    if (status === "Cancelled") return "error";
    return "warning";
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    return (
      booking.guestName?.toLowerCase().includes(query) ||
      booking.guestEmail?.toLowerCase().includes(query) ||
      booking.propertyTitle?.toLowerCase().includes(query) ||
      booking.propertyLocation?.toLowerCase().includes(query) ||
      booking.hostName?.toLowerCase().includes(query) ||
      booking.hostEmail?.toLowerCase().includes(query) ||
      booking._id?.toLowerCase().includes(query)
    );
  });

  return (
    <Box p={{ xs: 2, md: 5 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          gutterBottom
        >
          📋 Manage All Bookings
        </Typography>

        <TextField
          label="Search by Booking ID, Guest, Host, or Property"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : filteredBookings.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No bookings found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredBookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#fdfdfd",
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    color="primary"
                  >
                    {booking.propertyTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.propertyLocation}
                  </Typography>

                  <Chip
                    label={`Status: ${booking.status}`}
                    color={statusColor(booking.status)}
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: "bold",
                      bgcolor:
                        booking.status === "Confirmed"
                          ? "success.light"
                          : booking.status === "Cancelled"
                          ? "error.light"
                          : "warning.light",
                    }}
                  />

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" fontWeight="bold">
                    Booking Info
                  </Typography>
                  <Typography variant="body2">
                    🆔 <b>ID:</b> {booking._id}
                  </Typography>
                  <Typography variant="body2">
                    📅 <b>Date:</b> {booking.bookingDate}
                  </Typography>
                  <Typography variant="body2">
                    ⏰ <b>Time:</b> {booking.bookingTime}
                  </Typography>
                  <Typography variant="body2">
                    💰 <b>Price:</b> ₹{booking.totalPrice}
                  </Typography>
                  <Typography variant="body2">
                    🏁 <b>Check-In:</b> {booking.checkIn?.slice(0, 10)}
                  </Typography>
                  <Typography variant="body2">
                    🏁 <b>Check-Out:</b> {booking.checkOut?.slice(0, 10)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" fontWeight="bold">
                    Guest
                  </Typography>
                  <Typography variant="body2">👤 {booking.guestName}</Typography>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    📧 {booking.guestEmail}
                  </Typography>
                  <Typography variant="body2">📞 {booking.guestPhone}</Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" fontWeight="bold">
                    Host
                  </Typography>
                  <Typography variant="body2">🧑‍💼 {booking.hostName}</Typography>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    📧 {booking.hostEmail}
                  </Typography>
                  <Typography variant="body2">📞 {booking.hostPhone}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

