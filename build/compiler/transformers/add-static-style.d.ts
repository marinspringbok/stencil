import * as d from '../../declarations';
import ts from 'typescript';
/**
 * Adds static "style" getter within the class
 * const MyComponent = class {
 *   static get style() { return "styles"; }
 * }
 */
export declare const addStaticStyleGetterWithinClass: (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => void;
/**
 * Adds static "style" property to the class variable.
 * const MyComponent = class {}
 * MyComponent.style = "styles";
 */
export declare const addStaticStylePropertyToClass: (styleStatements: ts.Statement[], cmp: d.ComponentCompilerMeta) => void;
