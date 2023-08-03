import { Injectable } from '@angular/core';
import { Directsale } from 'src/app/common/constants/endpoints/ms-directsale';
import { HttpService } from 'src/app/common/services/http.service';
import { BienesAsignados } from '../../models/ms-directsale/BienesAsignados';
import { Solicitud } from '../../models/ms-directsale/solicitante';

@Injectable({
  providedIn: 'root',
})
export class MunicipalityControlMainService extends HttpService {
  private readonly route = Directsale;

  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }
  getSolicitantes() {
    console.log(this.route.DIRECTSALE_SOLICITANTES);
    return this.get(`${this.route.DIRECTSALE_SOLICITANTES}`);
  }
  getSolicitanteById(id: string) {
    return this.get(`${this.route.DIRECTSALE_SOLICITANTES}`, id);
  }
  updateSolicitante(body: Solicitud) {
    return this.put(`${this.route.DIRECTSALE_SOLICITANTES}`, body);
  }
  addSolicitante(body: Solicitud) {
    console.log(body);
    return this.post(`${this.route.DIRECTSALE_SOLICITANTES}`, body);
  }
  deleteSolicitante(id: any) {
    return this.delete(`${this.route.DIRECTSALE_SOLICITANTES}`, id);
  }
  /////////////////////////////////////////////////////////////////////
  getBienesAsignados() {
    return this.get(`${this.route.DIRECTSALE_BIENES}`);
  }
  getBienesAsignadosById(id: string) {
    return this.get(`${this.route.DIRECTSALE_BIENES}`, id);
  }
  updateBienesAsignados(id: number, body: any) {
    console.log(body);
    return this.put(`${this.route.DIRECTSALE_BIENES}/${id}`, body);
  }
  addBienesAsignados(body: BienesAsignados) {
    return this.post(`${this.route.DIRECTSALE_BIENES}`, body);
  }
  deleteBienesAsignados(id: number) {
    return this.delete(`${this.route.DIRECTSALE_BIENES}/${id}`);
  }
}
