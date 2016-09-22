"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var ParticleService = (function () {
    function ParticleService(http) {
        this.http = http;
        this.baseUrl = 'https://api.particle.io/v1/';
    }
    ParticleService.prototype.getDevices = function (accessToken) {
        var url = this.baseUrl + "devices?access_token=" + this.accessToken;
        return this.http.get(url)
            .toPromise()
            .then(function (response) {
            return response.json();
        })
            .catch(this.handleError);
    };
    ParticleService.prototype.getNumber = function (propertyName) {
        return this.getValue(propertyName).then(function (result) { return result; });
    };
    ParticleService.prototype.getString = function (propertyName) {
        return this.getValue(propertyName).then(function (result) { return result; });
    };
    ParticleService.prototype.getBoolean = function (propertyName) {
        return this.getNumber(propertyName).then(function (result) { return result != 0; });
    };
    ParticleService.prototype.getValue = function (propertyName) {
        var url = this.baseUrl + "devices/" + this.deviceId + "/" + propertyName + "?access_token=" + this.accessToken;
        return this.http.get(url)
            .toPromise()
            .then(function (response) {
            return response.json().result;
        })
            .catch(this.handleError);
    };
    ParticleService.prototype.getExtendedValue = function (propertyName) {
        var url = this.baseUrl + "devices/" + this.deviceId + "/varCursor";
        var body = "access_token=" + this.accessToken + "&args=" + propertyName;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(function (response) {
            return response.json().result;
        })
            .catch(this.handleError);
    };
    ParticleService.prototype.setValue = function (propertyName, value) {
        var url = this.baseUrl + "devices/" + this.deviceId + "/" + propertyName;
        var body = "access_token=" + this.accessToken + "&args=" + value;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(function (response) {
            return response.json().return_value;
        })
            .catch(this.handleError);
    };
    ParticleService.prototype.setVariable = function (propertyName, value) {
        var url = this.baseUrl + "devices/" + this.deviceId + "/variable";
        var body = "access_token=" + this.accessToken + "&args=" + propertyName + ":" + value;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(function (response) {
            return response.json().return_value;
        })
            .catch(this.handleError);
    };
    ParticleService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    ParticleService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ParticleService);
    return ParticleService;
}());
exports.ParticleService = ParticleService;
//# sourceMappingURL=particle.service.js.map