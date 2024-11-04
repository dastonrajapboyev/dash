import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GroupDashboardComponent = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [creatorId, setCreatorId] = useState(0);
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

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        "http://52.53.242.81:7088/japan/edu/api/group/get/all/admin",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setGroups(data.object);
      } else {
        toast.error(`Error fetching groups: ${data.message}`);
      }
    } catch (error) {
      toast.error("Error fetching groups");
      console.error("Error fetching groups:", error);
    }
  };

  const createGroup = async () => {
    try {
      const response = await fetch(
        "http://52.53.242.81:7088/japan/edu/api/group/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creatorId,
            name: newGroupName,
            startDate,
            endDate,
          }),
        }
      );

      if (response.ok) {
        setNewGroupName("");
        setCreatorId(0);
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate(new Date().toISOString().split("T")[0]);
        fetchGroups();
        toast.success("Group created successfully!");
      } else {
        const data = await response.json();
        toast.error(`Error creating group: ${data.message}`);
      }
    } catch (error) {
      toast.error("Error creating group");
      console.error("Error creating group:", error);
    }
  };

  const updateGroup = async () => {
    try {
      console.log("Updating group:", {
        id: editGroupId,
        name: editGroupName,
        creatorId: editCreatorId,
        startDate: editStartDate,
        endDate: editEndDate,
      });

      const response = await fetch(
        `http://52.53.242.81:7088/japan/edu/api/group/update/${editGroupId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editGroupName,
            creatorId: editCreatorId,
            startDate: editStartDate,
            endDate: editEndDate,
          }),
        }
      );

      if (response.ok) {
        setEditGroupId(null);
        setEditGroupName("");
        setEditCreatorId(0);
        setEditStartDate("");
        setEditEndDate("");
        fetchGroups();
        toast.success("Group updated successfully!");
      } else {
        const data = await response.json();
        toast.error(`Error updating group: ${data.message}`);
        console.error("Update error:", data);
      }
    } catch (error) {
      toast.error("Error updating group");
      console.error("Error updating group:", error);
    }
  };

  const deleteGroup = async (id) => {
    try {
      const response = await fetch(
        `http://52.53.242.81:7088/japan/edu/api/group/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        fetchGroups();
        toast.success("Group deleted successfully!");
      } else {
        const data = await response.json();
        toast.error(`Error deleting group: ${data.message}`);
      }
    } catch (error) {
      toast.error("Error deleting group");
      console.error("Error deleting group:", error);
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
      {/* Toast Container */}
      <ToastContainer />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:static md:w-64`}>
        <h2 className="text-white text-2xl font-semibold mb-6">Dashboard</h2>
        <nav>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:text-white block mb-4 flex items-center">
            <i className="fas fa-users mr-2"></i> {/* Group icon */}
            Groups
          </button>
        </nav>
      </aside>

      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with burger menu and sign-out button */}
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600">
            {sidebarOpen ? (
              <span className="text-xl">✖</span> // X icon
            ) : (
              <span className="text-xl">&#9776;</span> // Burger icon
            )}
          </button>
          <h2 className="text-2xl font-bold">Group Management</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            Sign Out
          </button>
        </header>

        {/* Group Creation Form */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:space-x-4">
          <input
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full md:flex-grow border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Creator ID"
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
            className="w-full md:w-28 border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-36 border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-36 border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={createGroup}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Create Group
          </button>
        </div>

        {/* Group Update Form */}
        {editGroupId && (
          <div className="mb-6 space-y-4 md:space-y-0 md:flex md:space-x-4">
            <input
              type="text"
              placeholder="Edit Group Name"
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              className="w-full md:flex-grow border border-gray-300 rounded-md p-2"
            />
            <input
              type="number"
              placeholder="Edit Creator ID"
              value={editCreatorId}
              onChange={(e) => setEditCreatorId(e.target.value)}
              className="w-full md:w-28 border border-gray-300 rounded-md p-2"
            />
            <input
              type="date"
              value={editStartDate}
              onChange={(e) => setEditStartDate(e.target.value)}
              className="w-full md:w-36 border border-gray-300 rounded-md p-2"
            />
            <input
              type="date"
              value={editEndDate}
              onChange={(e) => setEditEndDate(e.target.value)}
              className="w-full md:w-36 border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={updateGroup}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
              Update Group
            </button>
            <button
              onClick={() => setEditGroupId(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
              Cancel
            </button>
          </div>
        )}

        {/* Group List */}
        <h3 className="text-xl font-semibold mb-4">Groups</h3>
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
    </div>
  );
};

export default GroupDashboardComponent;
