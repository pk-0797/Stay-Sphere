import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/user/${userId}`);
          setUsers(users.filter((user) => user._id !== userId));
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async () => {
    try {
      const res = await axios.put(`/user/${currentUser._id}`, {
        ...currentUser,
        updatedByAdmin: true,
      });
      setUsers(users.map((user) => (user._id === currentUser._id ? res.data.data : user)));
      setEditDialogOpen(false);
      Swal.fire("Success", "User updated successfully", "success");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update user", "error");
    }
  };
  

  useEffect(() => {
    getAllUsers();
  }, []);

  const columns = [
    { field: "_id", headerName: "User Unique Id", width: 250, headerAlign: "center", align: "center" },
    { field: "fullName", headerName: "Full Name", width: 180, headerAlign: "center", align: "center" },
    { field: "email", headerName: "Email", width: 250, headerAlign: "center", align: "center" },
    { field: "role", headerName: "Role", width: 120, headerAlign: "center", align: "center" },
    { field: "phoneNo", headerName: "Mobile Number", width: 160, headerAlign: "center", align: "center" },
    { field: "age", headerName: "Age", width: 80, headerAlign: "center", align: "center" },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
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
        </>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const fullName = (user.fullName || "").toString().toLowerCase();
    const email = (user.email || "").toString().toLowerCase();
    const role = (user.role || "").toString().toLowerCase();
    const phoneNo = (user.phoneNo || "").toString().toLowerCase();

    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      role.includes(query) ||
      phoneNo.includes(query)
    );
  });

  return (
    <Box sx={{ maxWidth: "90%", margin: "auto", mt: 4, textAlign: "center" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Spinnaker",
          fontWeight: "bold",
          backgroundColor: "#2D6CDF",
          color: "white",
          p: 2,
          borderRadius: 2,
        }}
      >
        Manage All Users Details
      </Typography>

      <TextField
        label="Search Users"
        variant="outlined"
        size="small"
        sx={{ my: 2 }}
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          getRowId={(row) => row._id}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold !important",
              textTransform: "uppercase",
              backgroundColor: "#2D6CDF",
              color: "black",
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center",
            },
          }}
        />
      )}

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            name="fullName"
            value={currentUser?.fullName || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={currentUser?.email || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            value={currentUser?.role || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone Number"
            name="phoneNo"
            value={currentUser?.phoneNo || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Age"
            name="age"
            value={currentUser?.age || ""}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
