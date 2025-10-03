import Dashboard from './components/Dashboard'; // Importa o componente que criamos
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Para customizar o tema

// Define o tema customizado para se aproximar das cores da Bosch
const boschTheme = createTheme({
  palette: {
    primary: {
      main: '#007BC3', // O Azul Bosch (cor principal)
    },
    secondary: {
      main: '#FFCC00', // Um amarelo/laranja que pode ser usado para destaque
    },
  },
  typography: {
    fontFamily: [
      'Roboto', // Fonte padrão do Material UI, clean e profissional
      'sans-serif',
    ].join(','),
  },
});

function App() {
  // O ThemeProvider envolve todo o dashboard para aplicar as cores customizadas
  return (
    <ThemeProvider theme={boschTheme}> 
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;