import { PlatformPath } from '../../../declarations';
declare const path: PlatformPath;
export declare const basename: (p: string, ext?: string) => string;
export declare const dirname: (p: string) => string;
export declare const extname: (p: string) => string;
export declare const format: (pP: any) => string;
export declare const isAbsolute: (p: string) => boolean;
export declare const join: (...paths: string[]) => string;
export declare const normalize: (p: string) => string;
export declare const relative: (from: string, to: string) => string;
export declare const resolve: (...pathSegments: string[]) => string;
export declare const sep: string;
export declare const delimiter: string;
export declare const posix: PlatformPath;
export default path;
