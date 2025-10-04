import React, { useState, useEffect, useMemo } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Container, 
  Typography, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Grid,
  Card,
} from '@mui/material';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AverageIcon from '@mui/icons-material/Calculate';

// Constantes de cores da paleta fornecida
const COLOR_PALETTE = {
  primary: '#E20017', // Vermelho Bosch
  secondary: '#004B87', // Azul profundo
  background: '#DFE2E4', // Cinza Neve
  card: '#FFFFFF', // Branco
  textPrimary: '#31343A', // Cinza Chumbo
  textSecondary: '#737A80', // Cinza Médio
};

// Componente SVG com o caminho do logo Bosch fornecido pelo usuário
// O fill é configurado como branco (COLOR_PALETTE.card) para ter alto contraste no fundo secundário (cinza grafite).
const BoschLogoSVG = ({ size }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        role="img" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>Bosch icon</title>
        <path 
            fill={COLOR_PALETTE.card} // Cor branca (do tema) para a forma do logo
            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.996 5.374 18.626.004 12 0zm0 22.88C5.991 22.88 1.12 18.009 1.12 12S5.991 1.12 12 1.12 22.88 5.991 22.88 12c-.006 6.006-4.874 10.874-10.88 10.88zm4.954-18.374h-.821v4.108h-8.24V4.506h-.847a8.978 8.978 0 0 0 0 14.988h.846v-4.108h8.24v4.108h.822a8.978 8.978 0 0 0 0-14.988zM6.747 17.876a7.86 7.86 0 0 1 0-11.752v11.752zm9.386-3.635h-8.24V9.734h8.24v4.507zm1.12 3.61V6.124a7.882 7.882 0 0 1 0 11.727z"
        />
    </svg>
);


// Definição do Tema customizado
const boschTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLOR_PALETTE.primary,
    },
    secondary: {
      main: COLOR_PALETTE.secondary,
    },
    background: {
      default: COLOR_PALETTE.background,
      paper: COLOR_PALETTE.card,
    },
    text: {
      primary: COLOR_PALETTE.textPrimary,
      secondary: COLOR_PALETTE.textSecondary,
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 'bold',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
          }
        },
      },
    },
  },
});

// Definição das colunas da tabela
const COLUNAS = [
  { id: "dataVenda", label: "Data da Venda" },
  { id: "nomeCliente", label: "Nome do Cliente" },
  { id: "nomeProduto", label: "Nome do Produto" },
  { id: "quantidade", label: "Quantidade", align: "right" },
  { id: "valorUnitario", label: "V. Unitário", align: "right" },
  { id: "valorTotal", label: "V. Total", align: "right" },
];

// Função auxiliar para formatar valores (Moeda ou Número)
const formatValue = (value, format) => {
  if (format === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: "BRL",
    }).format(value);
  }
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Componente para um único Cartão KPI
const KpiCard = ({ title, value, format, icon, isPrimary, contrastMode }) => (
    <Card 
        elevation={contrastMode ? 10 : 3}
        sx={{ 
            p: 2, 
            textAlign: 'left',
            bgcolor: contrastMode ? COLOR_PALETTE.textPrimary : COLOR_PALETTE.card, // Fundo escuro em modo contraste
            color: contrastMode ? COLOR_PALETTE.card : COLOR_PALETTE.textPrimary, // Texto claro em modo contraste
            border: `1px solid ${contrastMode ? COLOR_PALETTE.primary : '#eee'}`,
            transition: 'all 0.3s',
            height: '100%',
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color={contrastMode ? 'inherit' : COLOR_PALETTE.textSecondary} sx={{ textTransform: 'uppercase' }}>
                {title}
            </Typography>
            <Box sx={{ color: isPrimary ? COLOR_PALETTE.primary : COLOR_PALETTE.secondary }}>
              {icon}
            </Box>
        </Box>
        <Typography 
            variant="h4" 
            component="div"
            sx={{ 
                fontWeight: 'bold', 
                color: isPrimary && !contrastMode ? COLOR_PALETTE.primary : (contrastMode ? COLOR_PALETTE.primary : 'inherit')
            }}
        >
            {formatValue(value, format)}
        </Typography>
    </Card>
);

// Componente Principal - App/Dashboard
export default function App() {
  const [vendas, setVendas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contrastMode, setContrastMode] = useState(false); 

  // -----------------------
  // FUNÇÕES DE DADOS E CÁLCULO
  // -----------------------
  useEffect(() => {
    // API URL de exemplo. ATUALIZADA para tentar conexão com seu backend no 3000.
    const API_URL = "http://localhost:3000/vendas"; 
    
    // Dados de FALLBACK (simulados) para garantir que a UI não quebre
    const fallbackVendas = [
        { id: 1, dataVenda: "2025-09-01", nomeCliente: "Cliente Alpha (Simulação)", nomeProduto: "Peça Específica", quantidade: 10, valorUnitario: 24.1, valorTotal: 241.0 },
        { id: 2, dataVenda: "2025-09-02", nomeCliente: "Empresa Beta (Simulação)", nomeProduto: "Serviço Mensal", quantidade: 20, valorUnitario: 69.0, valorTotal: 1380.0 },
        { id: 3, dataVenda: "2025-09-03", nomeCliente: "Revenda Gama (Simulação)", nomeProduto: "Sensor de Velocidade", quantidade: 30, valorUnitario: 11.09, valorTotal: 332.7 },
        { id: 4, dataVenda: "2025-09-04", nomeCliente: "Cliente Delta (Simulação)", nomeProduto: "Bateria Forte", quantidade: 40, valorUnitario: 3.11, valorTotal: 124.4 },
    ];
    
    const buscarVendas = async () => {
      try {
        setCarregando(true);
        
        // Tenta a chamada real ao backend (no seu ambiente local, isso deve funcionar)
        const response = await fetch(API_URL);

        if (!response.ok) {
            // Se a resposta não for 200 OK, lança um erro para cair no catch
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const vendasAPI = await response.json();
        
        // Mapeia a estrutura de dados (Ajuste se seu backend retornar outro formato!)
        // A estrutura abaixo assume que a API retorna um array de objetos, onde cada objeto tem dados aninhados (cliente/produto) e campos de total.
        const vendasFormatadas = vendasAPI.map((venda) => ({
            id: venda.idVenda || venda.id, // Suporte a 'idVenda' (Spring) ou 'id'
            dataVenda: venda.dataVenda,
            nomeCliente: venda.cliente ? venda.cliente.nome : 'N/A', // Proteção contra cliente null
            nomeProduto: venda.produto ? venda.produto.nome : 'N/A', // Proteção contra produto null
            quantidade: venda.quantidade,
            valorUnitario: venda.produto ? venda.produto.valorUnitario : 0,
            valorTotal: venda.valorTotalVenda || (venda.quantidade * (venda.produto ? venda.produto.valorUnitario : 0)), // Suporte a 'valorTotalVenda' (Spring) ou cálculo
        }));

        setVendas(vendasFormatadas);
        setErro(null); // Limpa o erro se a requisição for bem-sucedida
        
      } catch (e) {
        console.error("Erro ao buscar dados do backend:", e);
        // Em caso de falha, exibe o erro e usa o fallback.
        setErro(`❌ Erro ao conectar ao backend em ${API_URL}. Usando dados de simulação. Detalhes: ${e.message}`);
        setVendas(fallbackVendas);

      } finally {
        setCarregando(false);
      }
    };

    buscarVendas();
    // Removida a dependência de API_URL, pois ela é uma constante interna
  }, []); // Roda apenas uma vez ao montar o componente

  // Lógica de filtragem e cálculo de KPIs
  const vendasFiltradas = useMemo(() => {
    return vendas.filter(
      (venda) =>
        venda.nomeCliente.toLowerCase().includes(termoBusca.toLowerCase()) ||
        venda.nomeProduto.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }, [vendas, termoBusca]);
  
  const kpiData = useMemo(() => {
      // KPIs calculados com base nas vendas filtradas
      const totalVendas = vendasFiltradas.reduce((acc, venda) => acc + (venda.valorTotal || 0), 0);
      const totalQuantidade = vendasFiltradas.reduce((acc, venda) => acc + (venda.quantidade || 0), 0);
      const ticketMedio = vendasFiltradas.length > 0 ? totalVendas / vendasFiltradas.length : 0;

      return [
        { 
            title: "Valor Total de Vendas", 
            value: totalVendas, 
            format: "currency", 
            icon: <AttachMoneyIcon />,
            isPrimary: true 
        },
        { 
            title: "Ticket Médio", 
            value: ticketMedio, 
            format: "currency", 
            icon: <AverageIcon />,
            isPrimary: false 
        },
        { 
            title: "Itens Vendidos", 
            value: totalQuantidade, 
            format: "number", 
            icon: <ShoppingCartIcon />,
            isPrimary: false 
        },
      ];
  }, [vendasFiltradas]);

  // Larguras da Sidebar
  const drawerWidth = 240;
  const closedDrawerWidth = 80; // Largura do ícone no canto

  // ************ RENDERIZAÇÃO ************
  return (
    <ThemeProvider theme={boschTheme}>
      <CssBaseline />
      
      {/* Container principal com o fundo Bosch Cinza Neve */}
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLOR_PALETTE.background }}>
        
        {/* SIDEBAR RETRÁTIL (Header Lateral) */}
        <Box 
          component="nav" 
          sx={{ width: isSidebarOpen ? drawerWidth : closedDrawerWidth, flexShrink: 0 }}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <Paper 
            elevation={10} 
            sx={{
              width: isSidebarOpen ? drawerWidth : closedDrawerWidth,
              transition: 'width 0.3s ease',
              position: 'fixed',
              height: '100%', // Garante 100% da altura do sidebar
              bgcolor: COLOR_PALETTE.secondary, // Cinza Grafite
              zIndex: 1200, 
            }}
          >
            {/* Ícone Bosch (Topo) */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', height: '64px' }}>
                <BoschLogoSVG size={40} />
                
                {isSidebarOpen && (
                    <Typography 
                        variant="h6" 
                        noWrap 
                        sx={{ ml: 2, fontWeight: 'bold', color: COLOR_PALETTE.card, textTransform: 'uppercase' }}
                    >
                        Bosch
                    </Typography>
                )}
            </Box>

            {/* Itens de Navegação */}
            <List sx={{ mt: 2 }}>
                {[{ text: 'Dashboard', icon: <DashboardIcon /> }, { text: 'Relatórios', icon: <BarChartIcon /> }, { text: 'Configurações', icon: <SettingsIcon /> }].map((item, index) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton sx={{ justifyContent: isSidebarOpen ? 'initial' : 'center' }}>
                            <ListItemIcon sx={{ minWidth: isSidebarOpen ? 40 : 'auto', color: COLOR_PALETTE.card }}>
                                {item.icon}
                            </ListItemIcon>
                            {isSidebarOpen && (
                                <ListItemText 
                                    primary={item.text} 
                                    sx={{ opacity: isSidebarOpen ? 1 : 0, color: COLOR_PALETTE.card }} 
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
          </Paper>
        </Box>

        {/* BOTÃO DE ACESSIBILIDADE FLUTUANTE (Canto superior direito) */}
        <Tooltip title={contrastMode ? "Desativar Alto Contraste" : "Ativar Alto Contraste (Acessibilidade)"}>
            <IconButton 
                onClick={() => setContrastMode(!contrastMode)}
                sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    // CORREÇÃO: 'COLOR_PALABackendTTE' foi alterado para 'COLOR_PALETTE'
                    bgcolor: contrastMode ? COLOR_PALETTE.primary : COLOR_PALETTE.secondary, 
                    color: COLOR_PALETTE.card,
                    '&:hover': {
                        bgcolor: contrastMode ? COLOR_PALETTE.secondary : COLOR_PALETTE.primary,
                    },
                    zIndex: 1300,
                }}
            >
                <AccessibilityNewIcon />
            </IconButton>
        </Tooltip>

        {/* CONTEÚDO PRINCIPAL (Centralizado) */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, ml: `${isSidebarOpen ? drawerWidth : closedDrawerWidth}px`, transition: 'margin-left 0.3s ease' }}
        >
          <Container maxWidth="lg" sx={{ pt: 1 }}>
            
            {/* Título Principal */}
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: COLOR_PALETTE.textPrimary, mb: 4 }}
            >
              Relatório de Vendas
            </Typography>
            
            {/* 3. CARTÕES DE KPI */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: COLOR_PALETTE.textSecondary, mb: 3 }}>
                    Métricas Chave ({vendasFiltradas.length} Registros Exibidos)
                </Typography>
                <Grid container spacing={3}>
                    {kpiData.map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <KpiCard {...kpi} contrastMode={contrastMode} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            
            {/* 4. DETALHES DA TABELA */}
            <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "medium", color: COLOR_PALETTE.textPrimary, mb: 2 }}
            >
                Detalhes das Transações
            </Typography>

            {/* Campo de Busca (Área Selecionada) */}
            <Box sx={{ mb: 3 }}>
                <TextField
                  label="Buscar por Cliente ou Produto"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  sx={{ 
                    bgcolor: COLOR_PALETTE.card,
                    '& fieldset': { borderColor: COLOR_PALETTE.secondary + '!important' } // Borda Grafite
                  }}
                />
            </Box>


            {/* Exibição condicional de estado */}
            {carregando ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                    <CircularProgress color="primary" />
                    <Typography sx={{ ml: 2, color: COLOR_PALETTE.textSecondary }}>
                        Carregando dados...
                    </Typography>
                </Box>
            ) : erro && vendas.length === 0 ? (
                <Alert severity="warning" sx={{ bgcolor: COLOR_PALETTE.card }}>
                    {erro} Exibindo dados de simulação.
                </Alert>
            ) : (
                /* Tabela de Vendas */
                <Paper elevation={contrastMode ? 10 : 3} sx={{ overflow: 'hidden' }}> 
                    <TableContainer>
                        <Table stickyHeader>
                            {/* Cabeçalho da Tabela */}
                            <TableHead>
                                <TableRow sx={{ bgcolor: contrastMode ? COLOR_PALETTE.textPrimary : '#f5f5f5' }}>
                                    {COLUNAS.map((coluna) => (
                                        <TableCell
                                            key={coluna.id}
                                            align={coluna.align || "left"}
                                            sx={{ 
                                                fontWeight: "bold", 
                                                color: contrastMode ? COLOR_PALETTE.card : COLOR_PALETTE.textPrimary, 
                                                borderBottom: '1px solid ' + (contrastMode ? COLOR_PALETTE.primary : '#ddd') 
                                            }}
                                        >
                                            {coluna.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            {/* Corpo da Tabela */}
                            <TableBody>
                                {vendasFiltradas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={COLUNAS.length} align="center" sx={{ color: COLOR_PALETTE.textSecondary }}>
                                            Nenhuma venda encontrada para o termo "{termoBusca}".
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendasFiltradas.map((venda) => (
                                        <TableRow hover key={venda.id}>
                                            {COLUNAS.map((coluna) => {
                                                const valor = venda[coluna.id];
                                                
                                                // Formatação de valores
                                                let valorFormatado = valor;
                                                if (coluna.id.includes("valor")) {
                                                    valorFormatado = formatValue(valor, "currency");
                                                } else if (coluna.id === "quantidade") {
                                                    valorFormatado = formatValue(valor, "number");
                                                } else if (coluna.id === "dataVenda") {
                                                    valorFormatado = new Date(valor).toLocaleDateString("pt-BR");
                                                }

                                                return (
                                                    <TableCell
                                                        key={coluna.id}
                                                        align={coluna.align || "left"}
                                                        sx={{ color: contrastMode ? COLOR_PALETTE.textSecondary : COLOR_PALETTE.textPrimary }}
                                                    >
                                                        {valorFormatado}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
