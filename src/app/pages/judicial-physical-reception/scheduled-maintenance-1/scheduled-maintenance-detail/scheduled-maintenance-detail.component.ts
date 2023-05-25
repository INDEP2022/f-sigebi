import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  filter,
  first,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  takeUntil,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodsByProceeding } from 'src/app/core/models/ms-indicator-goods/ms-indicator-goods-interface';
import { ParameterIndicatorsService } from 'src/app/core/services/catalogs/parameters-indicators.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings/index';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { IParametersIndicators } from './../../../../core/models/catalogs/parameters-indicators.model';
import { IProceedingDeliveryReception } from './../../../../core/models/ms-proceedings/proceeding-delivery-reception';
import { GOOD_TRACKER_ORIGINS } from './../../../general-processes/goods-tracker/utils/constants/origins';
import { columnsGoods, settingsGoods } from './const';

@Component({
  selector: 'app-scheduled-maintenance-detail',
  templateUrl: './scheduled-maintenance-detail.component.html',
  styleUrls: [
    '../scheduled-maintenance.scss',
    './scheduled-maintenance-detail.component.scss',
  ],
})
export class ScheduledMaintenanceDetailComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  statusList = [
    { id: 'ABIERTA', description: 'Abierto' },
    { id: 'CERRADA', description: 'Cerrado' },
  ];
  pageLoading = false;
  paramsForAdd = new BehaviorSubject<ListParams>(new ListParams());
  paramsStatus: ListParams = new ListParams();
  data: IGoodsByProceeding[] = [];
  dataForAdd: IGoodsByProceeding[] = [];
  totalItems: number = 0;
  goodsCant: number = 0;
  selecteds: IGoodsByProceeding[] = [];
  selectedsNews: IGoodsByProceeding[] = [];
  settingsGoods = { ...settingsGoods };
  settingsGoodsForAdd = {
    ...settingsGoods,
    edit: { ...settingsGoods.edit, confirmSave: false },
    delete: { ...settingsGoods.delete, confirmDelete: false },
  };
  areaProcess: string;
  params: ListParams = new ListParams();
  initialValue: any;
  $trackedGoods = this.store.select(getTrackedGoods);
  origin = GOOD_TRACKER_ORIGINS.DetailProceedings;
  proceedingIndicators: IParametersIndicators[];
  bienesRas = 0;
  expedientesRas = 0;
  dictamenesRas = 0;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private store: Store,
    private service: MsIndicatorGoodsService,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private statusScreenService: StatusXScreenService,
    private indicatorService: ParameterIndicatorsService,
    private goodService: GoodService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
    this.fillColumnsGoods();
    this.prepareForm();
    // this.getStatusPantalla();
    this.statusActa.valueChanges.subscribe(x => {
      console.log(x);
      if (x === 'CERRADA') {
        this.closeActa();
      }
    });
  }

  get statusActa() {
    return this.form.get('statusActa');
  }

  get statusActaValue() {
    return this.statusActa ? this.statusActa.value : 'CERRADA';
  }

  get actaId() {
    return this.form.get('acta') ? this.form.get('acta').value : '';
  }

  get typeProceeding() {
    return this.form.get('tipoEvento') ? this.form.get('tipoEvento').value : '';
  }

  private getStatusPantallaByGoodIndicator(good: IGoodsByProceeding) {
    if (good.estatus) {
      const filterParams = new FilterParams();
      filterParams.addFilter('screenKey', 'FINDICA_0035_1');
      filterParams.addFilter('action', this.areaProcess);
      // filterParams.addFilter('status', good.estatus);
      return this.statusScreenService
        .getList(filterParams.getFilterParams())
        .pipe(
          map(x =>
            x.data
              ? x.data.length > 0
                ? { statusFinal: x.data[0].statusFinal, good: good.no_bien }
                : null
              : null
          )
        );
    } else {
      return of(null);
    }
  }

  private validationObs(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  private closeActa() {
    const detail = JSON.parse(
      window.localStorage.getItem('detailActa')
    ) as IProceedingDeliveryReception;
    this.alertQuestion(
      'warning',
      'Acta ' + detail.id,
      '¿Seguro que desea realizar el cierre de esta Acta?'
    ).then(question => {
      if (question.isConfirmed) {
        this.pageLoading = true;
        // const listParams = new ListParams();
        // listParams.limit = 100000;
        // listParams['id'] = this.actaId;
        const data = this.data.filter(item => item.agregado === 'RA');
        if (data.length > 0) {
          const array = data.map(item => {
            return this.getStatusPantallaByGoodIndicator(item).pipe(
              filter(
                item =>
                  item !== null &&
                  item.statusFinal !== null &&
                  item.statusFinal.status !== null
              ),
              map(item => {
                return [
                  this.goodService.updateGoodStatusAndDate(
                    item.good,
                    item.statusFinal.status
                  ),
                  this.historyGoodService.create({
                    propertyNum: item.good,
                    status: item.statusFinal.status,
                    changeDate: new Date(),
                    userChange: localStorage.getItem('username'),
                    reasonForChange:
                      'Cambio por Mantenimiento de Programaciones',
                    registryNum: null,
                    statusChangeProgram: 'FMENTREC_0002',
                    extDomProcess: null,
                  }),
                ];
              }),
              mergeMap(array => this.validationObs(array))
            );
          });
          array.forEach(x =>
            x.subscribe({
              next: response => {
                this.pageLoading = false;
              },
              error: err => {
                console.log(err);
                this.pageLoading = false;
              },
            })
          );
        }

        // this.service.getGoodsByProceeding(listParams).pipe(map(list => {
        //   return list.data ? list.data.length > 0 ? list.data.map(item => {
        //     return this.getStatusPantallaByGoodIndicator(item).pipe(filter(items => items.status !== null), map(items => {
        //       return
        //     }))
        //   }) : [] : []
        // }), mergeMap(array => this.validationObs(array))).subscribe({
        //   next: response => {
        //     console.log(response);
        //     response.filter(item => item.status !== null).forEach(item => {
        //       return this.goodService.u
        //     })
        //     this.pageLoading = false;
        //   }
        // })
        detail.keysProceedings = this.form.get('claveActa').value;
        detail.statusProceedings = this.statusActaValue;
        detail.closeDate = new Date().toISOString();
        let message = '';
        // this.proceedingService
        //   .update2(detail)
        //   .pipe(takeUntil(this.$unSubscribe))
        //   .subscribe({
        //     next: response => {
        //       this.massiveUpdate(`Se actualizo el acta N° ${detail.id} `);
        //     },
        //     error: err => {
        //       this.massiveUpdate('');
        //     },
        //   });
      } else {
        this.form.get('statusActa').setValue('ABIERTA');
      }
    });
  }

  private massiveUpdate(message = '') {
    if (this.data.length > 0) {
      this.service
        .updateMassive(this.data, this.actaId)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            let goods = '';
            this.data.forEach((selected, index) => {
              goods +=
                selected.no_bien +
                (index < this.selecteds.length - 1 ? ',' : '');
            });
            if (message === '') {
              message = `Se actualizaron los bienes N° ${goods} `;
            } else {
              message += ` y los bienes N° ${goods}`;
            }
            this.onLoadToast('success', 'Exito', message);
          },
          error: err => {
            if (message === '') {
              this.onLoadToast('error', 'Error', 'Programación no actualizada');
            } else {
              this.onLoadToast(
                'warning',
                'Exito',
                message + ' pero no se pudieron actualizar los bienes'
              );
            }
          },
        });
    } else {
      if (this.form.value !== this.initialValue) {
        this.onLoadToast('success', 'Exito', message);
        this.initialValue = { ...this.form.value };
      }
    }
  }

  private prepareForm() {
    const acta: IProceedingDeliveryReception = JSON.parse(
      localStorage.getItem('detailActa')
    );
    this.form = this.fb.group({
      acta: [acta.id],
      fechaCaptura: [acta.captureDate],
      statusActa: [acta.statusProceedings],
      claveActa: [acta.keysProceedings],
      tipoEvento: [acta.typeProceedings],
    });
    this.initialValue = { ...this.form.value };
  }

  back() {
    this.location.back();
  }

  private fillSelectedsForUpdate(
    newData: IGoodsByProceeding,
    data: IGoodsByProceeding
  ) {
    if (
      newData.fec_aprobacion_x_admon !== data.fec_aprobacion_x_admon ||
      newData.fec_indica_usuario_aprobacion !==
        data.fec_indica_usuario_aprobacion
    ) {
      let index = this.data.findIndex(x => x.no_bien === newData.no_bien);
      if (index === -1) {
        this.data.push(newData);
      } else {
        this.data[index] = newData;
      }
    }
  }

  updateData(event: any) {
    console.log(event);
    this.params = event;
    this.getData();
  }

  updateDatesTable(newData: any[]) {
    console.log(this.data);
    this.detailService
      .updateMasive(
        newData
          .filter(x => x.agregado === 'AE')
          .map(x => {
            return {
              fec_aprobacion_x_admon: x.fec_aprobacion_x_admon,
              fec_indica_usuario_aprobacion: x.fec_indica_usuario_aprobacion,
              no_bien: x.no_bien,
            };
          }),
        this.actaId
      )
      .subscribe({
        next: response => {
          let goods = '';
          newData.forEach((selected, index) => {
            goods += selected.no_bien + (index < newData.length - 1 ? ',' : '');
          });
          // const message = `Se actualizo el bien N° ${newData.no_bien} `;
          const message = `Se actualizaron los bienes N° ${goods} `;
          this.onLoadToast('success', 'Exito', message);
          this.data = newData;
          // this.updateTable.emit();
        },
        error: err => {
          this.onLoadToast('error', 'Error', 'Bienes no actualizados');
        },
      });
    this.onLoadToast('info', 'Bienes', 'Fechas actualizadas');
  }

  updateGoodsRow(event: any) {
    console.log(event);
    let { newData, confirm, data } = event;
    // confirm.resolve(data);
    if (
      !newData.fec_aprobacion_x_admon ||
      !newData.fec_indica_usuario_aprobacion
    ) {
      this.alertTableIncompleteFields();
      return;
    }
    if (
      newData.fec_aprobacion_x_admon &&
      newData.fec_indica_usuario_aprobacion &&
      new Date(newData.fec_aprobacion_x_admon) >
        new Date(newData.fec_indica_usuario_aprobacion)
    ) {
      this.alertTableRangeError();
      return;
    }
    this.detailService
      .updateMasive(
        [
          {
            fec_aprobacion_x_admon: newData.fec_aprobacion_x_admon,
            fec_indica_usuario_aprobacion:
              newData.fec_indica_usuario_aprobacion,
            no_bien: newData.no_bien,
          },
        ],
        this.actaId
      )
      .subscribe({
        next: response => {
          // let goods = '';
          // this.selectedsForUpdate.forEach((selected, index) => {
          //   goods +=
          //     selected.numberGood +
          //     (index < this.selectedsForUpdate.length - 1 ? ',' : '');
          // });
          const message = `Se actualizo el bien N° ${newData.no_bien} `;
          // const message = `Se actualizaron los bienes N° ${goods} `;
          this.onLoadToast('success', 'Exito', message);
          // this.updateTable.emit();
        },
        error: err => {
          this.onLoadToast('error', 'Error', 'Bienes no actualizados');
        },
      });
    // this.fillSelectedsForUpdate(newData, data);
    // confirm.resolve(newData);
  }

  alertTableRangeError() {
    this.onLoadToast(
      'error',
      'Campos no concuerdan',
      'Fecha final no puede ser menor a inicial'
    );
  }

  alertTableIncompleteFields() {
    this.onLoadToast(
      'error',
      'Campos incompletos',
      'Complete todos los campos para agregar un registro'
    );
  }

  ngOnInit(): void {
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
    //   // console.log(x);
    //   this.getData();
    // });
  }

  private fillColumnsGoods() {
    // debugger;
    let columnGoodId = {
      title: 'Localidad Ent. Transferente.',
      type: 'string',
      sort: false,
      editable: false,
    };
    const params = new ListParams();
    params.limit = 100;
    this.indicatorService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          // debugger;
          let newColumns;
          this.proceedingIndicators = response.data.filter(
            indicator =>
              indicator.description === 'ENTREGA FISICA' || 'RECEPCION FISICA'
          );
          const indicator = this.proceedingIndicators.find(
            indicator => indicator.typeActa === this.typeProceeding
          );
          if (!indicator) return;
          console.log(indicator);
          this.areaProcess = indicator.areaProcess;
          if (indicator.areaProcess === 'RF') {
            newColumns = { ciudad_transferente: columnGoodId, ...columnsGoods };
          }
          if (indicator.areaProcess === 'DN') {
            newColumns = {
              clave_contrato_donacion: columnGoodId,
              ...columnsGoods,
            };
          }
          if (indicator.areaProcess === 'DV') {
            newColumns = {
              clave_acta_devolucion: columnGoodId,
              ...columnsGoods,
            };
          }
          if (indicator.areaProcess === 'CM') {
            newColumns = { clave_dictamen: columnGoodId, ...columnsGoods };
          }
          if (indicator.areaProcess === 'DS') {
            newColumns = {
              clave_acta_destruccion: columnGoodId,
              ...columnsGoods,
            };
          }
          this.settingsGoods = { ...this.settingsGoods, columns: newColumns };
          this.settingsGoodsForAdd = {
            ...this.settingsGoodsForAdd,
            columns: newColumns,
          };
          this.getData();
          console.log(this.settingsGoods);
        },
      });
  }

  getData() {
    const idActa = this.actaId;
    console.log(idActa);
    console.log(new Date());
    console.log(new Date().toISOString());
    this.loading = true;
    this.params['id'] = idActa;
    if (idActa) {
      this.service
        .getGoodsByProceeding(this.params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            // console.log(response);
            this.data = response.data;
            this.goodsCant = response.total;
            // console.log(this.goodsCant);
            this.totalItems = response.count;
            const tracker = this.$trackedGoods
              .pipe(first(), takeUntil(this.$unSubscribe))
              .subscribe({
                next: response => {
                  // debugger;
                  // response.forEach(good => {
                  //   this.detailService.getGoodByID(good.goodNumber);
                  // });
                  if (response && response.length > 0) {
                    console.log(this.areaProcess);
                    this.detailService
                      .getGoodByRastrer(
                        response.map(item => +item.goodNumber),
                        this.areaProcess,
                        this.typeProceeding,
                        this.data[0]
                      )
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe({
                        next: goods => {
                          console.log(goods);
                          this.totalItems += goods.data.length;
                          this.bienesRas = goods.bienes;
                          this.expedientesRas = goods.expedientes;
                          this.dictamenesRas = goods.dictamenes;
                          this.data = [...this.data.concat(goods.data)];
                          console.log(this.totalItems);
                          this.loading = false;
                        },
                        error: err => {
                          this.loading = false;
                        },
                      });
                    // this.service
                    //   .getByGoodRastrer(
                    //     response.map(item => +item.goodNumber),
                    //     this.data[0]
                    //   )
                    //   .pipe(takeUntil(this.$unSubscribe))
                    //   .subscribe({
                    //     next: goods => {
                    //       console.log(goods);
                    //       // this.dataForAdd = goods.data;
                    //       this.data = [...this.data.concat(goods.data)];
                    //       this.totalItems += goods.data.length;

                    //       // this.detailService.createMassive()
                    //     },
                    //     complete: () => {
                    //       this.loading = false;
                    //     },
                    //   });
                  } else {
                    this.loading = false;
                  }

                  // if (response) {
                  //   // console.log(response, this.infoForm);
                  //   this.detailService
                  //     .createMassive(
                  //       response.map(item =>
                  //         trackerGoodToDetailProceeding(item, this.actaId)
                  //       )
                  //     )
                  //     .subscribe({
                  //       next: response2 => {
                  //         const goods = response.map(good => good.goodNumber);
                  //         let message = '';
                  //         goods.forEach((good, index) => {
                  //           message += good + (index < goods.length - 1 ? ',' : '');
                  //         });
                  //         this.onLoadToast('success', 'Bienes Agregados', message);
                  //         this.getData();
                  //       },
                  //       error: err => {
                  //         this.onLoadToast('error', 'Bienes', 'No ');
                  //       },
                  //     });
                  //   // this.service.dataForAdd = [
                  //   //   ...this.service.dataForAdd.concat(
                  //   //     response.map(item =>
                  //   //       trackerGoodToDetailProceeding(item, this.infoForm.id)
                  //   //     )
                  //   //   ),
                  //   // ];
                  // }
                  // this.detailService.createMassive(details)
                  // if (response && response.length > 0) {
                  //   this.service
                  //     .getByGoodRastrer(
                  //       response.map(item => +item.goodNumber),
                  //       this.data[0]
                  //     )
                  //     .pipe(takeUntil(this.$unSubscribe))
                  //     .subscribe({
                  //       next: goods => {
                  //         console.log(goods);

                  //         // this.dataForAdd = goods.data;
                  //         this.detailService.createMassive()
                  //       },
                  //       complete: () => {
                  //         this.loading = false;
                  //       },
                  //     });
                  // } else {
                  //   this.loading = false;
                  // }
                  // tracker.unsubscribe();
                },
                error: err => {
                  console.log(err);
                  this.loading = false;
                  // tracker.unsubscribe();
                },
              });
          },
          error: err => {
            this.data = [];
            this.loading = false;
            this.totalItems = 0;
          },
        });
    }
  }

  rowsSelected(selecteds: IGoodsByProceeding[]) {
    this.selecteds = selecteds;
  }

  showDeleteAlert(item: IGoodsByProceeding) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        if (item.agregado === 'AE') {
          this.loading = true;
          this.detailService
            .deleteByBP(this.actaId, this.typeProceeding, [item])
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: response => {
                console.log(response);
                this.getData();
                this.onLoadToast(
                  'success',
                  'Exito',
                  `Se elimino el bien N° ${item.no_bien}`
                );
              },
              error: err => {
                console.log(err);
                this.onLoadToast(
                  'error',
                  'ERROR',
                  `No se pudo eliminar el bien N° ${item.no_bien}`
                );
              },
            });
        }
      }
    });
  }
}
