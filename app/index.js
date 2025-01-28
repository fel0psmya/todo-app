const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Ajustar o caminho para o diretório de dados
const dataDir = path.join(__dirname, '..', 'data');
const dataFilePath = path.join(dataDir, 'tarefas.json');

// Para ler os dados enviados no corpo da requisição
app.use(express.json());

let tarefas = [];

// Garantir que o diretório de dados exista
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Carregar tarefas do arquivo
const loadTarefas = () => {
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    tarefas = JSON.parse(data);
  }
};

// Salvar tarefas no arquivo
const saveTarefas = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(tarefas, null, 2));
};

// Carregar tarefas ao iniciar o servidor
loadTarefas();

// Rota para obter as tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});

// Rota para obter uma tarefa específica
app.get('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    res.json(tarefa);
  } else {
    res.status(404).send('Tarefa não encontrada');
  }
});

// Rota para adicionar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const tarefa = req.body.tarefa;
  if (tarefa) {
    const novaTarefa = { id: tarefas.length, tarefa: tarefa };
    tarefas.push(novaTarefa);
    saveTarefas(); // Salvar tarefas após adicionar
    res.status(201).send('Tarefa adicionada');
  } else {
    res.status(400).send('Tarefa inválida');
  }
});

// Rota para atualizar uma tarefa
app.put('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const novaTarefa = req.body.tarefa;
  const tarefaIndex = tarefas.findIndex(t => t.id === id);
  if (tarefaIndex !== -1 && novaTarefa) {
    tarefas[tarefaIndex].tarefa = novaTarefa;
    saveTarefas(); // Salvar tarefas após atualizar
    res.send('Tarefa atualizada');
  } else {
    res.status(400).send('Tarefa inválida ou ID não encontrado');
  }
});

// Rota para remover uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefaIndex = tarefas.findIndex(t => t.id === id);
  if (tarefaIndex !== -1) {
    tarefas.splice(tarefaIndex, 1);
    saveTarefas(); // Salvar tarefas após remover
    res.send('Tarefa removida');
  } else {
    res.status(400).send('ID não encontrado');
  }
});

// Rota para remover todas as tarefas
app.delete('/tarefas', (req, res) => {
  tarefas = [];
  saveTarefas(); // Salvar tarefas após remover todas
  res.send('Todas as tarefas foram removidas');
});

// Rota para a raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo à aplicação de lista de tarefas!');
});

// Inicializando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});