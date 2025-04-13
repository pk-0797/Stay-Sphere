import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    properties: 0,
    totalRevenue: 0,
  });
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, bookingRes, propertyRes, revenueRes] = await Promise.all([
          axios.get("/users"),
          axios.get("/booking/getallbookings"),
          axios.get("/property/getallproperties"),
          axios.get("/booking/total-revenue"),
        ]);

        setStats({
          users: userRes.data.data.length,
          bookings: bookingRes.data.data.length,
          properties: propertyRes.data.data.length,
          totalRevenue: revenueRes.data.totalRevenue || 0,
        });

        const bookings = bookingRes.data.data;
        const monthlyCount = {};
        bookings.forEach((booking) => {
          const date = new Date(booking.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          monthlyCount[month] = (monthlyCount[month] || 0) + 1;
        });

        const sortedData = Object.entries(monthlyCount).map(([month, count]) => ({
          month,
          count,
        }));

        setMonthlyBookings(sortedData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = [
    { name: "Users", value: stats.users },
    { name: "Bookings", value: stats.bookings },
    { name: "Properties", value: stats.properties },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={4} sx={{ marginBottom: 4, alignItems: "center" }}>
        {[
          { label: "Total Users", value: stats.users },
          { label: "Total Bookings", value: stats.bookings },
          { label: "Total Properties", value: stats.properties },
        ].map((item, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card
              sx={{
                padding: 2,
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="h3" color="primary">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pie Chart - System Overview */}
      <div className="col-md-12 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center text-primary">System Overview</h5>
            <div style={{ width: "100%", height: 500 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={150}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Bookings Line Chart */}
      <div className="col-md-12 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center text-primary">Monthly Bookings</h5>
            <br />
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke={theme.palette.text.primary} />
                  <YAxis allowDecimals={false} stroke={theme.palette.text.primary} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#0088FE"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 4, marginBottom: 4 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Analytics Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Revenue
            </Typography>
            <Typography variant="h5" color="primary">
              ₹ {stats.totalRevenue.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Avg. Bookings / Month
            </Typography>
            <Typography variant="h5">
              {(stats.bookings / 12).toFixed(1)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Active Properties
            </Typography>
            <Typography variant="h5">{stats.properties}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              New Users (This Month)
            </Typography>
            <Typography variant="h5">{Math.floor(stats.users / 4)}</Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
