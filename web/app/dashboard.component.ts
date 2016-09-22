import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Model } from './model';
import { Device } from './device';
import { Color } from './color';
import { Pattern } from './pattern';
import { ParticleService } from './particle.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  model: Model = new Model;

  constructor(
    private router: Router,
    private particleService: ParticleService,
    private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle("Bloom | Evil Genius Labs")

    this.model.accessToken = localStorage["accessToken"];

    if (this.model.accessToken && this.model.accessToken != "") {
      this.getDevices();
    }
  }

  save(): void {
    localStorage["accessToken"] = this.model.accessToken;
    this.model.status = "Saved access token.";
    this.getDevices();
  }

  getDevices(): void {
    this.model.status = "Getting devices...";

    // clear out the model & display
    this.model.devices = [];
    this.model.device = null;

    this.particleService.accessToken = this.model.accessToken;

    // get the device list from the Particle API
    this.particleService.getDevices(this.model.accessToken)
      .then(devices => {
        // get the previously selected device id
        var deviceId = localStorage["deviceId"];

        var firstConnectedDevice = null;

        // set each device's title, and look for the previously selected device
        devices.forEach((device: Device, index: number, array: Device[]) => {
          device.title = (device.connected == true ? "● " : "◌ ") + device.name;

          // select the previously selected device
          if (device.id == deviceId) {
            this.model.device = device;
          }

          if (firstConnectedDevice == null && device.connected) {
            firstConnectedDevice = device;
          }
        });

        this.model.devices = devices;

        // if no previously selected device was found,
        // select the first connected device in the list
        if (this.model.device == null && firstConnectedDevice != null) {
          this.model.device = firstConnectedDevice;
        }

        this.model.isDeviceSelected = this.model.device != null;

        // update local storage and connect to the selected device
        if (this.model.device != null && this.model.device.connected) {
          this.connect();
        }

        this.model.status = "Ready";
      });
  }

  connect(): void {
    // this.model.busy = true;
    this.model.status = "Connecting to device...";

    this.particleService.accessToken = this.model.accessToken;
    this.particleService.deviceId = this.model.device.id;

    localStorage["deviceId"] = this.model.device.id;

    this.model.status = "Loading power...";
    this.particleService.getBoolean("power")
      .then(result => {
        this.model.power = result;
        this.model.status = "Power: " + result;
      })

      .then(data => {
        this.model.status = "Loading brightness...";
        return this.particleService.getNumber("brightness");
      })
      .then(result => {
        this.model.brightness = result;
        this.model.status = "Brightness: " + result;
      })

      .then(data => {
        this.model.status = "Loading red...";
        return this.particleService.getNumber("r");
      })
      .then(result => {
        this.model.r = result;
        this.model.status = "Red: " + result;
      })

      .then(data => {
        this.model.status = "Loading green...";
        return this.particleService.getNumber("g");
      })
      .then(result => {
        this.model.g = result;
        this.model.status = "Green: " + result;
      })

      .then(data => {
        this.model.status = "Loading blue...";
        return this.particleService.getNumber("b");
      })
      .then(result => {
        this.model.b = result;
        this.model.color = this.rgbToHex(this.model.r, this.model.g, this.model.b);
        this.model.status = "Blue: " + result;
      })

      .then(data => {
        this.model.patterns = [];
        this.model.status = "Loading patterns...";
        return this.particleService.getString("patternNames");
      })
      .then(result => {
        let patternNames = JSON.parse(result);
        patternNames.forEach((patternName: string, index: number, array: string[]) => {
          this.model.patterns.push(
            {
              index: index,
              name: patternName,
            });
        });
      })

      .then(data => {
        this.model.status = "Loading pattern...";
        return this.particleService.getNumber("patternIndex");
      })
      .then(result => {
        this.model.busy = false;
        this.model.patternIndex = result;
        this.model.pattern = this.model.patterns[result];
        this.model.status = "Pattern: " + result;
        this.model.status = "Ready.";
      });
  }

  powerOn(): void {
    this.model.status = "Turning on...";
    this.particleService.setVariable("pwr", 1)
      .then(result => {
        this.model.busy = false;
        this.model.power = result;
        this.model.status = "Turned on";
      })
      .catch(reason => {
        this.model.busy = false;
        this.model.status = reason;
      });
  }

  powerOff(): void {
    this.model.status = "Turning off...";
    this.particleService.setVariable("pwr", 0)
      .then(result => {
        this.model.busy = false;
        this.model.power = result;
        this.model.status = "Turned on";
      })
      .catch(reason => {
        this.model.busy = false;
        this.model.status = reason;
      });
  }

  setBrightness(): void {
    this.model.status = "Setting brightness...";
    this.particleService.setVariable("brt", this.model.brightness)
      .then(result => {
        this.model.busy = false;
        this.model.brightness = result;
        this.model.status = "Brightness: " + this.model.brightness;
      })
      .catch(reason => {
        this.model.busy = false;
        this.model.status = reason;
      });
  }

  onSelectedDeviceChange(selectedDevice: Device): void {
    this.model.isDeviceSelected = selectedDevice != null;
  }

  onSelectedPatternChange(selectedPattern: Pattern): void {
    this.model.status = "Setting pattern...";
    this.particleService.setValue("patternIndex", this.model.pattern.index)
      .then(result => {
        this.model.busy = false;
        this.model.status = "Pattern: " + this.model.pattern.name;
        this.model.patternIndex = this.model.pattern.index;
      })
      .catch(reason => {
        this.model.busy = false;
        this.model.status = reason;
      });
  }

  onSelectedColorChange(selectedColor: string): void {
    let color = this.hexToRgb(this.model.color);

    this.model.r = color.r;
    this.model.g = color.g;
    this.model.b = color.b;

    let c = color.r + "," + color.g + "," + color.b;

    this.model.status = "Setting color...";
    this.particleService.setVariable("c", c)
      .then(result => {
        this.model.busy = false;
        this.model.status = "Color: " + c;
        let patternIndex = this.model.patterns.length - 1;
        this.model.patternIndex = patternIndex;
        this.model.pattern = this.model.patterns[patternIndex];
      })
      .catch(reason => {
        this.model.busy = false;
        this.model.status = reason;
      });
  }

  componentToHex(c: number): string {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  rgbToHex(r, g, b): string {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  };

  hexToRgb(color): Color {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
}
