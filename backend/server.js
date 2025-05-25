const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

console.log('Servidor WebSocket iniciado na porta 8080');

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Novo cliente conectado. Total de clientes:', clients.size);

    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        console.log('Mensagem recebida:', message);

        let broadcastMessage;

        if (message.type === 'newMessage') {
            broadcastMessage = JSON.stringify({
                type: 'message',
                user: message.user,
                text: message.text,
                timestamp: new Date().toISOString()
            });
        } else if (message.type === 'userJoined') {
            broadcastMessage = JSON.stringify({
                type: 'info',
                text: `${message.user} entrou no chat.`,
                timestamp: new Date().toISOString()
            });
        }

        if (broadcastMessage) {
            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(broadcastMessage);
                }
            });
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Cliente desconectado. Total de clientes:', clients.size);
        const userLeftMessage = JSON.stringify({
            type: 'info',
            text: `Um usuário desconectou.`,
            timestamp: new Date().toISOString()
        });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(userLeftMessage);
            }
        });
    });

    ws.on('error', (error) => {
        console.error('Erro no WebSocket:', error);
        clients.delete(ws); 
    });
});