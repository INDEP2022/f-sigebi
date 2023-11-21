import { Injectable } from '@angular/core';
import { ConvertionNumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-conv-numerary';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ConvNumeraryService extends HttpService {
  private readonly route = ConvertionNumeraryEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getCentralNumera(idEvent: number) {
    return this.get(this.route.Central + '/' + idEvent);
  }

  getSPGastosEventoParcial(idEvent: number) {
    return this.get(this.route.SP_GASTOSXEVENTO_PARCIAL + '/' + idEvent);
  }

  SPBorraNumera(idEvent: number) {
    return this.delete(this.route.SP_BORRA_NUMERA + '/' + idEvent);
  }

  convert(body: { pevent: number; pscreen: string; user: string }) {
    return this.post(this.route.CONVIERTE, body);
  }

  SP_CONVERSION_ASEG_PARCIAL(body: { pevent: number; pscreen: string }) {
    return this.post(this.route.SP_CONVERSION_ASEG_PARCIAL, body);
  }

  PA_CONVNUMERARIO_ADJUDIR(body: {
    pevent: number;
    pscreen: string;
    pdirectionScreen: string;
    user: string;
  }) {
    return this.post(this.route.PA_CONVNUMERARIO_ADJUDIR, body);
  }
}
