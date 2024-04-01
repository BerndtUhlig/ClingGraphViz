import { Injectable, RendererFactory2 } from '@angular/core';
import * as i0 from "@angular/core";
var InlineSVGService = (function () {
    function InlineSVGService(rendererFactory) {
        this._ranScripts = {};
        this._renderer = rendererFactory.createRenderer(null, null);
    }
    InlineSVGService.prototype.insertEl = function (dir, parentEl, content, replaceContents, prepend) {
        if (replaceContents && !prepend) {
            var parentNode = dir._prevSVG && dir._prevSVG.parentNode;
            if (parentNode) {
                this._renderer.removeChild(parentNode, dir._prevSVG);
            }
            parentEl.innerHTML = '';
        }
        if (prepend) {
            this._renderer.insertBefore(parentEl, content, parentEl.firstChild);
        }
        else {
            this._renderer.appendChild(parentEl, content);
        }
        if (content.nodeName === 'svg') {
            dir._prevSVG = content;
        }
    };
    InlineSVGService.prototype.evalScripts = function (svg, url, evalMode) {
        var scripts = svg.querySelectorAll('script');
        var scriptsToEval = [];
        for (var i = 0; i < scripts.length; i++) {
            var scriptType = scripts[i].getAttribute('type');
            if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript') {
                var script = scripts[i].innerText || scripts[i].textContent;
                scriptsToEval.push(script);
                this._renderer.removeChild(scripts[i].parentNode, scripts[i]);
            }
        }
        if (scriptsToEval.length > 0 && (evalMode === "always" ||
            (evalMode === "once" && !this._ranScripts[url]))) {
            for (var i = 0; i < scriptsToEval.length; i++) {
                new Function(scriptsToEval[i])(window);
            }
            this._ranScripts[url] = true;
        }
    };
    InlineSVGService.ɵfac = function InlineSVGService_Factory(t) { return new (t || InlineSVGService)(i0.ɵɵinject(i0.RendererFactory2)); };
    InlineSVGService.ɵprov = i0.ɵɵdefineInjectable({ token: InlineSVGService, factory: InlineSVGService.ɵfac, providedIn: 'root' });
    return InlineSVGService;
}());
export { InlineSVGService };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InlineSVGService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i0.RendererFactory2 }]; }, null); })();
