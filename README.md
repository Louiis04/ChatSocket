# Aplicação de Chat - README

Este projeto é uma aplicação de chat em tempo real construída com React (frontend) e Node.js com WebSocket (backend).

## Estrutura do Projeto

O projeto consiste em duas partes principais:

* **Frontend:** Aplicação React construída com TypeScript.
* **Backend:** Servidor WebSocket simples utilizando Node.js.

## Como Começar

### Pré-requisitos

* Node.js (v12 ou superior recomendado)
* npm (instalado junto com o Node.js)

### Instalação

1.  **Clone o repositório ou baixe o código-fonte:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-da-pasta-do-repositorio>
    ```

2.  **Instale as dependências do backend:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

3.  **Instale as dependências do frontend:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Executando a Aplicação

1.  **Inicie o servidor backend:**
    ```bash
    cd backend
    npm start 
    ```
    Você deverá ver uma mensagem similar a: `"Servidor WebSocket iniciado na porta 8080"`

2.  **Em um novo terminal, inicie a aplicação frontend:**
    ```bash
    cd frontend
    npm start
    ```
    Isso abrirá a aplicação React no seu navegador padrão, geralmente em `http://localhost:3000`.

## Como Usar o Chat

1.  Digite seu nome de usuário/apelido na tela inicial.
2.  Comece a enviar mensagens na janela de chat.
3.  Todos os usuários conectados verão suas mensagens e serão notificados quando novos usuários entrarem.

## Funcionalidades

* Mensagens em tempo real utilizando WebSockets
* Entrada de apelido do usuário antes de entrar no chat
* Indicadores de status da conexão
* Notificações do sistema (ex: usuário entrou)
* Janela de mensagens com rolagem automática
* Design responsivo básico

## Implementação Técnica

* **Frontend:** React com TypeScript, utilizando a API WebSocket do navegador para comunicação em tempo real.
* **Backend:** Node.js com a biblioteca `ws` para o servidor WebSocket.
* O backend transmite as mensagens para todos os clientes conectados.
* As mensagens incluem timestamps e informações do remetente.

## Solução de Problemas

Se você encontrar problemas de conexão:

* Certifique-se de que o servidor backend está em execução e ouvindo na porta 8080.
* Verifique o console do desenvolvedor do seu navegador por erros de conexão WebSocket.
* Verifique se nenhum firewall está bloqueando as conexões WebSocket na porta 8080.
* Tente reiniciar tanto a aplicação backend quanto a frontend.