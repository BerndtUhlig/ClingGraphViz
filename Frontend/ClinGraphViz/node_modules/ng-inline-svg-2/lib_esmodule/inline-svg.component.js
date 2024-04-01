import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { InlineSVGDirective } from './inline-svg.directive';
import { InlineSVGService } from './inline-svg.service';
import * as i0 from "@angular/core";
import * as i1 from "./inline-svg.service";
var InlineSVGComponent = (function () {
    function InlineSVGComponent(_inlineSVGService, el) {
        this._inlineSVGService = _inlineSVGService;
        this._el = el;
    }
    InlineSVGComponent.prototype.ngAfterViewInit = function () {
        this._updateContent();
    };
    InlineSVGComponent.prototype.ngOnChanges = function (changes) {
        if (changes['content']) {
            this._updateContent();
        }
    };
    InlineSVGComponent.prototype._updateContent = function () {
        this._inlineSVGService.insertEl(this.context, this._el.nativeElement, this.content, this.replaceContents, this.prepend);
    };
    InlineSVGComponent.ɵfac = function InlineSVGComponent_Factory(t) { return new (t || InlineSVGComponent)(i0.ɵɵdirectiveInject(i1.InlineSVGService), i0.ɵɵdirectiveInject(i0.ElementRef)); };
    InlineSVGComponent.ɵcmp = i0.ɵɵdefineComponent({ type: InlineSVGComponent, selectors: [["inline-svg"]], inputs: { context: "context", content: "content", replaceContents: "replaceContents", prepend: "prepend" }, features: [i0.ɵɵNgOnChangesFeature], decls: 0, vars: 0, template: function InlineSVGComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
    return InlineSVGComponent;
}());
export { InlineSVGComponent };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InlineSVGComponent, [{
        type: Component,
        args: [{
                selector: 'inline-svg',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i1.InlineSVGService }, { type: i0.ElementRef }]; }, { context: [{
            type: Input
        }], content: [{
            type: Input
        }], replaceContents: [{
            type: Input
        }], prepend: [{
            type: Input
        }] }); })();
