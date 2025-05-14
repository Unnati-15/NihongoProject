import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const fetchNotifications = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/notifications/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    axios
      .post(`http://localhost:8000/api/notifications/${id}/mark_as_read/`, {}, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          )
        );
      });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const toggleDropdown = () => setOpen(!open);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="btn btn-ghost btn-circle" onClick={toggleDropdown}>
        <div className="indicator">
          <FiBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="badge badge-error badge-xs indicator-item">{unreadCount}</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 shadow-lg rounded-box z-50 p-4 max-h-[70vh] overflow-y-auto border border-base-300  mt-80">
          <h3 className="font-bold text-lg text-gray-500 mb-2">Notifications</h3>
          {loading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-ring loading-md"></span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="alert alert-info text-sm">No notifications found.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded p-3 mb-2 text-sm ${n.is_read ? "bg-base-200" : "bg-base-100 border-l-4 border-info"}`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-gray-500 font-bold">{n.message}</p>
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="btn btn-xs btn-outline btn-info ml-2"
                    >
                      Mark
                    </button>
                  )}
                </div>
                <div className="text-xs text-right text-gray-500 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
