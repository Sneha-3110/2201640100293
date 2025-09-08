import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, IconButton, Link } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { createShortUrl } from '../services/urlService';
import logger from '../services/logger';

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const ShortenerPage = () => {
  const [inp, setInp] = useState([{ longUrl: '', validity: '', customShortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (index, event) => {
    const values = [...inp];
    values[index][event.target.name] = event.target.value;
    setInp(values);
  };

  const handleAddInput = () => {
    if (inp.length < 5) {
      setInp([...inp, { longUrl: '', validity: '', customShortcode: '' }]);
    }
  };

  const handleRemoveInput = (index) => {
    const values = [...inp];
    values.splice(index, 1);
    setInp(values);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setResults([]);

    const creationPromises = inp.map(input => {
      if (!input.longUrl || !URL_REGEX.test(input.longUrl)) {
        throw new Error(`Invalid URL format provided: ${input.longUrl}`);
      }
      if (input.validity && !/^\d+$/.test(input.validity)) {
        throw new Error('Time must be an integer in minutes.');
      }

      return createShortUrl({
        longUrl: input.longUrl,
        customShortcode: input.customShortcode || null,
        validity: input.validity ? parseInt(input.validity, 10) : 30, 
      });
    });

    Promise.all(creationPromises)
      .then(newUrls => {
        setResults(newUrls);
      })
      .catch(err => {
        logger.error('Error creating short URLs', err);
        setError(err.message);
      });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Shorter URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        {inp.map((input, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              name="longUrl"
              label={`Original URL #${index + 1}`}
              variant="outlined"
              sx={{width: 700}}
              required
              value={input.longUrl}
              onChange={event => handleInputChange(index, event)}
            />
            <TextField
              name="validity"
              label="Valid for(mins)"
              variant="outlined"
              sx={{ width: 150 }}
              value={input.validity}
              placeholder="30"
              onChange={event => handleInputChange(index, event)}
            />
            <TextField
              name="customShortcode"
              label="Custom Code"
              variant="outlined"
              sx={{ width: 180 }}
              value={input.customShortcode}
              onChange={event => handleInputChange(index, event)}
            />
            <IconButton onClick={() => handleRemoveInput(index)} disabled={inp.length === 1}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddInput}
            disabled={inp.length >= 5}
          >
            Add URL
          </Button>
          <Button type="submit" variant="contained" color="primary" size="large">
            Short URLs
          </Button>
        </Box>
      </form>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Results:</Typography>
          {results.map((result, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
              <Typography><strong>Original:</strong> {result.longUrl}</Typography>
              <Typography>
                <strong>Short:</strong>{' '}
                <Link href={`/${result.shortCode}`} target="_blank" rel="noopener noreferrer">
                  {`http://localhost:3000/${result.shortCode}`}
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expires on: {new Date(result.expiresAt).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ShortenerPage;