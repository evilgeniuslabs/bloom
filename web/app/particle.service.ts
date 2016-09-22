import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Device } from './device';

@Injectable()
export class ParticleService {
  private baseUrl = 'https://api.particle.io/v1/';

  constructor(private http: Http) { }

  accessToken: string;
  deviceId: string;

  getDevices(accessToken: string): Promise<Device[]> {
    let url = this.baseUrl + "devices?access_token=" + this.accessToken;
    return this.http.get(url)
      .toPromise()
      .then(response =>
        response.json() as Device[]
      )
      .catch(this.handleError);
  }

  getNumber(propertyName: string): Promise<number> {
    return this.getValue(propertyName).then(result => result as number);
  }

  getString(propertyName: string): Promise<string> {
    return this.getValue(propertyName).then(result => result as string);
  }

  getBoolean(propertyName: string): Promise<boolean> {
    return this.getNumber(propertyName).then(result => result != 0);
  }

  getValue(propertyName: string): Promise<any> {
    let url = this.baseUrl + "devices/" + this.deviceId + "/" + propertyName + "?access_token=" + this.accessToken;

    return this.http.get(url)
      .toPromise()
      .then(response =>
        response.json().result
      )
      .catch(this.handleError);
  }

  getExtendedValue(propertyName: string): Promise<any> {
    let url = this.baseUrl + "devices/" + this.deviceId + "/varCursor";
    let body = "access_token=" + this.accessToken + "&args=" + propertyName;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options)
      .toPromise()
      .then(response =>
        response.json().result
      )
      .catch(this.handleError);
  }

  setValue(propertyName: string, value: any): Promise<any> {
    let url = this.baseUrl + "devices/" + this.deviceId + "/" + propertyName;
    let body = "access_token=" + this.accessToken + "&args=" + value;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options)
      .toPromise()
      .then(response =>
        response.json().return_value
      )
      .catch(this.handleError);
  }

  setVariable(propertyName: string, value: any): Promise<any> {
    let url = this.baseUrl + "devices/" + this.deviceId + "/variable";
    let body = "access_token=" + this.accessToken + "&args=" + propertyName + ":" + value;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, body, options)
      .toPromise()
      .then(response =>
        response.json().return_value
      )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
