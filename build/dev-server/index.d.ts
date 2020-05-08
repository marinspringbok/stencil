import { CompilerWatcher, DevServer, Logger, StencilDevServerConfig } from '../declarations';
export declare function startServer(stencilDevServerConfig: StencilDevServerConfig, logger: Logger, watcher?: CompilerWatcher): Promise<DevServer>;
export declare function openInBrowser(opts: {
    url: string;
}): Promise<void>;
