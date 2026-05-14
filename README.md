# 🏋️ Sistema de Gerenciamento de Academia

Sistema front-end de gerenciamento de academia desenvolvido com Vue 3, Composition API e Pinia.

---
## Responsáveis pelo projeto
Bruno Henrique Brasil da Silva
Camila Gonçalves Bomfim
Daniel Viana de Farias
Felipe Mota Damasceno
Leticia Monteiro Alves da Silva
Lorena Gama Neiva
Pedro Felipe Damasceno
Vander Eduardo Pinheiro Rodrigues

## 🚀 Tecnologias

- [Vue 3](https://vuejs.org/) + Composition API
- [Pinia](https://pinia.vuejs.org/) — gerenciamento de estado
- [Vue Router](https://router.vuejs.org/) — roteamento
- [Axios](https://axios-http.com/) — requisições HTTP
- [JSON Server](https://github.com/typicode/json-server) — backend fake (porta 3000)

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd NOME_DA_PASTA
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

```bash
cp .env_example .env
```

### 4. Rodar o front-end e o backend fake

```bash
npm run dev       # inicia o front-end
npm run backend   # inicia o JSON Server na porta 3000
```

Ou manualmente:

```bash
npx json-server db.json --port 3000
```

---

## 🌐 Consumo da API

Importe a `API_URL` do arquivo `api.js` e use com axios:

```js
import axios from 'axios'
import { API_URL } from './api'

const response = await axios.get(`${API_URL}/users`)
```

---

## 🗂️ Estrutura do banco fake (`db.json`)

| Recurso         | Descrição                                      |
|----------------|------------------------------------------------|
| `users`         | Usuários do sistema (admin, aluno, instrutor…) |
| `planos`        | Planos de academia disponíveis                 |
| `mensalidades`  | Pagamentos de mensalidades dos alunos          |
| `treinos`       | Treinos cadastrados pelos instrutores          |
| `agendamentos`  | Agendamentos entre alunos e funcionários       |
| `assinaturas`   | Solicitações de assinatura de plano (guests)   |
| `relatorios`    | Relatórios disponíveis para o admin            |



## 👥 Roles do sistema

O controle de acesso é feito pela propriedade `role` do usuário logado.

| Role            | Permissões                                                                 |
|----------------|----------------------------------------------------------------------------|
| `admin`         | Página inicial de admin, cadastrar funcionário, cadastrar plano            |
| `recepcionista` | Visualizar/cadastrar agendamentos, cadastrar aluno, tornar guest em aluno  |
| `instrutor`     | Cadastrar e atualizar treinos                                              |
| `aluno`         | Visualizar perfil e treinos                                                |
| `guest`         | Visualizar perfil e assinar plano                                          |


git commit -m "implementa nome da tarefa"
git push origin nome-da-sua-branch
```
