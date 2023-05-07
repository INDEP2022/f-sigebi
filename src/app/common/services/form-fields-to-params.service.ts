import { Injectable } from '@angular/core';
// date pipe angular
import { DatePipe } from '@angular/common';
//params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class FormFieldsToParamsService {
  constructor(private datePipe: DatePipe) {}

  /**
   * Revisar el objeto que se pasa como parametro y se retorna el mismo objeto con los campos vacios si es que son null o undefined.
   * Si se le pasa la fecha de inicio (from) se toma la fecha actual para la fecha final (to).
   * @param object Objeto del formulario (Campos del formulario)
   * @param params Se pasa el objeto donde se encuentran los parametros de la paginación (Objeto de parametros)
   * @param validParams Listado de parametros en string a utilizar en la paginación (Las propiedades de la interfaz params a utilizar)
   * @param pref Prefijo a utilizar en el filtro. Por ejemplo 'filter' y seria de la siguiente forma '&filter.nombreCampo'
   * @param nameDateBtw Nombre de el campo para el filtro de rango de fechas.
   * @param prefEqual Prefijo igual '=' para el campo a filtrar
   * @param prefBtw Prefijo entre 'rango' para el campo a filtrar de fechas
   * @returns Objeto de los parametros ya con los campos agregados y su paginacion
   */
  validFieldsFormToParams(
    object: any,
    params: ListParams,
    validParams: any[],
    pref: string,
    nameDateBtw?: string,
    prefEqual: string = '$eq:',
    prefBtw: string = '$btw:'
  ) {
    let clearObj: ListParams = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const param = params[key];
        if (param) {
          if (validParams.includes(key)) {
            // Guardar los parametros que se envian de la paginación
            clearObj[key] = param;
          }
        }
      }
    }
    let from: Date;
    let to: Date;
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        var element = object[key];
        // Guardar la fecha de inicio
        if (key == 'from') {
          from = element;
        }
        // Guardar la fecha máxima
        if (key == 'to') {
          if (element) {
            to = element;
          } else {
            element = new Date();
            to = element;
          }
        }
        if (element) {
          if (from && to) {
            // Validar rangos de fechas
            let fromParse = this.datePipe.transform(from, 'yyyy-MM-dd');
            let toParse = this.datePipe.transform(to, 'yyyy-MM-dd');
            clearObj[
              pref + '.' + nameDateBtw
            ] = `${prefBtw}${fromParse},${toParse}`;
            from = null;
            to = null;
          }
          if (key != 'from' && key != 'to') {
            // Agregar campos a filtrar

            //clearObj[pref + '.' + key] = `${prefEqual}${encodeURI(element)}`;
            clearObj[pref + '.' + key] = `${prefEqual}${
              key == 'officeNumber' || key == 'issue'
                ? element
                : encodeURI(element)
            }`;
          }
        }
      }
    }
    return clearObj;
  }
}
