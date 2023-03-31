import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';

@Injectable({
  providedIn: 'root',
})
export class FlyersService {
  private paramsGestionDictamen: any = {};
  private paramsGestionRelacionados: any = {};
  public optionOficio: boolean = true; // @boolean Se para true cuando es para la pantalla de "Oficio de Gestión por Dictamen" y para @false la pantalla "Oficio Gestión Relacionados"
  constructor(
    private msMJobManagementService: MJobManagementService,
    private msNotificationService: NotificationService,
    private msCityService: CityService,
    private msUsersService: UsersService
  ) {}

  /**
   * Retornar pantalla de acuerdo a los parámetros ingresados
   * @returns @boolean Se para true cuando es para la pantalla de "Oficio de Gestión por Dictamen" y para @false la pantalla "Oficio Gestión Relacionados"
   */
  getPantallaOption(option: string) {
    if (option == '2') {
      this.optionOficio = false;
    } else {
      this.optionOficio = true;
    }
    return this.optionOficio;
  }

  /**
   *  Setear valor a los parámetros
   * @param option @boolean Se para true cuando es para la pantalla de "Oficio de Gestión por Dictamen" y para @false la pantalla "Oficio Gestión Relacionados"
   * @param field Nombre del parámetro en @string de la interface @interface IOficioDictamenParams
   * @param value
   */
  setParams(option: boolean, field: string, value: string) {
    // Oficio de Gestión por Dictamen
    if (option) {
      this.paramsGestionDictamen[field] = value;
    } else {
      // Oficio de Gestión relacionados
      this.paramsGestionRelacionados[field] = value;
    }
    this.optionOficio = option;
  }

  /**
   *  Obtener los datos de parámetros
   * @param option @boolean Se para true cuando es para la pantalla de "Oficio de Gestión por Dictamen" y para @false la pantalla "Oficio Gestión Relacionados"
   * @returns
   */
  getParams(option: boolean) {
    // Oficio de Gestión por Dictamen
    if (option) {
      if (this.paramsGestionDictamen) {
        return this.paramsGestionDictamen;
      } else {
        return false;
      }
    } else {
      // Oficio de Gestión relacionados
      if (this.paramsGestionRelacionados) {
        return this.paramsGestionRelacionados;
      } else {
        return false;
      }
    }
  }

  /**
   *  Eliminar el valor del parámetro para las pantallas
   * @param option @boolean Se para true cuando es para la pantalla de "Oficio de Gestión por Dictamen" y para @false la pantalla "Oficio Gestión Relacionados"
   * @param field Nombre del parámetro en @string de la interface @interface IOficioDictamenParams
   * @param all Pasar el valor @true para eliminar todos los valores de parámetros
   */
  deleteParams(option: boolean, field: string, all: boolean = false) {
    // Oficio de Gestión por Dictamen
    if (option) {
      if (all) {
        this.paramsGestionDictamen = {};
      } else {
        this.paramsGestionDictamen[field] = null;
      }
    } else {
      // Oficio de Gestión relacionados
      if (all) {
        this.paramsGestionRelacionados = {};
      } else {
        this.paramsGestionRelacionados[field] = null;
      }
    }
  }

  getMOficioGestion(params: _Params) {
    return this.msMJobManagementService.getAllFiltered(params);
  }

  getNotificationByWheel(params: _Params) {
    return this.msNotificationService.getAllFilter(params);
  }

  getCityBySearch(params: any) {
    return this.msCityService.getAll(params);
  }

  getSenderUser(params: ListParams) {
    return this.msUsersService.getAllSegXAreas(params);
  }
}
