import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

// Função auxiliar para formatar valores (Moeda ou Número)
const formatValue = (value, format) => {
  if (format === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  return new Intl.NumberFormat('pt-BR').format(value);
};

const KpiCards = ({ data }) => {
  return (
    // Usamos Grid para um layout responsivo dos cartões
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {data.map((kpi, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card 
            elevation={3} 
            sx={{ 
              borderLeft: `6px solid ${kpi.isPrimary ? '#007BC3' : '#FFCC00'}`, // Destaque na cor Bosch
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <CardContent>
              {/* Título da Métrica */}
              <Typography color="textSecondary" gutterBottom sx={{ fontSize: 14 }}>
                {kpi.title}
              </Typography>
              
              {/* Valor da Métrica */}
              <Typography 
                variant="h4" 
                component="div"
                sx={{ 
                  fontWeight: 'bold', 
                  color: kpi.isPrimary ? '#007BC3' : '#333' // Cor Bosch para o destaque
                }}
              >
                {formatValue(kpi.value, kpi.format)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiCards;
