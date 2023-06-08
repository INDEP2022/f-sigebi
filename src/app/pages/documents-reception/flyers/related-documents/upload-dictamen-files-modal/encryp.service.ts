import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class EncrypService {
  private url = 'http://wssiab.sae.gob.mx/WsFirmaElectronicades/wsFirma.asmx';
  constructor(private http: HttpClient) {}

  public encryp(parametro: any) {
    const soapMessage = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <encriptar xmlns="http://tempuri.org/">
            <CadenaEncriptar>${parametro}</CadenaEncriptar>
        </encriptar>
    </Body>
</Envelope>`;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/xml;charset=UTF-8',
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: '*/*',
    };
    return this.http.post(this.url, soapMessage, {
      headers,
      responseType: 'text',
    });
  }
}
