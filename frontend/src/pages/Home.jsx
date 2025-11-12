// src/pages/Home.jsx
import React from "react";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 12C35.866 12 39 15.134 39 19C39 22.866 35.866 26 32 26C28.134 26 25 22.866 25 19C25 15.134 28.134 12 32 12Z" fill="white"/>
                  <path d="M24 34C21.7909 34 20 35.7909 20 38V42H44V38C44 35.7909 42.2091 34 40 34H24Z" fill="white"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Enchanted Health</h2>
                <p className="text-sm text-gray-500">Your personal healthcare dashboard</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="font-medium text-gray-800">{user?.firstname || "Guest"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-100 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Appointments</h3>
              <p className="text-sm text-gray-600">View and manage upcoming appointments.</p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium">
                  View Appointments
                </button>
              </div>
            </div>

            <div className="p-6 border border-gray-100 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Health Records</h3>
              <p className="text-sm text-gray-600">Access medical records and summaries.</p>
              <div className="mt-4">
                <button className="px-4 py-2 border border-indigo-200 rounded-lg font-medium">
                  View Records
                </button>
              </div>
            </div>

            <div className="p-6 border border-gray-100 rounded-xl md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="flex gap-3 mt-3 flex-wrap">
                <button className="px-4 py-2 bg-white border rounded-lg shadow-sm">Book Appointment</button>
                <button className="px-4 py-2 bg-white border rounded-lg shadow-sm">Message Doctor</button>
                <button className="px-4 py-2 bg-white border rounded-lg shadow-sm">Upload Report</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Quick Summary</h4>
            <p className="text-sm text-gray-500">Health score</p>
            <div className="mt-4">
              <div className="h-3 rounded-full bg-indigo-100 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              </div>
            </div>

            <div className="mt-6 text-left">
              <p className="text-xs text-gray-500 mb-2">Next Appointment</p>
              <div className="text-sm font-medium">No upcoming appointments</div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => { localStorage.removeItem("user"); window.location.href = "/login"; }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
