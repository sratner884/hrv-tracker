import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

const LOCAL_KEY = "hrvTrackerData";

function App() {
  const [data, setData] = useState([]);
  const [hrv, setHrv] = useState("");
  const [coffee, setCoffee] = useState("");
  const [alcohol, setAlcohol] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hrv) return;
    setData([
      ...data,
      {
        date: new Date().toISOString().split("T")[0],
        hrv: Number(hrv),
        coffee: Number(coffee) || 0,
        alcohol: Number(alcohol) || 0,
      },
    ]);
    setHrv("");
    setCoffee("");
    setAlcohol("");
  };

  // Chart data setup
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "HRV",
        data: data.map((d) => d.hrv),
        borderColor: "blue",
        fill: false,
        yAxisID: "y",
      },
      {
        label: "Coffee",
        data: data.map((d) => d.coffee),
        borderColor: "orange",
        fill: false,
        yAxisID: "y1",
      },
      {
        label: "Alcohol",
        data: data.map((d) => d.alcohol),
        borderColor: "red",
        fill: false,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: { display: true, text: "HRV" },
      },
      y1: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Coffee / Alcohol" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
      <h2>HRV Tracker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Today's HRV:
            <input
              type="number"
              value={hrv}
              onChange={(e) => setHrv(e.target.value)}
              required
              min="0"
              step="1"
            />
          </label>
        </div>
        <div>
          <label>
            Coffee (cups last night):
            <input
              type="number"
              value={coffee}
              onChange={(e) => setCoffee(e.target.value)}
              min="0"
              step="1"
            />
          </label>
        </div>
        <div>
          <label>
            Alcohol (drinks last night):
            <input
              type="number"
              value={alcohol}
              onChange={(e) => setAlcohol(e.target.value)}
              min="0"
              step="1"
            />
          </label>
        </div>
        <button type="submit">Add Entry</button>
      </form>

      <div style={{ marginTop: 32 }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <h3>History</h3>
      <ul>
        {data.map((d, i) => (
          <li key={i}>
            {d.date}: HRV {d.hrv}, Coffee {d.coffee}, Alcohol {d.alcohol}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;