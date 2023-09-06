import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, map, of, Subject, take, tap } from 'rxjs';
import { LinkCellComponent } from 'src/app/@standalone/smart-table/link-cell/link-cell.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';

const ORIGIN = 'FCONGENRASTREADOR';
const SOCIAL_G_STATUSES: any = {
  1: 'Susceptible',
  2: 'Asignado',
  3: 'Entregado',
  4: 'Liberado',
};
const TYPES = {
  PROCEDENCIA: 'PROCEDENCIA',
  DEVOLUCION: 'DEVOLUCION',
  DECOMISO: 'DECOMISO',
  DONACION: 'DONACION',
  DESTINO: 'DESTINO',
  RESARCIMIENTO: 'RESARCIMIENTO',
  ABANDONO: 'ABANDONO',
};
@Injectable({ providedIn: 'root' })
/**
 * !IMPORTANTE: ESTE SERVICIO SOLO SE USA EN LA PANTALLA DEL RASTREADOR DE BIENES
 */
export class GoodsTableService extends BasePage {
  columns = {
    numberPhotos: {
      title: 'No. Fotos',
      sort: false,
      valuePrepareFunction: (value: string | number) => Number(value),
      class: '',
    },
    fileNumber: {
      title: 'No. Expediente',
      class: '',
      sort: false,
    },
    goodNumber: {
      title: 'No. Bien',
      sort: false,
      class: '',
    },
    socialCabite: {
      title: 'Gabinete Social',
      sort: false,
      class: '',
      valuePrepareFunction: (value: string) =>
        value ? SOCIAL_G_STATUSES[value] ?? 'Desconocido' : '',
    },
    parentGoodPartialNumber: {
      title: 'No. Bien Padre Parcialización',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.validateValue = false;
        instance.onNavigate.subscribe(trackedGood => {
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/judicial-physical-reception/partializes-goods'],
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
    status: {
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
      title: 'No. Clasificación',
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
        instance.onNavigate.subscribe(async trackedGood => {
          //global NO_EXPEDIENTE_F
          const expedient = await this.getGlobalExpedientF3({
            pGoodNumber: trackedGood.goodNumber,
            pConstEntKey: trackedGood.programmingConstentKey as string,
          });
          if (!expedient) {
            this.alert('warning', 'El bien no tiene expediente', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/final-destination-process/proof-of-delivery'],
            {
              queryParams: {
                origin: ORIGIN,
                NO_EXPEDIENTE_F: expedient,
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
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const expedient = await this.getGlobalExpedientF({
            pCveActa: trackedGood.keyReceptionMinutes as string,
            pGoodNumber: trackedGood.goodNumber,
            pDelivery: 'ENTREGA',
          });
          if (!expedient) {
            this.alert('warning', 'El bien no tiene expediente', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/judicial-physical-reception/confiscated-records'],
            {
              queryParams: {
                origin: ORIGIN,
                NO_EXPEDIENTE_F: expedient ?? trackedGood.fileNumber,
              },
            }
          );
        });
      },
    },
    keyCancelationMinutes: {
      title: 'Acta Recepción Canc. / Susp.',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const expedient = await this.getGlobalExpedientF2({
            pGoodNumber: trackedGood.goodNumber,
            pCveActa: trackedGood.keyCancelationMinutes as string,
            pRecepCan: 'RECEPCAN',
            pSuspension: 'SUSPENSION',
          });
          if (!expedient) {
            this.alert('warning', 'El bien no tiene expediente', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/judicial-physical-reception/cancellation-recepcion'],
            {
              queryParams: {
                origin: ORIGIN,
                NO_EXPEDIENTE_F: expedient,
              },
            }
          );
        });
      },
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
        instance.onNavigate.subscribe(async trackedGood => {
          const expedient = await this.getGlobalExpedientF({
            pGoodNumber: trackedGood.goodNumber,
            pCveActa: trackedGood.keyDestMinutes as string,
            pDelivery: 'DESTINO',
          });
          if (!expedient) {
            this.alert('warning', 'El bien no tiene expediente', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/final-destination-process/destination-acts'],
            {
              queryParams: {
                origin: ORIGIN,
                noExpedient: expedient,
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
        instance.onNavigate.subscribe(async trackedGood => {
          const expedient = await this.getExpedientDeliveryRecep(
            trackedGood.keyDestructionMinutes as string,
            'DESTRUCCION'
          );
          if (!expedient) {
            this.alert('warning', 'El bien no tiene expediente', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/final-destination-process/destruction-acts'],
            {
              queryParams: {
                origin: ORIGIN,
                NO_EXPEDIENTE_F: expedient ?? trackedGood.fileNumber,
                TIPO_DICTA_F: 'DESTRUCCION',
              },
            }
          );
        });
      },
      // onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
      //   instance.onNavigate.subscribe(trackedGood => {
      //     //global NO_EXPEDIENTE_F TIPO_DICTA_F
      //     this.getGlobalVars().subscribe(global => {
      //       this.globalVarService.updateGlobalVars({
      //         ...global,
      //         NO_EXPEDIENTE_F: trackedGood.fileNumber,
      //         TIPO_DICTA_F: 'DESTRUCCION',
      //       });
      //       this.stateFlag.next();
      //       this.router.navigate(
      //         ['/pages/final-destination-process/proof-of-delivery'],
      //         {
      //           queryParams: {
      //             origin: ORIGIN,
      //           },
      //         }
      //       );
      //     });
      //   });
      // },
      class: 'bg-warning',
    },
    keyDevolutionMinutes: {
      title: 'Acta Devolución',
      sort: false,
      class: 'bg-warning',
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const expedient = trackedGood.fileNumber;
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/final-destination-process/return-acts'],
            {
              queryParams: {
                origin: ORIGIN,
                expediente: expedient,
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
      title: 'Histórico del Proceso',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(trackedGood => {
          this.stateFlag.next();
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
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.keyOpinionOrigin,
            pOrigin: TYPES.PROCEDENCIA,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          this.stateFlag.next();
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.forfeitureDict,
            pOrigin: TYPES.DECOMISO,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          if (!flyerType) {
            this.alert('warning', 'El bien no tiene tipo de volante', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.dictDevolution,
            pOrigin: TYPES.DEVOLUCION,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          if (!flyerType) {
            this.alert('warning', 'El bien no tiene tipo de volante', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.compensationDict,
            pOrigin: TYPES.RESARCIMIENTO,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          if (!flyerType) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
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
          this.stateFlag.next();
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
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.destinyDict,
            pOrigin: TYPES.DESTINO,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          this.stateFlag.next();
          if (!flyerType) {
            this.alert('warning', 'El bien no tiene tipo de volante', '');
            return;
          }
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.donationDict,
            pOrigin: TYPES.DONACION,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          if (!flyerType) {
            this.alert('warning', 'El bien no tiene tipo de volante', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
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
      type: 'custom',
      class: 'bg-success',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getDictation({
            pDictOrigin: trackedGood.abandonmentDict,
            pOrigin: TYPES.ABANDONO,
            goodNumber: trackedGood.goodNumber,
          });
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          const flyerType = await this.getNotificationType(flyer);
          if (!flyerType) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
            queryParams: {
              origin: ORIGIN,
              EXPEDIENTE: trackedGood.fileNumber,
              VOLANTE: flyer, //consulta de service
              TIPO_VO: flyerType, //consulta de service
              TIPO_DIC: TYPES.ABANDONO,
              CONSULTA: 'S',
              P_GEST_OK: '',
              P_NO_TRAMITE: '',
              CLAVE_OFICIO_ARMADA: trackedGood.abandonmentDict,
            },
          });
        });
      },
    },
    keyPositionRelief: {
      title: 'Cve. Oficio',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const flyer = await this.getFlyerGest(
            trackedGood.goodNumber,
            trackedGood.keyPositionRelief
          );
          if (!flyer) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.stateFlag.next();
          this.router.navigate(
            [
              '/pages/documents-reception/flyers-registration/related-document-management/1',
            ],
            {
              queryParams: {
                ORIGIN,
                EXPEDIENTE: trackedGood.fileNumber,
                VOLANTE: Number(flyer) ?? '',
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
      title: 'No. Almacén',
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
      title: 'No. Bóveda',
      sort: false,
      class: 'bg-success-soft',
    },
    vaultDesc: {
      title: 'Desc. Bóveda',
      sort: false,
      class: 'bg-success-soft',
    },
    // ! Autoridad 'emisora'
    // emisorAuthority: {
    //   title: 'Autoridad Emisora',
    //   sort: false,
    //   type: 'custom',
    //   renderComponent: LinkCellComponent<ITrackedGood>,
    //   onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
    //     instance.onNavigate.subscribe(async trackedGood => {
    //       const no_vol = await this.getVWheel({
    //         pExpedientNumber: trackedGood.fileNumber,
    //         pGoodNumber: trackedGood.goodNumber,
    //       });
    //       this.docsDataService.flyersRegistrationParams = {
    //         pIndicadorSat: null,
    //         pGestOk: 1,
    //         pNoVolante: no_vol,
    //         pNoTramite: null,
    //         pSatTipoExp: null,
    //         noTransferente: null,
    //       };
    //       this.stateFlag.next();
    //       this.router.navigate(
    //         ['/pages/documents-reception/flyers-registration'],
    //         {
    //           queryParams: {
    //             origin: ORIGIN,
    //             P_NO_VOLANTE: no_vol, //consulta de service
    //           },
    //         }
    //       );
    //     });
    //   },
    // },
    transfereeD: {
      title: 'Transferente Puesta a Disposición',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const no_vol = await this.getVWheel({
            pExpedientNumber: trackedGood.fileNumber,
            pGoodNumber: trackedGood.goodNumber,
          });

          if (!no_vol) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.docsDataService.flyersRegistrationParams = {
            pIndicadorSat: null,
            pGestOk: 1,
            pNoVolante: no_vol,
            pNoTramite: null,
            pSatTipoExp: null,
            noTransferente: null,
          };
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: no_vol, //consulta de service
              },
            }
          );
        });
      },
    },
    emitter: {
      title: 'Emisora',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const no_vol = await this.getVWheel({
            pExpedientNumber: trackedGood.fileNumber,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!no_vol) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.docsDataService.flyersRegistrationParams = {
            pIndicadorSat: null,
            pGestOk: 1,
            pNoVolante: no_vol,
            pNoTramite: null,
            pSatTipoExp: null,
            noTransferente: null,
          };
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: no_vol, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const no_vol = await this.getVWheel({
            pExpedientNumber: trackedGood.fileNumber,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!no_vol) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.docsDataService.flyersRegistrationParams = {
            pIndicadorSat: null,
            pGestOk: 1,
            pNoVolante: no_vol,
            pNoTramite: null,
            pSatTipoExp: null,
            noTransferente: null,
          };
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: no_vol, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const no_vol = await this.getVWheel({
            pExpedientNumber: trackedGood.fileNumber,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!no_vol) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.docsDataService.flyersRegistrationParams = {
            pIndicadorSat: null,
            pGestOk: 1,
            pNoVolante: no_vol,
            pNoTramite: null,
            pSatTipoExp: null,
            noTransferente: null,
          };
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: no_vol, //consulta de service
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
        instance.onNavigate.subscribe(async trackedGood => {
          const no_vol = await this.getVWheel({
            pExpedientNumber: trackedGood.fileNumber,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!no_vol) {
            this.alert('warning', 'El bien no tiene volante', '');
            return;
          }
          this.docsDataService.flyersRegistrationParams = {
            pIndicadorSat: null,
            pGestOk: 1,
            pNoVolante: no_vol,
            pNoTramite: null,
            pSatTipoExp: null,
            noTransferente: null,
          };
          this.stateFlag.next();
          this.router.navigate(
            ['/pages/documents-reception/flyers-registration'],
            {
              queryParams: {
                origin: ORIGIN,
                P_NO_VOLANTE: no_vol, //consulta de service
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
      title: 'Cve. Evento',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const eventKey = await this.getEventKey({
            pcveEvent: trackedGood.keyEvent as string,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!eventKey) {
            this.alert('warning', 'El bien no tiene evento', '');
            return;
          }
          const goodNum = await this.getEventGlobal(trackedGood.goodNumber);
          console.log({ eventKey, goodNum });
          this.stateFlag.next();
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
                ID_EVENTO_F: eventKey,
                NO_BIEN_F: goodNum,
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
        instance.onNavigate.subscribe(async trackedGood => {
          const eventKey = await this.getEventKey({
            pcveEvent: trackedGood.keyEvent as string,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!eventKey) {
            this.alert('warning', 'El bien no tiene evento', '');
            return;
          }
          const goodNum = await this.getEventGlobal(trackedGood.goodNumber);
          console.log({ eventKey, goodNum });
          this.stateFlag.next();
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
                ID_EVENTO_F: eventKey,
                NO_BIEN_F: goodNum,
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
        instance.onNavigate.subscribe(async trackedGood => {
          const eventKey = await this.getEventKey({
            pcveEvent: trackedGood.keyEvent as string,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!eventKey) {
            this.alert('warning', 'El bien no tiene evento', '');
            return;
          }
          const goodNum = await this.getEventGlobal(trackedGood.goodNumber);
          console.log({ eventKey, goodNum });
          this.stateFlag.next();
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
                ID_EVENTO_F: eventKey,
                NO_BIEN_F: goodNum,
              },
            }
          );
        });
      },
      class: 'bg-info',
    },
    eventDate: {
      title: 'Fecha Evento',
      sort: false,
      type: 'custom',
      renderComponent: LinkCellComponent<ITrackedGood>,
      onComponentInitFunction: (instance: LinkCellComponent<ITrackedGood>) => {
        instance.onNavigate.subscribe(async trackedGood => {
          const eventKey = await this.getEventKey({
            pcveEvent: trackedGood.keyEvent as string,
            pGoodNumber: trackedGood.goodNumber,
          });
          if (!eventKey) {
            this.alert('warning', 'El bien no tiene evento', '');
            return;
          }
          const goodNum = await this.getEventGlobal(trackedGood.goodNumber);
          console.log({ eventKey, goodNum });
          this.stateFlag.next();
          //Globals ID_EVENTO_F NO_BIEN_F
          this.router.navigate(
            [
              '/pages/commercialization/consultation-goods-commercial-process-tabs',
            ],
            {
              queryParams: {
                origin: ORIGIN,
                ID_EVENTO_F: eventKey,
                NO_BIEN_F: goodNum,
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
      class: 'bg-primary',
    },
    val2: {
      title: 'Atributo Variable 2',
      sort: false,
      class: 'bg-primary',
    },
    val3: {
      title: 'Atributo Variable 3',
      sort: false,
      class: 'bg-primary',
    },
    val4: {
      title: 'Atributo Variable 4',
      sort: false,
      class: 'bg-primary',
    },
    val5: {
      title: 'Atributo Variable 5',
      sort: false,
      class: 'bg-primary',
    },
    val6: {
      title: 'Atributo Variable 6',
      sort: false,
      class: 'bg-primary',
    },
    val7: {
      title: 'Atributo Variable 7',
      sort: false,
      class: 'bg-primary',
    },
    val8: {
      title: 'Atributo Variable 8',
      sort: false,
      class: 'bg-primary',
    },
    val9: {
      title: 'Atributo Variable 9',
      sort: false,
      class: 'bg-primary',
    },
    val10: {
      title: 'Atributo Variable 10',
      sort: false,
      class: 'bg-primary',
    },
    val11: {
      title: 'Atributo Variable 11',
      sort: false,
      class: 'bg-primary',
    },
    val12: {
      title: 'Atributo Variable 12',
      sort: false,
      class: 'bg-primary',
    },
    val13: {
      title: 'Atributo Variable 13',
      sort: false,
      class: 'bg-primary',
    },
    val14: {
      title: 'Atributo Variable 14',
      sort: false,
      class: 'bg-primary',
    },
    val15: {
      title: 'Atributo Variable 15',
      sort: false,
      class: 'bg-primary',
    },
    val16: {
      title: 'Atributo Variable 16',
      sort: false,
      class: 'bg-primary',
    },
    val17: {
      title: 'Atributo Variable 17',
      sort: false,
      class: 'bg-primary',
    },
    val18: {
      title: 'Atributo Variable 18',
      sort: false,
      class: 'bg-primary',
    },
    val19: {
      title: 'Atributo Variable 19',
      sort: false,
      class: 'bg-primary',
    },
    val20: {
      title: 'Atributo Variable 20',
      sort: false,
      class: 'bg-primary',
    },
    val21: {
      title: 'Atributo Variable 21',
      sort: false,
      class: 'bg-primary',
    },
    val22: {
      title: 'Atributo Variable 22',
      sort: false,
      class: 'bg-primary',
    },
    val23: {
      title: 'Atributo Variable 23',
      sort: false,
      class: 'bg-primary',
    },
    val24: {
      title: 'Atributo Variable 24',
      sort: false,
      class: 'bg-primary',
    },
    val25: {
      title: 'Atributo Variable 25',
      sort: false,
      class: 'bg-primary',
    },
    val26: {
      title: 'Atributo Variable 26',
      sort: false,
      class: 'bg-primary',
    },
    val27: {
      title: 'Atributo Variable 27',
      sort: false,
      class: 'bg-primary',
    },
    val28: {
      title: 'Atributo Variable 28',
      sort: false,
      class: 'bg-primary',
    },
    val29: {
      title: 'Atributo Variable 29',
      sort: false,
      class: 'bg-primary',
    },
    val30: {
      title: 'Atributo Variable 30',
      sort: false,
      class: 'bg-primary',
    },
    val31: {
      title: 'Atributo Variable 31',
      sort: false,
      class: 'bg-primary',
    },
    val32: {
      title: 'Atributo Variable 32',
      sort: false,
      class: 'bg-primary',
    },
    val33: {
      title: 'Atributo Variable 33',
      sort: false,
      class: 'bg-primary',
    },
    val34: {
      title: 'Atributo Variable 34',
      sort: false,
      class: 'bg-primary',
    },
    val35: {
      title: 'Atributo Variable 35',
      sort: false,
      class: 'bg-primary',
    },
    val36: {
      title: 'Atributo Variable 36',
      sort: false,
      class: 'bg-primary',
    },
    val37: {
      title: 'Atributo Variable 37',
      sort: false,
      class: 'bg-primary',
    },
    val38: {
      title: 'Atributo Variable 38',
      sort: false,
      class: 'bg-primary',
    },
    val39: {
      title: 'Atributo Variable 39',
      sort: false,
      class: 'bg-primary',
    },
    val40: {
      title: 'Atributo Variable 40',
      sort: false,
      class: 'bg-primary',
    },
    val41: {
      title: 'Atributo Variable 41',
      sort: false,
      class: 'bg-primary',
    },
    val42: {
      title: 'Atributo Variable 42',
      sort: false,
      class: 'bg-primary',
    },
    val43: {
      title: 'Atributo Variable 43',
      sort: false,
      class: 'bg-primary',
    },
    val44: {
      title: 'Atributo Variable 44',
      sort: false,
      class: 'bg-primary',
    },
    val45: {
      title: 'Atributo Variable 45',
      sort: false,
      class: 'bg-primary',
    },
    val46: {
      title: 'Atributo Variable 46',
      sort: false,
      class: 'bg-primary',
    },
    val47: {
      title: 'Atributo Variable 47',
      sort: false,
      class: 'bg-primary',
    },
    val48: {
      title: 'Atributo Variable 48',
      sort: false,
      class: 'bg-primary',
    },
    val49: {
      title: 'Atributo Variable 49',
      sort: false,
      class: 'bg-primary',
    },
    val50: {
      title: 'Atributo Variable 50',
      sort: false,
      class: 'bg-primary',
    },
  };
  stateFlag = new Subject<void>();
  constructor(
    private router: Router,
    private dictationService: DictationService,
    private notificationService: NotificationService,
    private proceedingService: ProceedingsService,
    private store: Store,
    private globalVarService: GlobalVarsService,
    private goodProcessService: GoodprocessService,
    private lotService: LotService,
    private officeManagementService: OfficeManagementService,
    private docsDataService: DocumentsReceptionDataService,
    private proceedingDeliveryReception: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  getVWheel(body: {
    pExpedientNumber: string | number;
    pGoodNumber: string | number;
  }) {
    return firstValueFrom(
      this.goodProcessService.getVSteeringWhel(body).pipe(
        catchError(err => of({ data: [{ no_volante: null }] })),
        map(res => res.data[0]?.no_volante),
        tap(flyer => {
          if (!flyer) {
          }
        })
      )
    );
  }

  getDictation(body: {
    pDictOrigin: string | number;
    pOrigin: string | number;
    goodNumber: string | number;
  }) {
    return firstValueFrom(
      this.dictationService.vGoodsTracker(body).pipe(
        catchError(err => of({ data: [{ no_volante: null }] })),
        map(res => res.data[0]?.no_volante)
      )
    );
  }

  getNotificationType(flyerNum: string | number) {
    const params = new FilterParams();
    params.addFilter('wheelNumber', flyerNum);
    return firstValueFrom(
      this.notificationService.getAllFilter(params.getParams()).pipe(
        catchError(res => of({ data: [{ wheelType: null }] })),
        map(res => res.data[0]?.wheelType)
      )
    );
  }

  getGlobalExpedientF3(body: { pGoodNumber: string; pConstEntKey: string }) {
    return firstValueFrom(
      this.proceedingService.getGlobalExpedientF3(body).pipe(
        catchError(error => of({ data: [{ max: null }] })),
        map(res => res.data[0]?.max)
      )
    );
  }

  getGlobalExpedientF2(body: {
    pGoodNumber: number | string;
    pRecepCan: string;
    pSuspension: string;
    pCveActa: string;
  }) {
    return firstValueFrom(
      this.proceedingService.getGlobalExpedientF2(body).pipe(
        catchError(error => of({ data: [{ max: null }] })),
        map(res => res.data[0]?.max)
      )
    );
  }

  getGlobalExpedientF(body: {
    pCveActa: string;
    pGoodNumber: string | number;
    pDelivery: string;
  }) {
    return firstValueFrom(
      this.proceedingService.getGlobalExpedientF(body).pipe(
        catchError(error => of({ data: [{ max: null }] })),
        map(res => res.data[0]?.max)
      )
    );
  }

  getGlobalVars() {
    return this.globalVarService.getGlobalVars$().pipe(take(1));
  }

  getEventKey(body: { pcveEvent: string; pGoodNumber: string | number }) {
    return firstValueFrom(
      this.lotService
        .getEventId(body)
        .pipe(map((res: any) => res?.data[0]?.id_evento ?? null))
    );
  }

  getEventGlobal(goodId: string | number) {
    return firstValueFrom(
      this.lotService
        .getGlobalGood(goodId as number)
        .pipe(map((res: any) => res?.data[0]?.no_bien ?? null))
    );
  }

  getFlyerGest(noBien: string | number, cveofgestion: string | number) {
    return firstValueFrom(
      this.officeManagementService.getFlyer({ noBien, cveofgestion })
    );
  }

  getExpedientDeliveryRecep(keysProceedings: string, typeProceedings?: string) {
    const params = new FilterParams();
    params.addFilter('keysProceedings', keysProceedings);
    params.addFilter('typeProceedings', typeProceedings);
    return firstValueFrom(
      this.proceedingDeliveryReception
        .getAll(params.getParams())
        .pipe(map(response => response?.data[0]?.numFile ?? null))
    );
  }
}
