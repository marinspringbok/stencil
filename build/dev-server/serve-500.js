import { responseHeaders, sendError, sendMsg } from './dev-server-utils';
import util from 'util';
export function serve500(devServerConfig, req, res, error, xSource) {
    try {
        res.writeHead(500, responseHeaders({
            'content-type': 'text/plain; charset=utf-8',
            'x-source': xSource,
        }));
        res.write(util.inspect(error));
        res.end();
        if (devServerConfig.logRequests) {
            sendMsg(process, {
                requestLog: {
                    method: req.method,
                    url: req.url,
                    status: 500,
                },
            });
        }
    }
    catch (e) {
        sendError(process, 'serve500: ' + e);
    }
}
