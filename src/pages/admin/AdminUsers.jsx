import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "../../api/axios"; // Adjust path as necessary
import { useAuth } from "../../auth/AuthContext"; // To check for admin status
import { Link } from "react-router-dom"; // Added for the edit user button

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from AuthContext

  // State for filtering
  const [filterRole, setFilterRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.getAllUsers();
      console.log("AdminUsers: Raw API response for users:", res);
      const usersData =
        res?.data?.data?.data || res?.data?.data || res?.data || []; // Correctly access the deeply nested data
      console.log("AdminUsers: Extracted usersData:", usersData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users");
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await authAPI.deleteUser(id);
        toast.success("User deleted successfully!");
        fetchUsers(); // Re-fetch the user list to update the UI
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error(err.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  useEffect(() => {
    // Only fetch users if the current user is an admin
    if (user?.role === "admin") {
      fetchUsers();
    } else {
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, [user]);

  // Filtered users based on role and search term
  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "" || u.role === filterRole;
    const matchesSearch =
      searchTerm === "" ||
      (u.FirstName &&
        u.FirstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.LastName &&
        u.LastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });
  console.log("AdminUsers: Current users state:", users);
  console.log("AdminUsers: Filtered users for rendering:", filteredUsers);

  if (loading) return <p className="text-center mt-4">Loading users...</p>;
  if (error)
    return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <h2 className="mb-4 text-center fw-bold text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-people-fill me-2"></i> User Management
      </h2>

      <div className="row mb-4 justify-content-between align-items-center g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg border-primary rounded-pill px-3"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select form-select-lg border-primary rounded-pill px-3"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center fs-5 text-muted">
          No users found matching your criteria.
        </p>
      ) : (
        <div className="table-responsive p-4 border rounded shadow-lg bg-white">
          <table className="table table-striped table-hover table-bordered caption-top">
            <caption className="text-primary fw-bold">
              List of all users
            </caption>
            <thead className="table-dark">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Active</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userItem) => (
                <tr key={userItem._id || userItem.email}>
                  <td>{userItem.FirstName}</td>
                  <td>{userItem.LastName}</td>
                  <td>{userItem.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        userItem.role === "admin"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {userItem.role}
                    </span>
                  </td>
                  <td>
                    {userItem.isVerified ? (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    ) : (
                      <i className="bi bi-x-circle-fill text-danger"></i>
                    )}
                  </td>
                  <td>
                    {userItem.active ? (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    ) : (
                      <i className="bi bi-x-circle-fill text-danger"></i>
                    )}
                  </td>
                  <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                  <td className="d-flex gap-2">
                    <Link to={`/admin/edit-user/${userItem._id}`}>
                      <button
                        className="action-icon-btn edit-icon-btn"
                        title="Edit User"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </Link>
                    <button
                      className="action-icon-btn delete-icon-btn"
                      title="Deactivate User"
                      onClick={() => handleDeleteUser(userItem._id)}
                    >
                      <i className="bi bi-person-slash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
