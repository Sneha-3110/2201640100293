import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import LiquidEther from '../reactComponents/LiquidEther/LiquidEther';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth:'100vw' }}>
      
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <LinkIcon sx={{ mr: 2 , fontSize:'2 rem'}} />
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: 'cursive' }}>
              Minify URL
            </Typography>
            <Button color="inherit" component={RouterLink} to="/" >
              Shorten
            </Button>
            <Button color="inherit" component={RouterLink} to="/stats">
              Statistics
            </Button>
          </Toolbar>
        </AppBar>

        <Container
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 12,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '1200px' }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
