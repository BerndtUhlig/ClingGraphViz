"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineSVGDirective = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var inline_svg_component_1 = require("./inline-svg.component");
var svg_cache_service_1 = require("./svg-cache.service");
var inline_svg_service_1 = require("./inline-svg.service");
var inline_svg_config_1 = require("./inline-svg.config");
var SvgUtil = require("./svg-util");
var i0 = require("@angular/core");
var i1 = require("./svg-cache.service");
var i2 = require("./inline-svg.service");
var i3 = require("./inline-svg.config");
var InlineSVGDirective = (function () {
    function InlineSVGDirective(_el, _viewContainerRef, _resolver, _svgCache, _renderer, _inlineSVGService, _config, platformId) {
        this._el = _el;
        this._viewContainerRef = _viewContainerRef;
        this._resolver = _resolver;
        this._svgCache = _svgCache;
        this._renderer = _renderer;
        this._inlineSVGService = _inlineSVGService;
        this._config = _config;
        this.platformId = platformId;
        this.resolveSVGUrl = true;
        this.replaceContents = true;
        this.prepend = false;
        this.injectComponent = false;
        this.cacheSVG = true;
        this.forceEvalStyles = false;
        this.evalScripts = "always";
        this.onSVGInserted = new core_1.EventEmitter();
        this.onSVGFailed = new core_1.EventEmitter();
        this._supportsSVG = SvgUtil.isSvgSupported();
        if (!(0, common_1.isPlatformServer)(this.platformId) && !this._supportsSVG) {
            this._fail('Embed SVG are not supported by this browser');
        }
    }
    InlineSVGDirective.prototype.ngOnInit = function () {
        if (!this._isValidPlatform() || this._isSSRDisabled()) {
            return;
        }
        this._insertSVG();
    };
    InlineSVGDirective.prototype.ngOnChanges = function (changes) {
        if (!this._isValidPlatform() || this._isSSRDisabled()) {
            return;
        }
        var setSVGAttributesChanged = Boolean(changes['setSVGAttributes']);
        if (changes['inlineSVG'] || setSVGAttributesChanged) {
            this._insertSVG(setSVGAttributesChanged);
        }
    };
    InlineSVGDirective.prototype.ngOnDestroy = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    };
    InlineSVGDirective.prototype._insertSVG = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (!(0, common_1.isPlatformServer)(this.platformId) && !this._supportsSVG) {
            return;
        }
        if (!this.inlineSVG) {
            this._fail('No URL passed to [inlineSVG]');
            return;
        }
        if (!force && this.inlineSVG === this._prevUrl) {
            return;
        }
        this._prevUrl = this.inlineSVG;
        this._subscription = this._svgCache.getSVG(this.inlineSVG, this.resolveSVGUrl, this.cacheSVG)
            .subscribe(function (svg) {
            if (SvgUtil.isUrlSymbol(_this.inlineSVG)) {
                var symbolId = _this.inlineSVG.split('#')[1];
                svg = SvgUtil.createSymbolSvg(_this._renderer, svg, symbolId);
            }
            _this._processSvg(svg);
        }, function (err) {
            _this._fail(err);
        });
    };
    InlineSVGDirective.prototype._processSvg = function (svg) {
        if (!svg) {
            return;
        }
        if (this.removeSVGAttributes && (0, common_1.isPlatformBrowser)(this.platformId)) {
            SvgUtil.removeAttributes(svg, this.removeSVGAttributes);
        }
        if (this.setSVGAttributes) {
            SvgUtil.setAttributes(svg, this.setSVGAttributes);
        }
        if (this.onSVGLoaded) {
            svg = this.onSVGLoaded(svg, this._el.nativeElement);
        }
        this._insertEl(svg);
        if ((0, common_1.isPlatformBrowser)(this.platformId)) {
            this._inlineSVGService.evalScripts(svg, this.inlineSVG, this.evalScripts);
        }
        if (this.forceEvalStyles) {
            var styleTags = svg.querySelectorAll('style');
            Array.from(styleTags).forEach(function (tag) { return tag.textContent += ''; });
        }
        this.onSVGInserted.emit(svg);
    };
    InlineSVGDirective.prototype._insertEl = function (el) {
        if (this.injectComponent) {
            if (!this._svgComp) {
                var factory = this._resolver.resolveComponentFactory(inline_svg_component_1.InlineSVGComponent);
                this._svgComp = this._viewContainerRef.createComponent(factory);
            }
            this._svgComp.instance.context = this;
            this._svgComp.instance.replaceContents = this.replaceContents;
            this._svgComp.instance.prepend = this.prepend;
            this._svgComp.instance.content = el;
            this._renderer.appendChild(this._el.nativeElement, this._svgComp.injector.get(inline_svg_component_1.InlineSVGComponent)._el.nativeElement);
        }
        else {
            this._inlineSVGService.insertEl(this, this._el.nativeElement, el, this.replaceContents, this.prepend);
        }
    };
    InlineSVGDirective.prototype._fail = function (msg) {
        this.onSVGFailed.emit(msg);
        if (this.fallbackImgUrl) {
            var elImg = this._renderer.createElement('IMG');
            this._renderer.setAttribute(elImg, 'src', this.fallbackImgUrl);
            this._insertEl(elImg);
        }
        else if (this.fallbackSVG && this.fallbackSVG !== this.inlineSVG) {
            this.inlineSVG = this.fallbackSVG;
            this._insertSVG();
        }
    };
    InlineSVGDirective.prototype._isValidPlatform = function () {
        return (0, common_1.isPlatformServer)(this.platformId) || (0, common_1.isPlatformBrowser)(this.platformId);
    };
    InlineSVGDirective.prototype._isSSRDisabled = function () {
        return (0, common_1.isPlatformServer)(this.platformId) && this._config && this._config.clientOnly;
    };
    InlineSVGDirective.ɵfac = function InlineSVGDirective_Factory(t) { return new (t || InlineSVGDirective)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.ViewContainerRef), i0.ɵɵdirectiveInject(i0.ComponentFactoryResolver), i0.ɵɵdirectiveInject(i1.SVGCacheService), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i2.InlineSVGService), i0.ɵɵdirectiveInject(i3.InlineSVGConfig, 8), i0.ɵɵdirectiveInject(core_1.PLATFORM_ID)); };
    InlineSVGDirective.ɵdir = i0.ɵɵdefineDirective({ type: InlineSVGDirective, selectors: [["", "inlineSVG", ""]], inputs: { inlineSVG: "inlineSVG", resolveSVGUrl: "resolveSVGUrl", replaceContents: "replaceContents", prepend: "prepend", injectComponent: "injectComponent", cacheSVG: "cacheSVG", setSVGAttributes: "setSVGAttributes", removeSVGAttributes: "removeSVGAttributes", forceEvalStyles: "forceEvalStyles", evalScripts: "evalScripts", fallbackImgUrl: "fallbackImgUrl", fallbackSVG: "fallbackSVG", onSVGLoaded: "onSVGLoaded" }, outputs: { onSVGInserted: "onSVGInserted", onSVGFailed: "onSVGFailed" }, features: [i0.ɵɵProvidersFeature([svg_cache_service_1.SVGCacheService]), i0.ɵɵNgOnChangesFeature] });
    return InlineSVGDirective;
}());
exports.InlineSVGDirective = InlineSVGDirective;
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InlineSVGDirective, [{
        type: core_1.Directive,
        args: [{
                selector: '[inlineSVG]',
                providers: [svg_cache_service_1.SVGCacheService]
            }]
    }], function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.ComponentFactoryResolver }, { type: i1.SVGCacheService }, { type: i0.Renderer2 }, { type: i2.InlineSVGService }, { type: i3.InlineSVGConfig, decorators: [{
                type: core_1.Optional
            }] }, { type: Object, decorators: [{
                type: core_1.Inject,
                args: [core_1.PLATFORM_ID]
            }] }]; }, { inlineSVG: [{
            type: core_1.Input
        }], resolveSVGUrl: [{
            type: core_1.Input
        }], replaceContents: [{
            type: core_1.Input
        }], prepend: [{
            type: core_1.Input
        }], injectComponent: [{
            type: core_1.Input
        }], cacheSVG: [{
            type: core_1.Input
        }], setSVGAttributes: [{
            type: core_1.Input
        }], removeSVGAttributes: [{
            type: core_1.Input
        }], forceEvalStyles: [{
            type: core_1.Input
        }], evalScripts: [{
            type: core_1.Input
        }], fallbackImgUrl: [{
            type: core_1.Input
        }], fallbackSVG: [{
            type: core_1.Input
        }], onSVGLoaded: [{
            type: core_1.Input
        }], onSVGInserted: [{
            type: core_1.Output
        }], onSVGFailed: [{
            type: core_1.Output
        }] }); })();
