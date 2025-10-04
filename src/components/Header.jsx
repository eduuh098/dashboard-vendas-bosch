import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business'; // Ícone para representar a Bosch

const Header = () => {
  return (
    // AppBar com a cor primária (Azul Bosch) definida no ThemeProvider do App.jsx
    <AppBar position="static" elevation={0} sx={{ height: '64px', justifyContent: 'center' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1280, width: '100%', margin: '0 auto' }}>
        
        {/* Logo/Título da Aplicação */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 'bold', letterSpacing: 1 }}
          >
            Bosch
          </Typography>
        </Box>
        
        {/* Navegação simples */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" sx={{ fontWeight: 'bold' }}>Dashboard</Button>
          <Button color="inherit">Relatórios</Button>
          <Button color="inherit">Configurações</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
