import { Injectable } from '@angular/core';

export interface Script {
  id: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  constructor() {}

  public loadScript({ id, url }: Script) {
    return new Promise((resolve, reject) => {
      if (id && document.getElementById(id)) {
        resolve({ id: id, loaded: true, status: 'Already Loaded' });
      }
      // let scripts = document.getElementsByTagName('script')[0];
      let body = document.body;
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = '';
      script.src = url;
      script.id = id;
      script.onload = () => {
        resolve({ id: id, loaded: true, status: 'Loaded' });
      };
      script.onerror = (error: any) =>
        resolve({ id: id, loaded: false, status: 'Loaded' });
      script.async = true;
      script.defer = true;
      body.appendChild(script);
    });
  }

  public removeScript(id: string) {
    let script = document.getElementById(id);
    if (script) {
      script.remove();
    }
  }
}
