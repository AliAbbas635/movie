// src/AdminComponents/MovieStats.jsx
import React, { useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { MyContext } from '../../ContextApi/MyContext';

Chart.register(...registerables);

const MovieStats = () => {
  const { movieStats, FetchMovieStats } = useContext(MyContext);

  useEffect(() => {
    FetchMovieStats();
  }, []);

  // Return null or a loading message while movieStats is not available
  if (!movieStats) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: movieStats.map(stat => stat.genre), // Using 'genre' for the labels
    datasets: [
      {
        label: 'Number of Movies',
        data: movieStats.map(stat => stat.total), // Using 'total' for the data points
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Movie Genre Stats</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MovieStats;
