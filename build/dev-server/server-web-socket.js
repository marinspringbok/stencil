import * as ws from 'ws';
import { noop } from '@utils';
export function createWebSocket(prcs, httpServer, destroys) {
    const wsConfig = {
        server: httpServer,
    };
    const wsServer = new ws.Server(wsConfig);
    function heartbeat() {
        this.isAlive = true;
    }
    wsServer.on('connection', (ws) => {
        ws.on('message', data => {
            // the server process has received a message from the browser
            // pass the message received from the browser to the main cli process
            prcs.send(JSON.parse(data.toString()));
        });
        ws.isAlive = true;
        ws.on('pong', heartbeat);
    });
    const pingInternval = setInterval(() => {
        wsServer.clients.forEach((ws) => {
            if (!ws.isAlive) {
                return ws.close(1000);
            }
            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 10000);
    function onMessageFromCli(msg) {
        // the server process has received a message from the cli's main thread
        // pass the data to each web socket for each browser/tab connected
        if (msg) {
            const data = JSON.stringify(msg);
            wsServer.clients.forEach(ws => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(data);
                }
            });
        }
    }
    prcs.addListener('message', onMessageFromCli);
    destroys.push(() => {
        clearInterval(pingInternval);
        wsServer.clients.forEach(ws => {
            ws.close(1000);
        });
    });
}
