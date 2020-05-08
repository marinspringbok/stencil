import * as net from 'net';
export async function findClosestOpenPort(host, port) {
    async function t(portToCheck) {
        const isTaken = await isPortTaken(host, portToCheck);
        if (!isTaken) {
            return portToCheck;
        }
        return t(portToCheck + 1);
    }
    return t(port);
}
export function isPortTaken(host, port) {
    return new Promise((resolve, reject) => {
        const tester = net
            .createServer()
            .once('error', () => {
            resolve(true);
        })
            .once('listening', () => {
            tester
                .once('close', () => {
                resolve(false);
            })
                .close();
        })
            .on('error', (err) => {
            reject(err);
        })
            .listen(port, host);
    });
}
