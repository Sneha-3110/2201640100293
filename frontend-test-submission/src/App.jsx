import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ShortenerPage from './pages/ShortnerPage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './pages/RedirectPage';
import { Typography } from '@mui/material';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ShortenerPage />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>
      <Route path="/:shortCode" element={<RedirectPage />} />
      <Route path="*" element={<Typography variant="h4" align="center" mt={5}>404 - Not Found</Typography>} />
    </Routes>
  );
}

export default App;