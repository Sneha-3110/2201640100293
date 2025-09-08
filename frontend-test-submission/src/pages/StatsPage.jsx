import React, { useState, useEffect } from 'react';
import { getAllUrls } from '../services/urlService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Link,
  Collapse, Box, IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Row = ({ url }) => {
  const [open, setOpen] = useState(false);
  const shortUrl = `http://localhost:3000/${url.shortCode}`;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Link href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</Link>
        </TableCell>
        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link href={url.longUrl} target="_blank" rel="noopener noreferrer">{url.longUrl}</Link>
        </TableCell>
        <TableCell align="center">{url.clicks.length}</TableCell>
        <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
        <TableCell>{new Date(url.expiresAt).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click History
              </Typography>
              {url.clicks.length > 0 ? (
                <Table size="small" aria-label="click details">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {url.clicks.map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.source}</TableCell>
                        <TableCell>{click.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No clicks are done.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const StatsPage = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(getAllUrls());
  }, []);

  if (urls.length === 0) {
    return <Typography variant="h6" align="center">No short URLs found. Create first!</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell align="center">Clicks</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Expires At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((url) => (
            <Row key={url.id} url={url} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StatsPage;