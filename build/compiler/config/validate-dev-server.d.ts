import * as d from '../../declarations';
export declare const validateDevServer: (config: d.Config, diagnostics: d.Diagnostic[]) => {
    browserUrl?: string;
    contentTypes?: {
        [ext: string]: string;
    };
    devServerDir?: string;
    editors?: d.DevServerEditor[];
    excludeHmr?: string[];
    historyApiFallback?: d.HistoryApiFallback;
    openBrowser?: boolean;
    protocol?: "http" | "https";
    address?: string;
    basePath?: string;
    experimentalDevModules?: boolean;
    gzip?: boolean;
    https?: d.Credentials;
    initialLoadUrl?: string;
    logRequests?: boolean;
    port?: number;
    reloadStrategy?: d.PageReloadStrategy;
    root?: string;
    websocket?: boolean;
};
