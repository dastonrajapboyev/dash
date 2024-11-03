import React, { useState, useEffect } from "react";

const GroupDashboardComponent = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [creatorId, setCreatorId] = useState(0); // Set this as needed
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  console.log(token, " toke");

  // Gruppalarni olish
  const fetchGroups = async () => {
    try {
      // Mahalliy saqlovdan JWT tokenini oling
      const token = localStorage.getItem("token"); // Token saqlangan joyni to'g'rilang

      console.log("tok", token);

      const response = await fetch(
        "https://197f-84-54-71-79.ngrok-free.app/japan/edu/api/group/get/all/admin",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // JWT tokenini yuborish
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setGroups(data.object); // Agar muvaffaqiyatli bo'lsa, guruhlar ro'yxatini oling
      } else {
        console.error("Guruhlarni olishda xato:", data.message); // Xato haqida xabar bering
      }
    } catch (error) {
      console.error("Gruppalarni olishda xatolik:", error); // Umumiy xatolarni ko'rsatish
    }
  };

  // Group qo'shish
  const createGroup = async () => {
    try {
      const response = await fetch(
        "https://197f-84-54-71-79.ngrok-free.app/japan/edu/api/group/create", // URL to create groups
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creatorId: creatorId, // You can update this based on your application logic
            name: newGroupName,
            startDate: startDate,
            endDate: endDate,
          }),
        }
      );
      if (response.ok) {
        setNewGroupName("");
        setCreatorId(0); // Reset as needed
        setStartDate(new Date().toISOString().split("T")[0]); // Reset to today
        setEndDate(new Date().toISOString().split("T")[0]); // Reset to today
        fetchGroups(); // Yangilangan ro'yxatni olish
      }
    } catch (error) {
      console.error("Group qo'shishda xatolik:", error);
    }
  };

  // Groupni yangilash
  const updateGroup = async () => {
    try {
      const response = await fetch(
        `https://197f-84-54-71-79.ngrok-free.app/japan/edu/api/group/${editGroupId}`, // Ensure this is the correct URL for updating groups
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editGroupName }),
        }
      );
      if (response.ok) {
        setEditGroupId(null);
        setEditGroupName("");
        fetchGroups(); // Yangilangan ro'yxatni olish
      }
    } catch (error) {
      console.error("Group yangilashda xatolik:", error);
    }
  };

  // Groupni o'chirish
  const deleteGroup = async (id) => {
    try {
      const response = await fetch(
        `https://197f-84-54-71-79.ngrok-free.app/japan/edu/api/group/${id}`, // Ensure this is the correct URL for deleting groups
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchGroups(); // Yangilangan ro'yxatni olish
      }
    } catch (error) {
      console.error("Groupni o'chirishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Group Management</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Yangi group nomi"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Creator ID"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <button
          onClick={createGroup}
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition">
          Qo'shish
        </button>
      </div>

      <ul className="space-y-4">
        {groups.map((group) => (
          <li
            key={group.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-md shadow-sm">
            {editGroupId === group.id ? (
              <>
                <input
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mr-2 flex-grow"
                />
                <button
                  onClick={updateGroup}
                  className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition">
                  Saqlash
                </button>
                <button
                  onClick={() => setEditGroupId(null)}
                  className="bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400 transition">
                  Bekor qilish
                </button>
              </>
            ) : (
              <>
                <span className="flex-grow">{group.name}</span>
                <div>
                  <button
                    onClick={() => {
                      setEditGroupId(group.id);
                      setEditGroupName(group.name);
                    }}
                    className="bg-yellow-500 text-white rounded-md px-3 py-1 hover:bg-yellow-600 transition mr-2">
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600 transition">
                    O'chirish
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDashboardComponent;
