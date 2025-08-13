import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Results() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "white" } },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.2)" } },
      y: { ticks: { color: "white", stepSize: 10 }, beginAtZero: true, grid: { color: "rgba(255,255,255,0.2)" } },
    },
  };

  useEffect(() => {
    // 🎯 Fetch initial results
    fetch("http://localhost:5000/vote/results")
      .then(res => res.json())
      .then(data => {
        const labels = Object.keys(data);
        const votes = Object.values(data).map(v => Number(v));

        setChartData({
          labels,
          datasets: [
            {
              label: "Votes",
              data: votes,
              backgroundColor: [
                "rgba(96, 12, 240, 0.8)",
                "rgba(6, 97, 157, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
              ],
              borderColor: [
                "rgba(96, 12, 240, 1)",
                "rgba(6, 97, 157, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(err => {
        console.error("Error fetching initial results:", err);
        setError("Unable to load initial results.");
      });

    // 🎯 Socket.IO live updates
    let socket;
    try {
      socket = io("http://localhost:5000", { transports: ["websocket"] });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError("Unable to connect to server.");
      });

      socket.on("update_results", (results) => {
        if (!results || typeof results !== "object") return;

        const labels = Object.keys(results);
        const votes = Object.values(results).map(v => Number(v));

        setChartData((prev) => ({
          labels,
          datasets: [
            {
              label: "Votes",
              data: votes,
              backgroundColor: [
                "rgba(96, 12, 240, 0.8)",
                "rgba(6, 97, 157, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
              ],
              borderColor: [
                "rgba(96, 12, 240, 1)",
                "rgba(6, 97, 157, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }));
      });
    } catch (err) {
      console.error("Error initializing socket:", err);
      setError("Error initializing live results.");
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="p-12 min-h-screen bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 text-white">
      <h1 className="text-3xl font-bold text-center mb-12">
        Live Election Results
      </h1>

      {error && (
        <p className="text-center text-red-400 font-semibold mb-4">{error}</p>
      )}

      {!chartData || chartData.labels.length === 0 ? (
        <p className="text-center text-gray-200">
          Waiting for voting data...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-black">
              Vote Count (Bar Chart)
            </h2>
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-black">
              Vote Distribution (Pie Chart)
            </h2>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
