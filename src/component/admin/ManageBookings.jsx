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
} from "@mui/material";
import toast from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
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

  const handleConfirmBooking = async (id) => {
    try {
      await axios.put(`/booking/confirm/${id}`);
      toast.success("Booking confirmed!");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Confirmed" } : b))
      );
    } catch (error) {
      toast.error("Failed to confirm booking");
      console.error(error);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await axios.put(`/booking/cancel/${id}`);
      toast.success("Booking canceled!");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
      );
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error(error);
    }
  };

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
      booking.hostEmail?.toLowerCase().includes(query)
    );
  });

  return (
    <Box p={5}>
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        textTransform="Uppercase"
        color="primary"
        textAlign="center"
      >
        Manage All Bookings
      </Typography>

      <TextField
        label="Search Bookings"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 3, mx: "auto", display: "block" }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={6}>
          {filteredBookings.map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking._id}>
              <Card
                sx={{
                  padding: 1,
                  boxShadow: 3,
                  borderRadius: 4,
                  bgcolor: "#f9f9f9",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="primary.dark">
                    🏠 {booking.propertyTitle}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    📍 {booking.propertyLocation}
                  </Typography>

                  <Box my={1}>
                    <Chip
                      label={`Status: ${booking.status}`}
                      color={statusColor(booking.status)}
                      size="small"
                      sx={{
                        mb: 1,
                        fontWeight: "bold",
                        bgcolor:
                          booking.status === "Confirmed"
                            ? "success.light"
                            : booking.status === "Cancelled"
                            ? "error.light"
                            : "warning.light",
                      }}
                    />
                    <Typography variant="body2">
                      📅 Booking Date: {booking.bookingDate}
                    </Typography>
                    <Typography variant="body2">
                      ⏰ Booking Time: {booking.bookingTime}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      👤 Guest Info
                    </Typography>
                    <Typography variant="body2">
                      Name: {booking.guestName}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      Email: {booking.guestEmail}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {booking.guestPhone}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      🧑‍💼 Host Info
                    </Typography>
                    <Typography variant="body2">
                      Name: {booking.hostName}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      Email: {booking.hostEmail}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {booking.hostPhone}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="body2">
                      📆 Check-In: {booking.checkIn?.slice(0, 10)}
                    </Typography>
                    <Typography variant="body2">
                      📆 Check-Out: {booking.checkOut?.slice(0, 10)}
                    </Typography>
                    <Typography variant="body2">
                      💰 Total Price: ₹{booking.totalPrice}/-
                    </Typography>
                  </Box>

                  <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "Do you want to confirm this booking?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Yes, confirm it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleConfirmBooking(booking._id);
                          }
                        })
                      }
                      disabled={booking.status === "Confirmed"}
                    >
                      Confirm
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "Do you want to cancel this booking?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, cancel it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleCancelBooking(booking._id);
                          }
                        })
                      }
                      disabled={booking.status === "Cancelled"}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};




