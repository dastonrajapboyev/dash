import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../Service";

const GroupDashboardComponent = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editCreatorId, setEditCreatorId] = useState(0);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      const response = await instance.get("/group/get/all/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups(response.data.object);
    } catch (error) {
      toast.error(`Error fetching groups: ${error.message}`);
      console.error("Error fetching groups:", error);
    }
  };

  const createGroup = async () => {
    const creatorId = localStorage.getItem("idUser");
    try {
      const response = await instance.post(
        "/group/create",
        {
          creatorId,
          name: newGroupName,
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewGroupName("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
      fetchGroups();
      setShowCreateModal(false);
      toast.success("Group created successfully!");
    } catch (error) {
      toast.error(
        `Error creating group: ${error.response?.data.message || error.message}`
      );
    }
  };

  const updateGroup = async () => {
    try {
      const response = await instance.put(
        `group/update`, // Updated URL
        {
          id: editGroupId, // Send groupId as a parameter
          name: editGroupName,
          creatorId: editCreatorId,
          startDate: editStartDate,
          endDate: editEndDate,
        }, // No body payload; sending data as query params instead
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response status is OK and handle the response
      if (response.status === 200) {
        // Resetting the state
        setEditGroupId(null);
        setEditGroupName("");
        setEditCreatorId(0);
        setEditStartDate("");
        setEditEndDate("");
        fetchGroups(); // Fetch the updated group list
        setShowEditModal(false); // Close the modal
        toast.success("Group updated successfully!"); // Success message
      }
    } catch (error) {
      // Log the complete error for debugging
      console.error("Update error:", error);
      toast.error(
        `Error updating group: ${error.response?.data.message || error.message}`
      );
    }
  };

  const deleteGroup = async (id) => {
    try {
      const response = await instance.delete(`/group/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          groupId: id, // Send group ID as a parameter
        },
      });

      // Check if the response status is OK and handle the response
      if (response.status === 200) {
        fetchGroups();
        toast.success("Group deleted successfully!");
      }
    } catch (error) {
      toast.error(
        `Error deleting group: ${error.response?.data.message || error.message}`
      );
    }
  };

  const handleSignOut = () => {
    toast.info(
      <div>
        Are you sure you want to sign out?
        <div>
          <button
            onClick={() => {
              localStorage.clear();
              toast.dismiss();
              window.location.reload();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded-md ml-2">
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 text-black px-2 py-1 rounded-md ml-2">
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:static md:w-64`}>
        <h2 className="text-white text-2xl font-semibold mb-6">Dashboard</h2>
        <nav>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:text-white block mb-4 flex items-center">
            <i className="fas fa-users mr-2"></i> Groups
          </button>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600">
            {sidebarOpen ? "✖" : "☰"}
          </button>
          <h2 className="text-2xl font-bold">Group Management</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            Sign Out
          </button>
        </header>

        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold mb-4">Groups</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            +
          </button>
        </div>

        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <div>
                <h4 className="font-bold">{group.name}</h4>
                <p>Creator ID: {group.createdBy}</p>
                <p>
                  Start Date: {new Date(group.startDate).toLocaleDateString()}
                </p>
                <p>End Date: {new Date(group.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setEditGroupId(group.id);
                    setEditGroupName(group.name);
                    setEditCreatorId(group.creatorId);
                    setEditStartDate(group.startDate);
                    setEditEndDate(group.endDate);
                    setShowEditModal(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition">
                  Edit
                </button>
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition ml-2">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Group</h3>
            <label className="block mb-2">
              Group Name:
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <label className="block mb-2">
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <label className="block mb-4">
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <button
              onClick={createGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Create Group
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="ml-2 bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Group</h3>
            <label className="block mb-2">
              Group Name:
              <input
                type="text"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <label className="block mb-2">
              Creator ID:
              <input
                type="number"
                value={editCreatorId}
                onChange={(e) => setEditCreatorId(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <label className="block mb-2">
              Start Date:
              <input
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <label className="block mb-4">
              End Date:
              <input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </label>
            <button
              onClick={updateGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Update Group
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="ml-2 bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDashboardComponent;
