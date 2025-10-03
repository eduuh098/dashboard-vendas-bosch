import React, { useState, useEffect } from 'react'; // Importa React e hooks
import { // Importa componentes do Material UI
  Container, // Container para centralizar o conteúdo
  Typography, // Para textos (títulos, subtítulos)
  TextField, // Campo de busca
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, // Componentes da Tabela
  Paper, // Para dar um fundo e elevação à tabela
  CircularProgress, // Ícone de carregamento
  Alert, // Para exibir mensagens de erro
  Box, // Para organizar elementos
} from '@mui/material';

// Dados simulados para começar (você substituirá isso pela chamada ao backend)
const DADOS_SIMULADOS = [
    { id: 1, dataVenda: "2025-09-01", nomeCliente: "Botafogo", nomeProduto: "Vasco", quantidade: 10, valorUnitario: 24.10, valorTotal: 1000.00 },
    { id: 2, dataVenda: "2025-09-02", nomeCliente: "Botafogo 2", nomeProduto: "Vasco 2", quantidade: 20, valorUnitario: 69.00, valorTotal: 2000.00 },
    { id: 3, dataVenda: "2025-09-03", nomeCliente: "Botafogo 3", nomeProduto: "Vasco 3", quantidade: 30, valorUnitario: 11.09, valorTotal: 3000.00 },
    { id: 4, dataVenda: "2025-09-04", nomeCliente: "Botafogo 4", nomeProduto: "Vasco 4", quantidade: 40, valorUnitario: 3.11, valorTotal: 4000.00 },
];

// Definição das colunas da tabela
const COLUNAS = [
    { id: 'dataVenda', label: 'Data da Venda' },
    { id: 'nomeCliente', label: 'Nome do Cliente' },
    { id: 'nomeProduto', 'label': 'Nome do Produto' },
    { id: 'quantidade', label: 'Quantidade', align: 'right' },
    { id: 'valorUnitario', label: 'Valor Unitário', align: 'right' },
    { id: 'valorTotal', label: 'Valor Total', align: 'right' },
];

export default function Dashboard() {
  // Estados do componente
  const [vendas, setVendas] = useState([]); // Armazena todos os dados de vendas
  const [termoBusca, setTermoBusca] = useState(''); // Armazena o texto digitado na busca
  const [carregando, setCarregando] = useState(true); // Indica se os dados estão sendo carregados
  const [erro, setErro] = useState(null); // Armazena qualquer erro de requisição

  // Hook useEffect para buscar os dados o componente
  useEffect(() => {
    // Função assíncrona para simular ou fazer a requisição
    const buscarVendas = async () => {
      try {
        setCarregando(true); // Inicia o estado de carregamento

        // *************** PONTO DE INTEGRAÇÃO COM O BACKEND ***************
        // COMENTAR A LINHA ABAIXO E DESCOMENTAR A SEÇÃO 'REQUISIÇÃO AO BACKEND' PARA USAR O BACKEND
        
        // SIMULAÇÃO: Espera 1 segundo para simular o carregamento da rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVendas(DADOS_SIMULADOS); // Define os dados simulados
        
        /*
        // REQUISIÇÃO AO BACKEND
        const resposta = await fetch('http://localhost:3000/vendas'); // Substitua pela sua URL
        if (!resposta.ok) {
          throw new Error('Falha ao buscar os dados: ' + resposta.statusText);
        }
        const dados = await resposta.json();
        setVendas(dados);
        */ 
        
      } catch (e) {
        // Captura e armazena o erro
        setErro(e.message);
        console.error("Erro ao buscar vendas:", e);
      } finally {
        setCarregando(false); // Finaliza o estado de carregamento
      }
    };

    buscarVendas(); // Chama a função de busca
  }, []); // O array vazio [] garante que o useEffect rode apenas na montagem

  // Lógica para filtrar as vendas (Funcionalidade BÔNUS)
  const vendasFiltradas = vendas.filter(venda => 
    // Converte tudo para minúsculo para a busca ser insensível a maiúsculas/minúsculas
    venda.nomeCliente.toLowerCase().includes(termoBusca.toLowerCase()) ||
    venda.nomeProduto.toLowerCase().includes(termoBusca.toLowerCase())
  );

  // ************ INÍCIO DA RENDERIZAÇÃO (O QUE SERÁ EXIBIDO NA TELA) ************
  return (
    // O Container centraliza o conteúdo e aplica margem padrão
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Título do Dashboard - Estilo Bosch (clean) */}
      <Typography variant="h4" gutterBottom component="div" 
          sx={{ fontWeight: 'bold', color: '#007BC3' }}> 
          {/* A cor #007BC3 é o 'Bosch Blue' */}
          Dashboard de Vendas - BOSCH
      </Typography>
      
      {/* Box para organizar o campo de busca */}
      <Box sx={{ mb: 3 }}>
        {/* Campo de Busca (TextField) */}
        <TextField
          label="Buscar por Cliente ou Produto"
          variant="outlined"
          fullWidth // Ocupa a largura total
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)} // Atualiza o estado ao digitar
        />
      </Box>

      {/* Exibição condicional de estado (Carregando, Erro ou Tabela) */}
      {carregando ? (
        // Se estiver carregando, mostra o indicador
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress sx={{ color: '#007BC3' }} /> 
          <Typography sx={{ ml: 2, color: '#555' }}>Carregando dados...</Typography>
        </Box>
      ) : erro ? (
        // Se houver erro, mostra o alerta
        <Alert severity="error">
          Erro ao carregar os dados de vendas: {erro}
        </Alert>
      ) : (
        // Se os dados carregaram, exibe a Tabela
        <Paper elevation={3}> {/* elevation=3 adiciona uma sombra sutil */}
          <TableContainer>
            <Table stickyHeader>
              {/* Cabeçalho da Tabela */}
              <TableHead>
                <TableRow sx={{ bgcolor: '#F0F0F0' }}> {/* Fundo levemente cinza */}
                  {COLUNAS.map((coluna) => (
                    <TableCell
                      key={coluna.id}
                      align={coluna.align || 'left'}
                      sx={{ fontWeight: 'bold', color: '#333' }}
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
                        <TableCell colSpan={COLUNAS.length} align="center">
                            Nenhuma venda encontrada para o termo "{termoBusca}".
                        </TableCell>
                    </TableRow>
                ) : (
                    vendasFiltradas.map((venda) => (
                      <TableRow hover key={venda.id}>
                        {/* Mapeia as colunas para exibir os dados correspondentes */}
                        {COLUNAS.map((coluna) => {
                          const valor = venda[coluna.id];
                          // Formatação de valores (moeda, números)
                          let valorFormatado = valor;
                          if (coluna.id === 'valorUnitario' || coluna.id === 'valorTotal') {
                            valorFormatado = new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(valor);
                          } else if (coluna.id === 'quantidade') {
                             valorFormatado = new Intl.NumberFormat('pt-BR').format(valor);
                          } else if (coluna.id === 'dataVenda') {
                              // Simples formatação de data (opcional)
                              valorFormatado = new Date(valor).toLocaleDateString('pt-BR');
                          }

                          return (
                            <TableCell key={coluna.id} align={coluna.align || 'left'}>
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
  );
}