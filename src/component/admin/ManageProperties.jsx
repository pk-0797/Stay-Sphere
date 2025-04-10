import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const ManageProperties = () => {
  const [properties, setproperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();

    const filtered = properties.filter((p) => {
      const title = p.title?.toLowerCase();
      const hostName = p.userId?.fullName?.toLowerCase();
      const hostEmail = p.userId?.email?.toLowerCase();

      return (
        title?.includes(query) ||
        hostName?.includes(query) ||
        hostEmail?.includes(query)
      );
    });

    setFilteredProperties(filtered);
  };

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

  const handleEditClick = (property) => {
    setSelectedProperty({ ...property });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleDialogSubmit = async () => {
    try {
      await axios.put(`/property/update-details/${selectedProperty._id}`, {
        title: selectedProperty.title,
        totalPrice: selectedProperty.totalPrice,
        address: selectedProperty.address,
      });

      MySwal.fire("Updated!", "Property updated and host notified.", "success");
      getAllProperties();
      handleDialogClose();
    } catch (err) {
      console.error("Update failed", err);
      MySwal.fire("Error", "Could not update property", "error");
    }
  };

  const columns = [
    { field: "_id", headerName: "Property Unique ID", width: 180 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "propertyType", headerName: "Type", width: 100 },
    { field: "roomType", headerName: "Room", width: 100 },
    {
      field: "amenities",
      headerName: "Amenities",
      width: 200,
      renderCell: (params) => (params.value ? params.value.join(", ") : "N/A"),
    },
    { field: "address", headerName: "Address", width: 180 },
    { field: "pincode", headerName: "Pincode", width: 90 },
    { field: "totalPrice", headerName: "Price/Day", width: 110 },
    {
      field: "hostName",
      headerName: "Host Name",
      width: 150,
      renderCell: (params) => params.row.userId?.fullName || "N/A",
    },
    {
      field: "hostEmail",
      headerName: "Host Email",
      width: 200,
      renderCell: (params) => params.row.userId?.email || "N/A",
    },
    {
      field: "hostPhone",
      headerName: "Host Phone",
      width: 130,
      renderCell: (params) => params.row.userId?.phoneNo || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteUser(params.row._id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: "96%", margin: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "Spinnaker",
            fontWeight: "bold",
            textAlign: "center",
            color: "#2D6CDF",
          }}
        >
          🏘️ Manage All Property Listings
        </Typography>

        <TextField
          label="Search by Title, Host Name or Email"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          onChange={handleSearch}
        />
      </Paper>

      {loading ? (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <DataGrid
            rows={filteredProperties}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            autoHeight
            checkboxSelection
            getRowId={(row) => row._id}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#E3F2FD",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-cell": {
                whiteSpace: "nowrap",
              },
            }}
          />
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={selectedProperty?.title || ""}
            onChange={handleDialogChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Total Price"
            name="totalPrice"
            type="number"
            value={selectedProperty?.totalPrice || ""}
            onChange={handleDialogChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={selectedProperty?.address || ""}
            onChange={handleDialogChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
