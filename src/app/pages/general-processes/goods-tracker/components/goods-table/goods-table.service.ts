import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LinkCellComponent } from 'src/app/@standalone/smart-table/link-cell/link-cell.component';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
const ORIGIN = 'FCONGENRASTREADOR';
const TYPES = {
  PROCEDENCIA: 'PROCEDENCIA',
  DEVOLUCION: 'DEVOLUCION',
  DECOMISO: 'DECOMISO',
  DONACION: 'DONACION',
  DESTINO: 'DESTINO',
  RESARCIMIENTO: 'RESARCIMIENTO',
};
@Injectable({ providedIn: 'root' })
/**
 * !IMPORTANTE: ESTE SERVICIO SOLO SE USA EN LA PANTALLA DEL RASTREADOR DE BIENES
 */
export class GoodsTableService {
  columns = {
    select: {
      title: 'Selección',
      type: 'custom',
      renderComponent: CheckboxElementComponent,
      onComponentInitFunction: (instance: CheckboxElementComponent) => {
        instance.toggle.subscribe(resp => {
          resp.row.select = resp.toggle;
        });
      },
    },
    numberPhotos: {
      title: 'No. Fotos',
      sort: false,
      valuePrepareFunction: (value: string | number) => Number(value),
    },
    fileNumber: {
      title: 'No. Expediente',
      sort: false,
    },
    goodNumber: {
      title: 'No. Bien',
      sort: false,
    },
    socialCabite: {
      title: 'Gabinete Social',
      sort: false,
    },
    parentGoodPartialNumber: {
      title: 'No. Bien Padre Parcialización',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/judicial-physical-reception/partializes-general-goods'],
            {
              queryParams: {
                numberGood:
                  trackedGood.parentGoodPartialNumber ?? trackedGood.goodNumber,
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-primary',
    },
    parentGoodMenajeNumber: {
      title: 'No. Bien Padre Menaje',
      sort: false,
      class: 'bg-primary',
    },

    quantity: {
      title: 'Cantidad',
      sort: false,
      class: 'bg-primary',
    },
    concilitate: {
      title: 'Conciliado',
      sort: false,
      class: 'bg-primary',
    },
    measurementUnit: {
      title: 'Unidad Medida',
      sort: false,
      class: 'bg-primary',
    },
    appraisalValue: {
      title: 'Valor Avalúo',
      sort: false,
      class: 'bg-primary',
    },
    keyAppraisalCurrency: {
      title: 'Moneda Avalúo',
      sort: false,
      class: 'bg-primary',
    },
    apraisalDateVig: {
      title: 'Fecha Avalúo Vigente',
      sort: false,
      class: 'bg-primary',
    },
    goodStatus: {
      title: 'Estatus',
      sort: false,
      class: 'bg-primary',
    },
    extDomProcess: {
      title: 'Proceso',
      sort: false,
      class: 'bg-primary',
    },
    statusDescription: {
      title: 'Descripción Estatus',
      sort: false,
      class: 'bg-primary',
    },
    goodDescription: {
      title: 'Descripción del Bien',
      sort: false,
      class: 'bg-primary',
    },
    destiny: {
      title: 'Identificador de Destino',
      sort: false,
      class: 'bg-primary',
    },
    clasif: {
      title: 'Número de Clasificación',
      sort: false,
      class: 'bg-primary',
    },
    goodType: {
      title: 'Tipo de Bien',
      sort: false,
      class: 'bg-primary',
    },
    goodStype: {
      title: 'Subtipo de Bien',
      sort: false,
      class: 'bg-primary',
    },
    goodSsType: {
      title: 'Ssubtipo de Bien',
      sort: false,
      class: 'bg-primary',
    },
    propertyCisiId: {
      title: 'Id Inmueble Cisi',
      sort: false,
      class: 'bg-primary',
    },
    inventorySiabiId: {
      title: 'Inv. SIABI / CVE_UNICA',
      sort: false,
      class: 'bg-primary',
    },
    evictionDayDay: {
      title: 'Desalojo Día a Día',
      sort: false,
      class: 'bg-primary',
    },
    goodObservations: {
      title: 'Observaciones',
      sort: false,
      class: 'bg-primary',
    },
    photoDate: {
      title: 'Fecha Última Foto',
      sort: false,
      class: 'bg-primary',
    },
    programmingConstentKey: {
      title: 'Constancia de Entrega',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/final-destination-process/proof-of-delivery'],
            {
              queryParams: {
                numberGood:
                  trackedGood.parentGoodPartialNumber ?? trackedGood.goodNumber,
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-warning',
    },
    transfereeMinuteNumber: {
      title: 'No. Transferente Entrega',
      sort: false,
      class: 'bg-warning',
    },
    transfereeMinute: {
      title: 'Descripción Transferente Entrega',
      sort: false,
      class: 'bg-warning',
    },
    keyReceptionMinutes: {
      title: 'Acta Entrega Recepción',
      sort: false,
      class: 'bg-warning',
    },
    positionExt: {
      title: 'Puesta a Disposición',
      sort: false,
      class: 'bg-warning',
    },
    dateReceptionPhisical: {
      title: 'Fecha Recepción Física',
      sort: false,
      class: 'bg-warning',
    },
    entryDate: {
      title: 'Fecha Entrada',
      sort: false,
      class: 'bg-warning',
    },
    keyForfeitureMinutes: {
      title: 'Acta Decomiso',
      sort: false,
      class: 'bg-warning',
    },
    keyDestMinutes: {
      title: 'Acta Destino',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //global NO_EXPEDIENTE_F
          this.router.navigate(
            ['/pages/final-destination-process/destination-acts'],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-warning',
    },
    keyDestructionMinutes: {
      title: 'Acta Destrucción',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //global NO_EXPEDIENTE_F TIPO_DICTA_F
          this.router.navigate(
            ['/pages/final-destination-process/destruction-acts'],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-warning',
    },
    keyDevolutionMinutes: {
      title: 'Acta Devolución',
      sort: false,
      class: 'bg-warning',
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //global NO_EXPEDIENTE_F TIPO_DICTA_F
          this.router.navigate(
            ['/pages/final-destination-process/return-acts'],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
    },
    compensationMinute: {
      title: 'Acta Resarcimiento',
      sort: false,
      class: 'bg-warning',
    },
    keyDonationContract: {
      title: 'Contrato o Convenio de Donación',
      sort: false,
      class: 'bg-warning',
    },
    extDomIniProcess: {
      title: 'Historico del Bien',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/general-processes/historical-good-situation'],
            {
              queryParams: {
                origin: ORIGIN,
                noBien: trackedGood.goodNumber,
              },
            }
          );
        });
      },
      class: 'bg-warning',
    },
    keyOpinionOrigin: {
      title: 'Dictamen Procedencia',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: null, //consulta de service
              TIPO_VO: null, //consulta de service
              TIPO_DIC: TYPES.PROCEDENCIA,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
            },
          });
        });
      },
      class: 'bg-success',
    },
    forfeitureDict: {
      title: 'Dictamen Decomiso',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: null, //consulta de service
              TIPO_VO: null, //consulta de service
              TIPO_DIC: TYPES.DECOMISO,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
              CLAVE_OFICIO_ARMADA: trackedGood.forfeitureDict,
            },
          });
        });
      },
      class: 'bg-success',
    },
    dictDevolution: {
      title: 'Dictamen Devolución',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: null, //consulta de service
              TIPO_VO: null, //consulta de service
              TIPO_DIC: TYPES.DEVOLUCION,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
              CLAVE_OFICIO_ARMADA: trackedGood.dictDevolution,
            },
          });
        });
      },
      class: 'bg-success',
    },
    compensationDict: {
      title: 'Dictamen Resarcimiento',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: null, //consulta de service
              TIPO_VO: null, //consulta de service
              TIPO_DIC: TYPES.RESARCIMIENTO,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
              CLAVE_OFICIO_ARMADA: trackedGood.compensationDict,
            },
          });
        });
      },
      class: 'bg-success',
    },
    dictDestruction: {
      title: 'Dictamen Destrucción',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling'], {
            queryParams: {
              origin: ORIGIN,
              NO_EXP: trackedGood.fileNumber,
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
            },
          });
        });
      },
      class: 'bg-success',
    },
    destinyDict: {
      title: 'Dictamen Destino',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: null, //consulta de service
              TIPO_VO: null, //consulta de service
              TIPO_DIC: TYPES.DESTINO,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
              CLAVE_OFICIO_ARMADA: trackedGood.destinyDict,
            },
          });
        });
      },
      class: 'bg-success',
    },
    donationDict: {
      title: 'Dictamen Donación',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: null, //consulta de service
              TIPO_VO: null, //consulta de service
              TIPO_DIC: TYPES.DONACION,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
              CLAVE_OFICIO_ARMADA: trackedGood.donationDict,
            },
          });
        });
      },
      class: 'bg-success',
    },
    abandonmentDict: {
      title: 'Dictamen Abandono',
      sort: false,
      class: 'bg-success',
    },
    managementNumber: {
      title: 'Oficio Gestión',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            [
              '/pages/documents-reception/flyers-registration/related-document-management/1',
            ],
            {
              queryParams: {
                origin: ORIGIN,
                EXPEDIENTE: trackedGood.fileNumber,
                VOLANTE: null, //consulta de service
              },
            }
          );
        });
      },
      class: 'bg-success',
    },
    adminCoord: {
      title: 'Coord. / Delegación que Recibe',
      sort: false,
      class: 'bg-success-soft',
    },
    warehouseType: {
      title: 'Tipo Almacén',
      sort: false,
      class: 'bg-success-soft',
    },
    delegationRes: {
      title: 'Delegación Responsable',
      sort: false,
      class: 'bg-success-soft',
    },
    warehouseNumber: {
      title: 'Almacén',
      sort: false,
      class: 'bg-success-soft',
    },
    warehouseCity: {
      title: 'Almacén Ciudad',
      sort: false,
      class: 'bg-success-soft',
    },
    warehosueState: {
      title: 'Almacén Estado',
      sort: false,
      class: 'bg-success-soft',
    },
    satUbicationWarehouse: {
      title: 'SAT Ubicación Almacén',
      sort: false,
      class: 'bg-success-soft',
    },
    vaultNumber: {
      title: 'No. Bovéda',
      sort: false,
      class: 'bg-success-soft',
    },
    vaultDesc: {
      title: 'Desc. Bovéda',
      sort: false,
      class: 'bg-success-soft',
    },
    transfereeD: {
      title: 'Transferente Puesta a Disposición',
      sort: false,
    },
    emitter: {
      title: 'Emisora',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: null, //consulta de service
              },
            }
          );
        });
      },
    },
    authority: {
      title: 'Autoridad',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: null, //consulta de service
              },
            }
          );
        });
      },
    },
    avPrev: {
      title: 'Averiguación Previa',
      sort: false,
    },
    penalizeCause: {
      title: 'Causa Penal',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: null, //consulta de service
              },
            }
          );
        });
      },
    },
    transfereeExp: {
      title: 'Expediente Transferente',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: null, //consulta de service
              },
            }
          );
        });
      },
    },
    identificator: {
      title: 'Identificador',
      sort: false,
    },
    nameIndicated: {
      title: 'Indiciado',
      sort: false,
    },
    keyEvent: {
      title: 'Clave del Evento',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-info',
    },
    lotEvent: {
      title: 'No. Evento y No. Lote',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-info',
    },
    evelotStatus: {
      title: 'Estatus del Evento y Lote',
      sort: false,
      class: 'bg-info',
    },
    invoiceNumber: {
      title: 'No. Factura',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-info',
    },
    eventDate: {
      title: 'Fec. Evento',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
              },
            }
          );
        });
      },
      class: 'bg-info',
    },
    comerAppraisalActive: {
      title: 'Avalúo  Vigente',
      sort: false,
      class: 'bg-info',
    },

    val1: {
      title: 'Atributo Variable 1',
      sort: false,
    },
    val2: {
      title: 'Atributo Variable 2',
      sort: false,
    },
    val3: {
      title: 'Atributo Variable 3',
      sort: false,
    },
    val4: {
      title: 'Atributo Variable 4',
      sort: false,
    },
    val5: {
      title: 'Atributo Variable 5',
      sort: false,
    },
    val6: {
      title: 'Atributo Variable 6',
      sort: false,
    },
    val7: {
      title: 'Atributo Variable 7',
      sort: false,
    },
    val8: {
      title: 'Atributo Variable 8',
      sort: false,
    },
    val9: {
      title: 'Atributo Variable 9',
      sort: false,
    },
    val10: {
      title: 'Atributo Variable 10',
      sort: false,
    },
    val11: {
      title: 'Atributo Variable 11',
      sort: false,
    },
    val12: {
      title: 'Atributo Variable 12',
      sort: false,
    },
    val13: {
      title: 'Atributo Variable 13',
      sort: false,
    },
    val14: {
      title: 'Atributo Variable 14',
      sort: false,
    },
    val15: {
      title: 'Atributo Variable 15',
      sort: false,
    },
    val16: {
      title: 'Atributo Variable 16',
      sort: false,
    },
    val17: {
      title: 'Atributo Variable 17',
      sort: false,
    },
    val18: {
      title: 'Atributo Variable 18',
      sort: false,
    },
    val19: {
      title: 'Atributo Variable 19',
      sort: false,
    },
    val20: {
      title: 'Atributo Variable 20',
      sort: false,
    },
    val21: {
      title: 'Atributo Variable 21',
      sort: false,
    },
    val22: {
      title: 'Atributo Variable 22',
      sort: false,
    },
    val23: {
      title: 'Atributo Variable 23',
      sort: false,
    },
    val24: {
      title: 'Atributo Variable 24',
      sort: false,
    },
    val25: {
      title: 'Atributo Variable 25',
      sort: false,
    },
    val26: {
      title: 'Atributo Variable 26',
      sort: false,
    },
    val27: {
      title: 'Atributo Variable 27',
      sort: false,
    },
    val28: {
      title: 'Atributo Variable 28',
      sort: false,
    },
    val29: {
      title: 'Atributo Variable 29',
      sort: false,
    },
    val30: {
      title: 'Atributo Variable 30',
      sort: false,
    },
    val31: {
      title: 'Atributo Variable 31',
      sort: false,
    },
    val32: {
      title: 'Atributo Variable 32',
      sort: false,
    },
    val33: {
      title: 'Atributo Variable 33',
      sort: false,
    },
    val34: {
      title: 'Atributo Variable 34',
      sort: false,
    },
    val35: {
      title: 'Atributo Variable 35',
      sort: false,
    },
    val36: {
      title: 'Atributo Variable 36',
      sort: false,
    },
    val37: {
      title: 'Atributo Variable 37',
      sort: false,
    },
    val38: {
      title: 'Atributo Variable 38',
      sort: false,
    },
    val39: {
      title: 'Atributo Variable 39',
      sort: false,
    },
    val40: {
      title: 'Atributo Variable 40',
      sort: false,
    },
    val41: {
      title: 'Atributo Variable 41',
      sort: false,
    },
    val42: {
      title: 'Atributo Variable 42',
      sort: false,
    },
    val43: {
      title: 'Atributo Variable 43',
      sort: false,
    },
    val44: {
      title: 'Atributo Variable 44',
      sort: false,
    },
    val45: {
      title: 'Atributo Variable 45',
      sort: false,
    },
    val46: {
      title: 'Atributo Variable 46',
      sort: false,
    },
    val47: {
      title: 'Atributo Variable 47',
      sort: false,
    },
    val48: {
      title: 'Atributo Variable 48',
      sort: false,
    },
    val49: {
      title: 'Atributo Variable 49',
      sort: false,
    },
    val50: {
      title: 'Atributo Variable 50',
      sort: false,
    },
  };

  constructor(private router: Router) {}
}
