const WebSocket = require('ws');
const http = require('http');
const tools = require('./tools');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('WebSocket server running');
});

const wss = new WebSocket.Server({server});
const clients = new Map();

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = message.toString('utf-8');
        console.log(data);
        var content = tools.decodeData(data);
        if (content[1] == "LOGIN") {
            ws.id = content[0];
            clients.set(ws.id, ws);
            console.log(ws.id + " HAS BEEN CONNECTED");
        } else {
            if (clients.has(content[0])) {
                const targetClient = clients.get(content[0]);
                if (targetClient.readyState === WebSocket.OPEN) {
                    targetClient.send(data);
                } else {
                    console.log(content[0] + " IS NOT CONNECTED");
                }
            } else {
                console.log(content[0] + " DOESNT EXIST");
            } 
        }
    });
    ws.on('close', () => {
        clients.forEach((value, key) => {
            console.log('List before disconnection : ' + value + " and " + key);
        });
        clients.delete(ws.id);
        clients.forEach((value, key) => {
            console.log('List after disconnection : ' + value + " and " + key);
        });
        console.log('User Disconnected');
    });
    ws.on('error', error => {
        console.error("Error for " + ws.id);
         console.error(error);
    });
});

server.listen(3000, () => {
    console.log('Server Started');
});
