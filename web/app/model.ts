import { Device } from './device';
import { Pattern } from './pattern';

export class Model {
  brightness: number;
  busy: boolean = false;
  power: boolean = false;
  color: string;
  r: number;
  g: number;
  b: number;
  powerText: string;
  status: string;
  disconnected: boolean;
  accessToken: string;
  isDeviceSelected: boolean = false;
  patterns: Pattern[];
  pattern: Pattern;
  patternIndex: number;
  devices: Device[];
  device: Device;
  numLeds: number;
}
