import { AfterViewInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { InlineSVGDirective } from './inline-svg.directive';
import { InlineSVGService } from './inline-svg.service';
import * as i0 from "@angular/core";
export declare class InlineSVGComponent implements AfterViewInit, OnChanges {
    private _inlineSVGService;
    context: InlineSVGDirective;
    content: HTMLElement | SVGElement;
    replaceContents: boolean;
    prepend: boolean;
    constructor(_inlineSVGService: InlineSVGService, el: ElementRef);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private _updateContent;
    static ɵfac: i0.ɵɵFactoryDeclaration<InlineSVGComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InlineSVGComponent, "inline-svg", never, { "context": "context"; "content": "content"; "replaceContents": "replaceContents"; "prepend": "prepend"; }, {}, never, never, false>;
}
