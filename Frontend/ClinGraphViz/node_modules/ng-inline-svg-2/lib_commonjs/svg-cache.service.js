"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGCacheService = void 0;
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var inline_svg_config_1 = require("./inline-svg.config");
var i0 = require("@angular/core");
var i1 = require("@angular/common");
var i2 = require("./inline-svg.config");
var i3 = require("@angular/common/http");
var SVGCacheService = (function () {
    function SVGCacheService(_appBase, _location, _config, httpClient, httpBackend, rendererFactory) {
        this._appBase = _appBase;
        this._location = _location;
        this._config = _config;
        this._http = _config && !_config.bypassHttpClientInterceptorChain
            ? httpClient
            : new http_1.HttpClient(httpBackend);
        this._renderer = rendererFactory.createRenderer(null, null);
        this.setBaseUrl();
        if (!SVGCacheService._cache) {
            SVGCacheService._cache = new Map();
        }
        if (!SVGCacheService._inProgressReqs) {
            SVGCacheService._inProgressReqs = new Map();
        }
    }
    SVGCacheService.prototype.getSVG = function (url, resolveSVGUrl, cache) {
        var _this = this;
        if (cache === void 0) { cache = true; }
        var svgUrl = (resolveSVGUrl
            ? this.getAbsoluteUrl(url)
            : url).replace(/#.+$/, '');
        if (cache && SVGCacheService._cache.has(svgUrl)) {
            return (0, rxjs_1.of)(this._cloneSVG(SVGCacheService._cache.get(svgUrl)));
        }
        if (SVGCacheService._inProgressReqs.has(svgUrl)) {
            return SVGCacheService._inProgressReqs.get(svgUrl);
        }
        var req = this._http.get(svgUrl, { responseType: 'text' })
            .pipe((0, operators_1.tap)(function () {
            SVGCacheService._inProgressReqs.delete(svgUrl);
        }), (0, operators_1.catchError)(function (error) {
            SVGCacheService._inProgressReqs.delete(svgUrl);
            return (0, rxjs_1.throwError)(error.message);
        }), (0, operators_1.share)(), (0, operators_1.map)(function (svgText) {
            var svgEl = _this._svgElementFromString(svgText);
            SVGCacheService._cache.set(svgUrl, svgEl);
            return _this._cloneSVG(svgEl);
        }));
        SVGCacheService._inProgressReqs.set(svgUrl, req);
        return req;
    };
    SVGCacheService.prototype.setBaseUrl = function () {
        if (this._config) {
            this._baseUrl = this._config.baseUrl;
        }
        else if (this._appBase !== null) {
            this._baseUrl = this._appBase;
        }
        else if (this._location !== null) {
            this._baseUrl = this._location.getBaseHrefFromDOM();
        }
    };
    SVGCacheService.prototype.getAbsoluteUrl = function (url) {
        if (this._baseUrl && !/^https?:\/\//i.test(url)) {
            url = this._baseUrl + url;
            if (url.indexOf('//') === 0) {
                url = url.substring(1);
            }
        }
        var base = this._renderer.createElement('BASE');
        base.href = url;
        return base.href;
    };
    SVGCacheService.prototype._svgElementFromString = function (str) {
        var div = this._renderer.createElement('DIV');
        div.innerHTML = str;
        var svg = div.querySelector('svg');
        if (!svg) {
            throw new Error('No SVG found in loaded contents');
        }
        return svg;
    };
    SVGCacheService.prototype._cloneSVG = function (svg) {
        return svg.cloneNode(true);
    };
    SVGCacheService.ɵfac = function SVGCacheService_Factory(t) { return new (t || SVGCacheService)(i0.ɵɵinject(common_1.APP_BASE_HREF, 8), i0.ɵɵinject(i1.PlatformLocation, 8), i0.ɵɵinject(i2.InlineSVGConfig, 8), i0.ɵɵinject(i3.HttpClient), i0.ɵɵinject(i3.HttpBackend), i0.ɵɵinject(i0.RendererFactory2)); };
    SVGCacheService.ɵprov = i0.ɵɵdefineInjectable({ token: SVGCacheService, factory: SVGCacheService.ɵfac, providedIn: 'root' });
    return SVGCacheService;
}());
exports.SVGCacheService = SVGCacheService;
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SVGCacheService, [{
        type: core_1.Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: core_1.Optional
            }, {
                type: core_1.Inject,
                args: [common_1.APP_BASE_HREF]
            }] }, { type: i1.PlatformLocation, decorators: [{
                type: core_1.Optional
            }] }, { type: i2.InlineSVGConfig, decorators: [{
                type: core_1.Optional
            }] }, { type: i3.HttpClient }, { type: i3.HttpBackend }, { type: i0.RendererFactory2 }]; }, null); })();
