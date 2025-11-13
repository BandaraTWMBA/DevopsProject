// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M32 12C35.866 12 39 15.134 39 19C39 22.866 35.866 26 32 26C28.134 26 25 22.866 25 19C25 15.134 28.134 12 32 12Z" fill="white"/>
                <path d="M24 34C21.7909 34 20 35.7909 20 38V42H44V38C44 35.7909 42.2091 34 40 34H24Z" fill="white"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">HEALTHCARE</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{user.firstname || "User"}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Good Morning, {user.firstname || "Lionel"}</h1>
              <p className="text-gray-600">Lunch do some workout today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Calories */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Calories</h3>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-gray-800">1428</p>
                  <p className="text-sm text-gray-600">104</p>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Heart Rate</h3>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-gray-800">9,886</p>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">8.5</span>
                    <span className="text-sm text-gray-600">7.5</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Strengths</h3>
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <span key={num} className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-medium rounded">
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity Tracking */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Activity Tracking</h3>
                <div className="space-y-1">
                  {[100, 80, 60, 40, 30].map((percent, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 24 Length & Running Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 24 Length */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">24 length</h3>
                <div className="space-y-2">
                  {[0.5, 10.5, 15.5, 20.5, 25.5, 30.5].map((length, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">Length {index + 1}</span>
                      <span className="font-medium text-gray-800">{length}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Running with resistance band */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Running with resistance band</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">12 km</p>
                    <p className="text-sm text-gray-600">Today's distance</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">428 km</p>
                    <p className="text-sm text-gray-600">Total distance covered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {user.firstname ? user.firstname.charAt(0) : "L"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{user.firstname || "Lionel"} Messi</h2>
                  <p className="text-gray-600">Shortcuts</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-bold text-gray-800">75 kg</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-bold text-gray-800">180 cm</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">AEP</p>
                  <p className="font-bold text-gray-800">26 yrs</p>
                </div>
              </div>

              {/* Calendar */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">December 2022</h3>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(day => (
                    <div 
                      key={day} 
                      className={`p-2 rounded-lg text-sm ${
                        day === 13 ? "bg-blue-500 text-white" : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sideboard */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sideboard</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800">Scheduled</p>
                  <p className="text-sm text-gray-600">Very all</p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-800">Cardio Workshop</p>
                  <p className="text-sm text-gray-600">Save others your muscles</p>
                  <p className="text-xs text-gray-500 mt-1">1/2:1 Dec</p>
                </div>
              </div>
            </div>

            {/* Diet Plan */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Diet Plan</h3>
              <div className="space-y-4">
                {/* Fruits only */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <p className="font-medium text-gray-800">Fruits only</p>
                  <p className="text-sm text-gray-600 mt-1">It contains most water content</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">(Buy 1)</span>
                    <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg">
                      Select
                    </button>
                  </div>
                </div>

                {/* Vegetables only */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="font-medium text-gray-800">Vegetables only</p>
                  <p className="text-sm text-gray-600 mt-1">It contains most water content</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">(Buy 2)</span>
                    <button className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg">
                      Select
                    </button>
                  </div>
                </div>

                {/* Fruits and Vegetables */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="font-medium text-gray-800">Fruits and Vegetables</p>
                  <p className="text-sm text-gray-600 mt-1">Fresh</p>
                  <p className="text-sm text-gray-600">It contains most water content</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">(Buy 3)</span>
                    <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cardio Workshop */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Cardio Workshop</h3>
              <p className="text-sm text-gray-600">Save others your muscles</p>
              <p className="text-xs text-gray-500 mt-2">1/2:1 Dec</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}