import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlByShortcode, recordClick } from '../services/urlService';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import logger from '../services/logger';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = () => {
      const urlData = getUrlByShortcode(shortCode);

      if (!urlData) {
        logger.warn(`Redirect failed: Shortcode not found - ${shortCode}`);
        setError('This short URL does not exist.');
        return;
      }
      
      const isExpired = new Date() > new Date(urlData.expiresAt);
      if (isExpired) {
        logger.warn(`Redirect failed: URL expired - ${shortCode}`);
        setError('This short URL has expired.');
        return;
      }

      recordClick(shortCode);
      logger.info(`Redirecting ${shortCode} to ${urlData.longUrl}`);
      window.location.href = urlData.longUrl;
    };

    handleRedirect();
  }, [shortCode]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Redirecting...</Typography>
    </Box>
  );
};

export default RedirectPage;