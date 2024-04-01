import { RendererFactory2 } from '@angular/core';
import { InlineSVGDirective } from './inline-svg.directive';
import * as i0 from "@angular/core";
export declare class InlineSVGService {
    private _renderer;
    private _ranScripts;
    constructor(rendererFactory: RendererFactory2);
    insertEl(dir: InlineSVGDirective, parentEl: HTMLElement, content: HTMLElement | SVGElement, replaceContents: boolean, prepend: boolean): void;
    evalScripts(svg: SVGElement, url: string, evalMode: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InlineSVGService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InlineSVGService>;
}
