import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const ManageProperties = () => {
  const [properties, setproperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const MySwal = withReactContent(Swal);

  const getAllProperties = async () => {
    try {
      const res = await axios.get("/property/getallproperties");
      setproperties(res.data.data);
      setFilteredProperties(res.data.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const handleDeleteUser = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This property will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/property/delete/${id}`);
          const updated = properties.filter((p) => p._id !== id);
          setproperties(updated);
          setFilteredProperties(updated);
          MySwal.fire("Deleted!", "The property has been removed.", "success");
        } catch (error) {
          console.error("Error deleting property:", error);
          MySwal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = properties.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
  };

  const columns = [
    { field: "_id", headerName: "Property Unique ID", width: 200 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "propertyType", headerName: "Type", width: 100 },
    { field: "roomType", headerName: "Room Type", width: 100 },
    {
      field: "amenities",
      headerName: "Amenities",
      width: 180,
      renderCell: (params) => (params.value ? params.value.join(", ") : "N/A"),
    },
    { field: "address", headerName: "Address", width: 150 },
    { field: "pincode", headerName: "Pincode", width: 90 },
    { field: "totalPrice", headerName: "Price/Day", width: 110 },
    {
      field: "hostName",
      headerName: "Host Name",
      width: 150,
      renderCell: (params) => {
        const user = params.row.userId;
        return user?.fullName || "N/A";
      },
    },
    {
      field: "hostEmail",
      headerName: "Host Email",
      width: 200,
      renderCell: (params) => {
        const user = params.row.userId;
        return user?.email || "N/A";
      },
    },
    {
      field: "hostPhone",
      headerName: "Host Phone",
      width: 130,
      renderCell: (params) => {
        const user = params.row.userId;
        return user?.phoneNo || "N/A";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteUser(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: "95%", margin: "auto", mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Spinnaker",
          fontWeight: "bold",
          background: "linear-gradient(90deg, #2D6CDF 0%, #5C8EF3 100%)",
          color: "white",
          p: 2,
          borderRadius: 2,
          textAlign: "center",
          boxShadow: 2,
          mb: 3,
        }}
      >
        🏘️ All Properties Details
      </Typography>

      <TextField
        label="Search by Title"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        onChange={handleSearch}
      />

      {loading ? (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={filteredProperties}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          checkboxSelection
          getRowId={(row) => row._id}
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: "#2D6CDF",
              color: "black",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              whiteSpace: "normal",
              lineHeight: "1.4rem",
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center",
              padding: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f1f1",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #ddd",
            },
            "& .MuiDataGrid-checkboxInput": {
              color: "#2D6CDF",
            },
          }}
        />
      )}
    </Box>
  );
};
