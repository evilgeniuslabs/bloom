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
var platform_browser_1 = require('@angular/platform-browser');
var router_1 = require('@angular/router');
var model_1 = require('./model');
var particle_service_1 = require('./particle.service');
var DashboardComponent = (function () {
    function DashboardComponent(router, particleService, titleService) {
        this.router = router;
        this.particleService = particleService;
        this.titleService = titleService;
        this.model = new model_1.Model;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle("Bloom | Evil Genius Labs");
        this.model.accessToken = localStorage["accessToken"];
        if (this.model.accessToken && this.model.accessToken != "") {
            this.getDevices();
        }
    };
    DashboardComponent.prototype.save = function () {
        localStorage["accessToken"] = this.model.accessToken;
        this.model.status = "Saved access token.";
        this.getDevices();
    };
    DashboardComponent.prototype.getDevices = function () {
        var _this = this;
        this.model.status = "Getting devices...";
        // clear out the model & display
        this.model.devices = [];
        this.model.device = null;
        this.particleService.accessToken = this.model.accessToken;
        // get the device list from the Particle API
        this.particleService.getDevices(this.model.accessToken)
            .then(function (devices) {
            // get the previously selected device id
            var deviceId = localStorage["deviceId"];
            var firstConnectedDevice = null;
            // set each device's title, and look for the previously selected device
            devices.forEach(function (device, index, array) {
                device.title = (device.connected == true ? "● " : "◌ ") + device.name;
                // select the previously selected device
                if (device.id == deviceId) {
                    _this.model.device = device;
                }
                if (firstConnectedDevice == null && device.connected) {
                    firstConnectedDevice = device;
                }
            });
            _this.model.devices = devices;
            // if no previously selected device was found,
            // select the first connected device in the list
            if (_this.model.device == null && firstConnectedDevice != null) {
                _this.model.device = firstConnectedDevice;
            }
            _this.model.isDeviceSelected = _this.model.device != null;
            // update local storage and connect to the selected device
            if (_this.model.device != null && _this.model.device.connected) {
                _this.connect();
            }
            _this.model.status = "Ready";
        });
    };
    DashboardComponent.prototype.connect = function () {
        var _this = this;
        // this.model.busy = true;
        this.model.status = "Connecting to device...";
        this.particleService.accessToken = this.model.accessToken;
        this.particleService.deviceId = this.model.device.id;
        localStorage["deviceId"] = this.model.device.id;
        this.model.status = "Loading power...";
        this.particleService.getBoolean("power")
            .then(function (result) {
            _this.model.power = result;
            _this.model.status = "Power: " + result;
        })
            .then(function (data) {
            _this.model.status = "Loading brightness...";
            return _this.particleService.getNumber("brightness");
        })
            .then(function (result) {
            _this.model.brightness = result;
            _this.model.status = "Brightness: " + result;
        })
            .then(function (data) {
            _this.model.status = "Loading red...";
            return _this.particleService.getNumber("r");
        })
            .then(function (result) {
            _this.model.r = result;
            _this.model.status = "Red: " + result;
        })
            .then(function (data) {
            _this.model.status = "Loading green...";
            return _this.particleService.getNumber("g");
        })
            .then(function (result) {
            _this.model.g = result;
            _this.model.status = "Green: " + result;
        })
            .then(function (data) {
            _this.model.status = "Loading blue...";
            return _this.particleService.getNumber("b");
        })
            .then(function (result) {
            _this.model.b = result;
            _this.model.color = _this.rgbToHex(_this.model.r, _this.model.g, _this.model.b);
            _this.model.status = "Blue: " + result;
        })
            .then(function (data) {
            _this.model.patterns = [];
            _this.model.status = "Loading patterns...";
            return _this.particleService.getString("patternNames");
        })
            .then(function (result) {
            var patternNames = JSON.parse(result);
            patternNames.forEach(function (patternName, index, array) {
                _this.model.patterns.push({
                    index: index,
                    name: patternName,
                });
            });
        })
            .then(function (data) {
            _this.model.status = "Loading pattern...";
            return _this.particleService.getNumber("patternIndex");
        })
            .then(function (result) {
            _this.model.busy = false;
            _this.model.patternIndex = result;
            _this.model.pattern = _this.model.patterns[result];
            _this.model.status = "Pattern: " + result;
            _this.model.status = "Ready.";
        });
    };
    DashboardComponent.prototype.powerOn = function () {
        var _this = this;
        this.model.status = "Turning on...";
        this.particleService.setVariable("pwr", 1)
            .then(function (result) {
            _this.model.busy = false;
            _this.model.power = result;
            _this.model.status = "Turned on";
        })
            .catch(function (reason) {
            _this.model.busy = false;
            _this.model.status = reason;
        });
    };
    DashboardComponent.prototype.powerOff = function () {
        var _this = this;
        this.model.status = "Turning off...";
        this.particleService.setVariable("pwr", 0)
            .then(function (result) {
            _this.model.busy = false;
            _this.model.power = result;
            _this.model.status = "Turned on";
        })
            .catch(function (reason) {
            _this.model.busy = false;
            _this.model.status = reason;
        });
    };
    DashboardComponent.prototype.setBrightness = function () {
        var _this = this;
        this.model.status = "Setting brightness...";
        this.particleService.setVariable("brt", this.model.brightness)
            .then(function (result) {
            _this.model.busy = false;
            _this.model.brightness = result;
            _this.model.status = "Brightness: " + _this.model.brightness;
        })
            .catch(function (reason) {
            _this.model.busy = false;
            _this.model.status = reason;
        });
    };
    DashboardComponent.prototype.onSelectedDeviceChange = function (selectedDevice) {
        this.model.isDeviceSelected = selectedDevice != null;
    };
    DashboardComponent.prototype.onSelectedPatternChange = function (selectedPattern) {
        var _this = this;
        this.model.status = "Setting pattern...";
        this.particleService.setValue("patternIndex", this.model.pattern.index)
            .then(function (result) {
            _this.model.busy = false;
            _this.model.status = "Pattern: " + _this.model.pattern.name;
            _this.model.patternIndex = _this.model.pattern.index;
        })
            .catch(function (reason) {
            _this.model.busy = false;
            _this.model.status = reason;
        });
    };
    DashboardComponent.prototype.onSelectedColorChange = function (selectedColor) {
        var _this = this;
        var color = this.hexToRgb(this.model.color);
        this.model.r = color.r;
        this.model.g = color.g;
        this.model.b = color.b;
        var c = color.r + "," + color.g + "," + color.b;
        this.model.status = "Setting color...";
        this.particleService.setVariable("c", c)
            .then(function (result) {
            _this.model.busy = false;
            _this.model.status = "Color: " + c;
            var patternIndex = _this.model.patterns.length - 1;
            _this.model.patternIndex = patternIndex;
            _this.model.pattern = _this.model.patterns[patternIndex];
        })
            .catch(function (reason) {
            _this.model.busy = false;
            _this.model.status = reason;
        });
    };
    DashboardComponent.prototype.componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    ;
    DashboardComponent.prototype.rgbToHex = function (r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };
    ;
    DashboardComponent.prototype.hexToRgb = function (color) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    ;
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'my-dashboard',
            templateUrl: 'app/dashboard.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, particle_service_1.ParticleService, platform_browser_1.Title])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map