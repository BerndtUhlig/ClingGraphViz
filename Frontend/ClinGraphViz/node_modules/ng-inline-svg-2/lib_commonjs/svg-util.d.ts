import { Renderer2 } from '@angular/core';
export declare function isUrlSymbol(url: string): boolean;
export declare function isSvgSupported(): boolean;
export declare function createSymbolSvg(renderer: Renderer2, svg: SVGElement, symbolId: string): SVGElement;
export declare function removeAttributes(element: Element, attrs: Array<string>): void;
export declare function setAttributes(element: Element, attrs: {
    [key: string]: any;
}): void;
