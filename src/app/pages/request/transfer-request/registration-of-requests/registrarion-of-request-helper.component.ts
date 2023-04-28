import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
@Injectable()
export class RegistrationHelper extends BasePage {
  requestData: IRequest = {};

  constructor(
    private goodService: GoodService,
    private fractionService: FractionService,
    private goodEstateService: RealStateService,
    private wcontentService: WContentService
  ) {
    super();
  }

  getGoodQuantity(requestId: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();

      if (requestId) {
        params['filter.requestId'] = `$eq:${requestId}`;
        this.goodService.getAll(params).subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            if (error.error.message === 'No se encontraron registros.') {
              let good: any = {};
              good['count'] = 0;
              resolve(good);
            } else {
              reject(error.error.message);
            }
          },
        });
      }
    });
  }

  getFractionCode(fractionId: number) {
    return new Promise((resolve, reject) => {
      this.fractionService.getById(fractionId).subscribe({
        next: resp => {
          if (resp.fractionCode) {
            resolve(resp.fractionCode);
          } else {
            resolve('');
          }
        },
      });
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  //obtiene el bien inmueble
  getGoodRealEstate(id: number | string) {
    return new Promise((resolve, reject) => {
      this.goodEstateService.getById(id).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          resolve(0);
        },
      });
    });
  }

  getDocument(id: string) {
    return new Promise((resolve, reject) => {
      let body: any = {};
      body['xidSolicitud'] = id;
      this.wcontentService.getDocumentos(body).subscribe({
        next: (resp: any) => {
          //console.log(resp);
          const length = resp.data.length;
          resolve(length);
        },
        error: error => {
          resolve(0);
        },
      });
    });
  }

  async validateForm(request: any) {
    const idRequest = request.id;
    const idTrandference = Number(request.transferenceId);
    let validoOk = false;
    let allOk = false;

    const previousInquiry = request.previousInquiry;
    const circumstantialRecord = request.circumstantialRecord;
    const lawsuit = request.lawsuit;
    const protectNumber = request.protectNumber;
    const tocaPenal = request.tocaPenal;
    const paperNumber = request.paperNumber; //no oficio
    const transferenceFile = request.transferenceFile; //transferente expediente //pregunar si es ese campo o idTransferent
    const typeRecord = request.typeRecord; //tipo expediente
    const paperDate = request.paperDate; // fecha oficio
    const trialType = request.trialType;
    const urgentPriority = request.urgentPriority;
    const priorityDate = request.priorityDate;

    const lisDocument: any = await this.getDocument(idRequest);
    //Todo: verificar y obtener documentos de la solicitud
    /*if (request.recordId === null) {
      //Verifica si hay expediente
      this.message(
        'error',
        'Error sin expediente',
        'La solicitud no tiene expediente asociado'
      );
      validoOk = false;
    } else*/ if (lisDocument && lisDocument < 1) {
      this.message(
        'error',
        'Error sin archivos',
        'Se debe asociar un archivo a la solicitud'
      );
      validoOk = false;
    } else if (urgentPriority === 'Y' && priorityDate === null) {
      //TODO: Si lista de documentos es < 1 -> Se debe asociar un archivo a la solicitud
      this.message(
        'error',
        'Error',
        'Se marco la solicitud como urgente, se debe tener una fecha prioridad'
      );
      validoOk = false;
    } else if (idTrandference === 1) {
      if (paperNumber === '' || paperDate == null) {
        this.message(
          'error',
          'Error',
          'Para la transferente FGR los campos de No. Oficio y Fecha de Oficio no deben de ser nulos'
        );
        validoOk = false;
      } else if (circumstantialRecord === '' && previousInquiry === '') {
        this.message(
          'error',
          'Error',
          'Para la transferente FGR se debe tener al menos Acta Circunstancial o Averiguación Previa'
        );
      } else {
        validoOk = true;
      }
    } else if (idTrandference === 3) {
      if (paperNumber === '' || paperDate == null) {
        this.message(
          'error',
          'Error',
          'Para la transferente PJF los campos de No. Oficio y Fecha de Oficio no deben de ser nulos'
        );
      } else if (lawsuit === '' && protectNumber === '' && tocaPenal === '') {
        this.message(
          'error',
          'Error',
          'Para la trasnferente PJF se debe tener al menos Causa Penal o No. Amparo o Toca Penal'
        );
      } else {
        validoOk = true;
      }
    } else if (
      idTrandference === 120 ||
      idTrandference === 536 ||
      idTrandference === 752
    ) {
      if (
        // transferenceFile === '' || //TODO: EL CAMPO SE LLENA SOLO
        typeRecord === '' ||
        paperNumber === '' ||
        paperDate == null
      ) {
        this.message(
          'error',
          'Error',
          'Para la transferente SAT los campos Expediente Transferente, Tipo Expediente, No. Oficio y Fecha Oficio no pueden ser nulos'
        );
      } else {
        validoOk = true;
      }
    } else if (
      !(idTrandference === 1) &&
      !(idTrandference === 3) &&
      !(idTrandference === 120) &&
      !(idTrandference === 536) &&
      !(idTrandference === 752)
    ) {
      if (paperNumber === '' || paperDate == null) {
        this.message(
          'error',
          'Error',
          'Para transferentes no obligadas los campos No. Oficio y Fecha Oficio no deben de ser nulos'
        );
      } else {
        validoOk = true;
      }
    }

    let goods: any = null;
    if (validoOk === true) {
      goods = await this.getGoodQuantity(Number(request.id));
      if (goods.count < 1) {
        this.message(
          'error',
          'Error en los bienes',
          'La solicitud no cuenta con bienes a transferir'
        );
      } else {
        //validar bienes
        let sinDireccion: boolean = false;
        let sinTipoRelevante: boolean = false;
        let sinCantidad: boolean = false;
        let sinDestinoT: boolean = false;
        let sinUnidadM: boolean = false;
        let sinDescripcionT: boolean = false;
        let codigoFraccion: any = null;
        let faltaClasificacion: boolean = false;
        // variables para validaci�n de atributos por tipo de bien LIRH 06/02/2021
        let tipoRelVehiculo: boolean = false;
        let tipoRelAeronave: boolean = false;
        let tipoRelEmbarca: boolean = false;
        let tipoRelInmueble: boolean = false;
        let tipoRelJoya: boolean = false;
        let existBienInm: boolean = false;

        for (let i = 0; i < goods.data.length; i++) {
          const good = goods.data[i];

          if (good.addressId == null && good.idGoodProperty == null) {
            sinDireccion = true;
            this.message(
              'error',
              `Error en el bien ${good.goodDescription}`,
              'Todos los bienes deben tener asociada una dirección o deben ser menajes'
            );
            break;
          } else if (good.goodTypeId == null) {
            sinTipoRelevante = true;
            this.message(
              'error',
              `Error en el bien ${good.goodDescription}`,
              'Todos los bienes deben tener asignada una clasificación o tipo de bien'
            );
            break;
          } else if (
            good.quantity == null ||
            (good.quantity != null && Number.parseInt(good.quantity) < 1)
          ) {
            sinCantidad = true;
            this.message(
              'error',
              `Error en el bien ${good.goodDescription}`,
              'Todos los bienes deben tener una cantidad'
            );
            break;
          } else if (good.transferentDestiny == null) {
            sinDestinoT = true;
            this.message(
              'error',
              `Error en el bien ${good.goodDescription}`,
              'Todos los bienes deben tener un Destino Transferente'
            );
            break;
          } else if (good.ligieUnit == null) {
            sinUnidadM = true;
            this.message(
              'error',
              `Error en el bien ${good.goodDescription}`,
              'Todos los bienes deben tener una unidad de medida'
            );
            break;
          } /* else if (good.goodDescription == null) {
            sinDescripcionT = true;
            this.message(
              'error',
              `Error en el No. Gestion ${good.id}`,
              'Todos los bienes deben tener una descripción de bien transferente'
            );
            break;
          } */

          // Se valida si la clasificacion tenga 8 caracteres
          if (good.fractionId !== null) {
            /* const fractionCode: any = await this.getFractionCode(
              good.fractionId
            ); */
            if (
              good.fraccion.fractionCode === null ||
              good.fraccion.fractionCode.length != 8
            ) {
              faltaClasificacion = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'Todos los bienes deben tener un codigo de fracción de 8 numeros'
              );
              break;
            }
          } else {
            faltaClasificacion = true;
            this.message(
              'error',
              `Error en el bien ${good.goodDescription}`,
              'Todos los bienes deben tener un codigo de fracción de 8 numeros'
            );
            break;
          }

          //validar por el tipo de bien
          /* Tipo Inmueble */
          if (Number(good.goodTypeId) === 1) {
            existBienInm = true;
            if (good.idGoodProperty === null) {
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El id del bien inmueble no puede estar nulo, favor de complementar'
              );
              break;
            } else {
              const realEstate: any = await this.getGoodRealEstate(good.id); //
              if (realEstate.publicDeed === null) {
                tipoRelInmueble = true;
                this.message(
                  'error',
                  `Error en el bien ${good.goodDescription}`,
                  'El campo Escritura Pública en Bien Inmueble esta vacio, favor de complementar'
                );
                break;
              } else if (realEstate.forProblems === null) {
                tipoRelInmueble = true;
                this.message(
                  'error',
                  `Error en el bien ${good.goodDescription}`,
                  'El campo Problematicas en Bien Inmueble esta vacio, favor de complementar'
                );
                break;
              } else if (realEstate.problemDesc === null) {
                tipoRelInmueble = true;
                this.message(
                  'error',
                  `Error en el bien ${good.goodDescription}`,
                  'El campo Descripción de Problemática en Bien Inmueble esta vacio, favor de complementar'
                );
                break;
              } else if (realEstate.pubRegProperty === null) {
                tipoRelInmueble = true;
                this.message(
                  'error',
                  `Error en el bien ${good.goodDescription}`,
                  'El campo Registro Público de Propiedad en Bien Inmueble esta vacio, favor de complementar'
                );
                break;
              } else if (realEstate.propertyType == null) {
                tipoRelInmueble = true;
                this.message(
                  'error',
                  `Error en el bien ${good.goodDescription}`,
                  'El campo Tipo de Inmueble en Bien Inmueble esta vacio, favor de complementar'
                );
                break;
              }
            }
          } else if (Number(good.goodTypeId) === 2) {
            /**## Tipo Vehiculos ##*/
            if (good.fitCircular === null) {
              //apto para circular
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Apto para cirular en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } else if (good.brand === null) {
              //marca
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Marca en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } else if (good.model === null) {
              //modelo
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Modelo en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } else if (good.axesNumber === null) {
              //numero de ejes
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Número de Ejes en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } else if (good.engineNumber === null) {
              //numero de motor
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Número de Motor en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } /* else if (good.origin === null) {
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Procedencia en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } */ else if (good.theftReport === null) {
              //reporte de robos
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Reporte de Robo en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } else if (good.serie === null) {
              // serie
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Serie en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            } else if (good.subBrand === null) {
              //sub marca
              tipoRelVehiculo = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Sub-Marca en Información del Vehículo esta vacio, favor de complementar'
              );
              break;
            }
          } else if (Number(good.goodTypeId) === 3) {
            /**## Tipo Embarcaciones ##*/
            if (good.manufacturingYear === null) {
              // ano de manufacturacion
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Año de Fabricación en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } else if (good.flag === null) {
              //bandera
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Bandera en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } else if (good.openwork === null) {
              //calado
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Calado en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } /* else if (good.capacity === null) {
              //capacidad
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Capacidad en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } */ else if (good.length === null) {
              //eslora
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Eslora en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } else if (good.operationalState === null) {
              //estado operativo
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Estado Operativo en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } /* else if (good.tuition === null) {
              //Matricula
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Matrícula en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } */ else if (good.shipName === null) {
              //Nombre Barco
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Nombre de Embarcacion en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } else if (good.engineNumber === null) {
              //Num Motor
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Num. Motor en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } else if (good.enginesNumber === null) {
              //Num Motores
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Num. Motores en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } /* else if (good.origin === null) {
              //Procedencia
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Procedencia en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            } */ else if (good.publicRegistry === null) {
              //Registro Publico de la embarcación
              tipoRelEmbarca = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Registro Publico de la Embarcación en Información de la Embarcación esta vacio, favor de complementar'
              );
              break;
            }
          } else if (Number(good.goodTypeId) === 4) {
            // Aeronaves
            if (good.operationalState === null) {
              //Estado Operativo
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Estado Operativo en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } /* else if (good.tuition === null) {
              //Matricula
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Matrícula en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } */ else if (good.model === null) {
              //Modelo
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Modelo en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } else if (good.engineNumber === null) {
              //Num Motor
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Num. Motor en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } else if (good.enginesNumber === null) {
              //Num Motores
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Num. Motores en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } /* else if (good.origin === null) {
              //Procedencia
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Procedencia en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } */ else if (good.dgacRegistry === null) {
              //Registro Direccion Gral
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Registro Direccion Gral. ... en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } else if (good.serie === null) {
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Serie en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            } else if (good.airplaneType === null) {
              tipoRelAeronave = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Tipo de Avión en Información de Aereonave esta vacio, favor de complementar'
              );
              break;
            }
          } else if (Number(good.goodTypeId) === 5) {
            // Joyas
            if (good.caratage === null) {
              tipoRelJoya = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Kilataje en Información de Joya esta vacio, favor de complementar'
              );
              break;
            } else if (good.material === null) {
              tipoRelJoya = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Material en Información de Joya esta vacio, favor de complementar'
              );
              break;
            } else if (good.weight === null) {
              tipoRelJoya = true;
              this.message(
                'error',
                `Error en el bien ${good.goodDescription}`,
                'El campo Peso en Información de Joya esta vacio, favor de complementar'
              );
              break;
            }
          }
        }

        if (
          tipoRelInmueble === false &&
          tipoRelVehiculo === false &&
          tipoRelEmbarca === false &&
          tipoRelAeronave === false &&
          tipoRelJoya === false &&
          faltaClasificacion === false &&
          sinDireccion === false &&
          sinTipoRelevante === false &&
          sinCantidad === false &&
          sinDestinoT === false &&
          sinUnidadM === false
        ) {
          allOk = true;
        }
      }
      return allOk;
    } else {
      return false;
    }
  }
}
