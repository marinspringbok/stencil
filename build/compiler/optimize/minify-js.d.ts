import * as d from '../../declarations';
import terser from 'terser';
export declare const minifyJs: (input: string, opts?: terser.MinifyOptions) => Promise<{
    output: string;
    sourceMap: any;
    diagnostics: d.Diagnostic[];
}>;
