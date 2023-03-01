import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  firstValueFrom,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IDetailProceedingsDevolution } from 'src/app/core/models/ms-proceedings/detail-proceedings-devolution.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { IParameters } from './../../../../core/models/ms-parametergood/parameters.model';
import { IMaximumClosingTime } from './../../../../core/models/ms-proceedings/maximum-closing-time.model';
import { IUpdateProceedings } from './../../../../core/models/ms-proceedings/update-proceedings.model';
import { AccountMovements } from './../../../../core/services/ms-account-movements/account-movements.service';
import { MaximunClosingTimeService } from './../../../../core/services/ms-proceedings/maximun-closing-time.service';
import { ScreenStatusService } from './../../../../core/services/ms-screen-status/screen-status.service';
import { FormEditComponent } from './../form-edit/form-edit.component';
import { GOODS_RECORDS_COLUMNS } from './closing-records-columns';
import { PROCEEDINGS_RECORD_COLUMNS } from './proceedings-records-columns';

export interface IMaximunClosingTime {
  type: string | null;
  user: string | null;
  active: string | null;
  date: Date | null;
}

@Component({
  selector: 'app-closing-records',
  templateUrl: './closing-records.component.html',
  styles: [],
})
export class ClosingRecordsComponent extends BasePage implements OnInit {
  form: FormGroup;
  screenName: string = '';
  statusAct: string = 'ABIERTA';
  settings2: any;
  flag: boolean = false;
  firsTime: boolean = true;
  record: IUpdateProceedings;
  dataResp: IProceedings;
  dataTable: any[] = [];
  fileNumber: number;
  proceedingsNumb: number;
  proceedingsKey: string;
  di_clasif_numerario: number;
  dataForm: any;
  copyDataProceedings: any;
  proceedingsData: any[] = [];
  proceedingsData2: any[] = [];
  paramsProceedings = new BehaviorSubject<ListParams>(new ListParams());
  paginatorProceedings: any = {};
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  paginatorGoods: any = {};
  totalProceedings: number = 0;
  totalGoods: number = 0;
  selectedProceedings: boolean = false;
  dataProceedingsSelected: any;
  reconciledAssetsAndNumerary: any[] = [];
  quantityOfGoods: number;
  userInfo: string;

  private route: Router;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    private documentService: DocumentsService,
    private maximunClosingTimeService: MaximunClosingTimeService,
    private parametersService: ParametersService,
    private screenStatusService: ScreenStatusService,
    private goodService: GoodService,
    private historyGood: HistoryGoodService,
    private accountMovements: AccountMovements,
    private modalService: BsModalService,
    private token: AuthService
  ) {
    super();
    this.settings2 = this.settings;
    this.settings2.columns = PROCEEDINGS_RECORD_COLUMNS;
    this.settings2.actions.delete = true;
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GOODS_RECORDS_COLUMNS,
    };
    // this.settings2.actions.delete = true;
  }

  get proceedingsCve() {
    return this.form.get('proceedingsCve');
  }

  editProceeding(proceeding: IProceedings) {
    console.log(proceeding);
    console.log(this.copyDataProceedings);
    const found = this.copyDataProceedings.find(
      (element: IProceedings) => element.id == proceeding.id
    );
    console.log(found);
    this.openForm(found);
  }

  ngOnInit(): void {
    this.getInfoToken();
    this.getScreenName();
    this.getParamCve();
    this.prepareForm();
    this.initPaginatorProceedings();
    this.initPaginatorGoods();
  }

  getInfoToken() {
    this.userInfo = this.token.decodeToken().preferred_username;
  }

  deleteExpedient() {
    if (this.proceedingsData.length >= 1) {
      this.onLoadToast(
        'info',
        'Info',
        'No puede eliminar el expediente debido a que tiene actas.'
      );
    } else {
      console.log('Eliminando expediente...');
    }
  }

  deleteProceedings(proceeding: any) {
    console.log(proceeding);
    console.log('deleteProeedings');
    this.getGoods(proceeding.data?.id)
      .pipe(
        catchError(err => {
          if (err.status == 400) {
            console.log('XXXX');
            this.proceedingsService.remove(proceeding.data?.id).subscribe({
              next: () => {
                this.onLoadToast(
                  'info',
                  'Info',
                  'El acta ha sido eliminada exitosamente'
                );
                setTimeout(() => {
                  this.getInfo(this.fileNumber);
                }, 2000);
              },
              error: err => {
                console.log('Z1');
                this.onLoadToast('info', 'Error', err.message);
              },
            });
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: (data: any) => {
          this.onLoadToast(
            'info',
            'Info',
            'El acta no puede ser eliminada debido a que cuenta con bienes'
          );
        },
        // error: err => {
        //   console.log('Z2');
        //   this.onLoadToast('info', 'Error', err.message);
        // },
      });
  }

  showDeleteAlert(proceedings: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta acta?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deleteProceedings(proceedings);
        // Swal.fire('Acta borrada exitosamente', '', 'success');
      }
    });
  }

  openForm(proceeding: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      proceeding,
      title: 'Actualizar Acta',
      callback: (next: boolean) => {
        this.getInfo(this.fileNumber);
      },
    };
    this.modalService.show(FormEditComponent, modalConfig);
  }

  getParamCve() {
    this.parametersService.getById('CLASINUMER').subscribe({
      next: (data: IListResponse<IParameters>) => {
        console.log(data);
        // this.di_clasif_numerario = data.initialValue;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  search(fileNumber: string | number) {
    this.dataTable = [];
    this.proceedingsData = [];
    this.fileNumber = Number(fileNumber);
    this.firsTime = true;
    this.resetGoodsPaginator();
    this.resetProceedingssPaginator();
    this.form.reset();
    this.getInfo(this.fileNumber);
  }

  initPaginatorProceedings() {
    console.log('Inicio');
    this.paramsProceedings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        this.paginatorProceedings.page = data.page;
        this.paginatorProceedings.limit = data.limit;
        console.log(this.paginatorProceedings);
        console.log(`Init Paginator ${data.page} ${data.limit}`);
        if (!this.firsTime) {
          this.getProceedings(this.fileNumber).subscribe((data: any) => {
            this.prepareProceedingsData(data);
          });
        }
      });
  }

  initPaginatorGoods() {
    this.paramsGoods.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      console.log(2);
      this.paginatorGoods.page = data.page;
      this.paginatorGoods.limit = data.limit;
      if (!this.firsTime) {
        console.log('XXXX');
        this.getGoods(this.proceedingsNumb).subscribe((data: any) => {
          this.prepareGoodsData(data);
        });
      }
    });
  }

  resetGoodsPaginator() {
    this.paramsGoods.next({ page: 1, limit: 10 });
  }

  resetProceedingssPaginator() {
    this.paramsProceedings.next({ page: 1, limit: 10 });
  }

  selectProceedings(row: any) {
    this.dataTable = [];
    this.dataProceedingsSelected = row;
    console.log(row);
    console.log(this.dataProceedingsSelected);
    this.selectedProceedings = true;
    console.log('Seleccionar Acta', row);
    // this.paramsGoods.next({ page: 1, limit: 10 });
    console.log(row?.id);
    this.proceedingsNumb = row?.id;
    this.paramsGoods.next({ page: 1, limit: 10 });
  }

  getProceedings(fileNumber: number) {
    return this.proceedingsService.getActByFileNumber(
      fileNumber,
      this.paginatorProceedings
    );
  }

  getGoods(proceedingsNumb: number) {
    console.log(proceedingsNumb);
    return this.detailProceedingsDevolutionService.getDetailProceedingsDevolutionByProceedingsNumb(
      proceedingsNumb,
      this.paginatorGoods
    );
  }

  getInfo(fileNumber: number) {
    this.flag = false;
    this.firsTime = false;
    this.getProceedings(fileNumber)
      .pipe(
        tap((data: IListResponse<IProceedings>) => {
          this.proceedingsNumb = data.data[0].id; // se asignan estos valores para luego pasarlos a la pantalla de validadores de actas
          this.proceedingsKey = data.data[0].proceedingsCve;
        }),
        catchError(err => {
          this.handleError(
            err,
            'No se han encontrado registros para este expediente'
          );
          return EMPTY;
        }),
        switchMap((proceedings: IListResponse<IProceedings>) =>
          this.getGoods(proceedings.data[0].id).pipe(
            tap(resp => console.log(resp)),
            catchError(err => {
              this.handleError(
                err,
                'No existen bienes asociados a este número de expediente'
              );
              return of(err);
            }),
            map((goods: any) => ({
              proceedings,
              goods,
            }))
          )
        )
      )
      .subscribe({
        next: data => {
          this.firsTime = false;
          this.prepareData(data);
          this.totalProceedings = Number(data.proceedings.count);
          this.totalGoods = Number(data.goods.count);
          console.log(this.totalGoods);
        },
        error: error => {
          console.log(error);
        },
      });
  }

  handleError(error: HttpErrorResponse, msg: string) {
    if (error.status <= 404) {
      this.onLoadToast('info', 'Información', msg);
    }
  }

  prepareData(data: {
    proceedings: IListResponse<IProceedings>;
    goods: IListResponse<IDetailProceedingsDevolution>;
  }) {
    console.log(data);
    this.proceedingsData = [];
    this.proceedingsData2 = [];
    let proceedingsTemp: any;
    let expedientInfo: any = {};
    this.dataResp = data.proceedings.data[0];
    // this.statusAct = 'ABIERTA';
    // this.statusAct = this.dataResp.proceedingStatus;          //DESCOMENTAR ESTO
    expedientInfo.penaltyCause =
      data.proceedings.data[0].fileNumber.penaltyCause;
    expedientInfo.previewFind = data.proceedings.data[0].fileNumber.previewFind;
    this.form.patchValue(expedientInfo);
    this.prepareProceedingsData(data.proceedings);
    // this.proceedingsData = this.proceedingsData2;
    if (!data.goods.hasOwnProperty('error')) {
      this.prepareGoodsData(data.goods);
    }
    // this.form.patchValue(this.dataForm);
    this.flag = true;
  }

  prepareProceedingsData(data: IListResponse<IProceedings>) {
    let proceedingsTemp: any;
    this.copyDataProceedings = data.data;
    for (let proceedings of data.data) {
      proceedingsTemp = {
        id: proceedings.id,
        proceedingStatus: proceedings.proceedingStatus,
        proceedingsCve: proceedings.proceedingsCve,
        elaborationDate: this.convertDate(proceedings.elaborationDate),
        authorityOrder: proceedings.authorityOrder,
        proceedingsType: proceedings.proceedingsType,
        universalFolio: proceedings.universalFolio,
        observations: proceedings.observations,
      };
      console.log(proceedingsTemp.universalFolio);
      this.proceedingsData.push(proceedingsTemp);
    }
  }

  prepareGoodsData(data: IListResponse<IDetailProceedingsDevolution>) {
    this.quantityOfGoods = data.count;
    let goodsData: any[] = [];
    for (let good of data.data) {
      let data: any = {
        goodsId: good.good[0].goodsID,
        description: good.good[0].description,
        quantity: good.good[0].quantity,
        amountReturned: good.amountReturned,
      };
      goodsData.push(data);
    }
    this.dataTable = goodsData;
  }

  enableDisableFields(option: string) {
    //habilitar / deshabilitar formulario
    Object.keys(this.form.controls).forEach(key => {
      if (option === 'CERRADA') this.form.controls[key].disable();
      else this.form.controls[key].enable();
    });
  }

  convertDate(date: Date) {
    return new Date(date).toLocaleDateString().toString();
  }

  // update() {
  //   this.buildObjectToUpdate('CERRADA');
  // }

  closeProceedings() {
    console.log(this.dataProceedingsSelected.id);
    var maximunClosingTime: IMaximumClosingTime;
    console.log(this.dataProceedingsSelected.proceedingStatus);
    if (this.dataProceedingsSelected.proceedingStatus == 'CERRADA') {
      this.onLoadToast('error', 'Error', 'El acta ya se encuentra cerrada');
    } else {
      // this.getScannedDocument().subscribe(data => console.log(data));
      // this.initiateProceedingsClose(this.dataProceedingsSelected.id);
      this.test();
    }
  }

  async test() {
    let errorMessage: string = '';
    try {
      let maximunClosingTime: any = await this.getMaximunClosingTime();
      if (this.validateClosingDate(maximunClosingTime?.date)) {
        if (this.dataProceedingsSelected.universalFolio != '') {
          let scanned: any = await this.getScannedDocument()
            .then(data => {
              console.log('then getScannedDocument');
              // throw 'ERORR';
            })
            .catch(error => {
              throw this.verifyError(error, 'Error GetScannedDocument');
            });
          console.log('2222');
          let totalReconciledGoods: any = await this.getTotalReconciledGoods(
            this.proceedingsNumb
          )
            .then()
            .catch(error => {
              throw this.verifyError(error, 'Error Get Total Reconciled Goods');
            });
          if (totalReconciledGoods.total == this.quantityOfGoods) {
            let dataToUpdate: any = this.buildObjectToUpdate('CERRADA');
            await this.updateProceeding(dataToUpdate)
              .then()
              .catch(error => {
                throw this.verifyError(error, 'Error al actualizar el acta');
              });
            let allGoods: any = await this.getAllGoods()
              .then()
              .catch(error => {
                throw this.verifyError(error, 'Error en Get All Goods');
              });
            console.log(allGoods?.data?.length);
            for (let i = 0; (i = 2); i++) {
              console.log(i);
              let statusFinal = await this.getFinalStatus([192273])
                .then(data => console.log(1))
                .catch(error => {
                  console.log('catch 1');
                  throw this.verifyError(error, 'Erorr Get Final Status');
                });
              // await this.updateGoods(192273, statusFinal.data[0].statusFinal)
              //   .then()
              //   .catch(error => {
              //     throw this.verifyError(error, 'Erorr Update Goods');
              //   });
              // await this.udpateHistoryGood(
              //   192273,
              //   statusFinal.data[0].statusFinal
              // )
              //   .then()
              //   .catch(error => {
              //     throw this.verifyError(error, 'Erorr Update History Good');
              //   });
            }
            console.log(allGoods);
            // allGoods.data.forEach(
            //   good => {
            //     good.
            //   }
            // )
          } else {
            this.onLoadToast('error', 'Error', 'Existen bienes sin conciliar');
          }
        } else {
          this.onLoadToast('error', 'Error', 'El valor del folio es vacío');
        }
      } else {
        this.onLoadToast(
          'error',
          'Error',
          'El plazo para cerrar actas del mes anterior ha terminado'
        );
      }
    } catch (error: any) {
      console.log('Catch Final');
      // if ((typeof error === 'object') === false) {
      //   this.onLoadToast('error', 'Error', error);
      // } else {
      //   if (error?.status <= 404) {
      //     this.onLoadToast('warning', 'Error', error.error.message);
      //   } else {
      //     this.onLoadToast('error', 'Error', error.message);
      //   }
      // }
    }
  }

  verifyError(error: any, defaultMsg: string) {
    let message: string = '';
    if (error?.status <= 404) {
      message = defaultMsg;
    } else {
      message = error.message;
    }
    return message;
  }

  // initiateProceedingsClose(proceedingNumb: string | number) {
  //   console.log('Test');
  //   let withoutReconciling: boolean = false;
  //   let goodsWithoutReconciling: any[] = [];
  //   let goodsNumber: any[] = [];
  //   let maximunClosingTime: any;
  //   this.getMaximunClosingTime()
  //     .pipe(
  //       catchError(err => {
  //         this.handleError(err, 'No existen bienes.');
  //         return of(err);
  //       }),
  //       tap((maximunClosingTime: any) => {
  //         console.log(maximunClosingTime?.date);
  //         if (this.validateClosingDate(maximunClosingTime?.date)) {
  //           if (this.dataProceedingsSelected.universalFolio != '') {
  //             console.log('folio');
  //             this.getScannedDocument()
  //               .pipe(
  //                 catchError(err => {
  //                   this.handleError(err, 'No existen bienesSSSSS.');
  //                   return of(err);
  //                 }),
  //                 switchMap(
  //                   (data: any) =>
  //                     this.getTotalReconciledGoods(proceedingNumb).pipe(
  //                       catchError(err => {
  //                         this.handleError(err, 'Get Total Reconciled Goods');
  //                         return of(err);
  //                       }),
  //                       tap((data: any) => {
  //                         console.log(data);
  //                         if (data.total == this.quantityOfGoods) {
  //                           console.log('Si se puede Cerrar');
  //                           let dataToUpdate: any =
  //                             this.buildObjectToUpdate('CERRADA');
  //                           this.updateProceeding(dataToUpdate)
  //                             .pipe(
  //                               catchError(err => {
  //                                 this.handleError(
  //                                   err,
  //                                   'Ha ocurrido un error al actualizar el acta'
  //                                 );
  //                                 return of(err);
  //                               })
  //                               // switchMap((data: any) =>
  //                               //   this.getAllGoods().pipe(
  //                               //     tap((allGoods: any) => {
  //                               //       console.log('--->>>>')
  //                               //       for (let i = 0; (i = 2); i++) {
  //                               //         let good: any = [];
  //                               //         if ((i = 0)) good.push(1545);
  //                               //         else good.push(192273);
  //                               //         this.getFinalStatus(data)
  //                               //           .pipe(
  //                               //             catchError(err => {
  //                               //               this.handleError(
  //                               //                 err,
  //                               //                 'GetFinalStatus'
  //                               //               );
  //                               //               return of(err);
  //                               //             }),
  //                               //             switchMap((data: IStatus) =>
  //                               //               this.updateGoods(
  //                               //                 good[0],
  //                               //                 data.statusFinal
  //                               //               ).pipe(
  //                               //                 tap(data =>
  //                               //                   console.log(
  //                               //                     data.data[0].status
  //                               //                   )
  //                               //                 ),
  //                               //                 switchMap(
  //                               //                   (
  //                               //                     data: IListResponse<IGood>
  //                               //                   ) =>
  //                               //                     this.udpateHistoryGood(
  //                               //                       good[0],
  //                               //                       data.data[0].status
  //                               //                     ).pipe(
  //                               //                       tap(data =>
  //                               //                         console.log('FINAL')
  //                               //                       )
  //                               //                     )
  //                               //                 )
  //                               //               )
  //                               //             )
  //                               //           )
  //                               //           .subscribe();
  //                               //       }
  //                               //     })
  //                               //   )
  //                               // )
  //                             )
  //                             .subscribe();
  //                         } else {
  //                           this.onLoadToast(
  //                             'error',
  //                             'Error',
  //                             'No puede cerrar el acta ya que existen bienes sin conciliar'
  //                           );
  //                         }
  //                       })
  //                     )
  //                   // this.getAllGoods().pipe(
  //                   //   tap((data: any) => {
  //                   //     console.log(data);
  //                   //     goodsNumber = this.extractNumberOfGoods(data);
  //                   //     console.log(goodsNumber);
  //                   //   }),
  //                   //   switchMap(data =>
  //                   //     //this.accountMovements.getAll(goodsNumber) //verificar cuales bienes estám conciliados
  //                   //     this.accountMovements
  //                   //       .getByFilters({ goods: goodsNumber })
  //                   //       .pipe(
  //                   //         //Busca los bienes que no estén conciliados
  //                   //         tap(data => {
  //                   //           if (goodsNumber.length != data.data.length) {
  //                   //             goodsWithoutReconciling =
  //                   //               this.searchUnreconciledGoods(
  //                   //                 data.data,
  //                   //                 goodsNumber
  //                   //               );
  //                   //             this.onLoadToast(
  //                   //               'error',
  //                   //               'Error',
  //                   //               'No puede cerrar el acta ya que existen bienes sin conciliar'
  //                   //             );
  //                   //           } else {
  //                   //             this.buildObjectToUpdate('CERRADA');
  //                   //           }
  //                   //         })
  //                   //       )
  //                   //   )
  //                   // )
  //                 )
  //               )
  //               .subscribe();
  //           } else {
  //             this.onLoadToast('error', 'Error', 'El valor del folio es vacío');
  //           }
  //         } else {
  //           this.onLoadToast(
  //             'error',
  //             'Error',
  //             'El plazo para cerrar actas del mes anterior ha terminado'
  //           );
  //         }
  //         console.log('xxx');
  //       })
  //     )
  //     .subscribe((data: any) => {});
  // }

  getFinalStatus(goodArray: number[]) {
    return firstValueFrom(
      this.screenStatusService.getStatus({
        screen: 'FACTREFACTACIEDEV',
        goodArray,
        action: 'DEVOLUCION',
      })
    );
  }

  updateGoods(goodNumber: number, status: string) {
    return firstValueFrom(
      this.goodService.updateGoodStatus(goodNumber, status)
    );
  }

  udpateHistoryGood(goodNumber: number, status: string) {
    let data: IHistoryGood = {
      propertyNum: goodNumber,
      status,
      changeDate: new Date(),
      userChange: this.userInfo,
      reasonForChange: 'Automatico',
      statusChangeProgram: 'FACTREFACTACIEDEV',
    };
    return firstValueFrom(this.historyGood.create(data));
  }

  getTotalReconciledGoods(proceedingNumb: string | number) {
    return firstValueFrom(
      this.detailProceedingsDevolutionService.getTotalReconciledGoods(
        proceedingNumb
      )
    );
  }

  searchUnreconciledGoods(reconciledGoods: any, totalGoods: any) {
    console.debug(reconciledGoods);
    console.debug(totalGoods);
    let goodsWithoutReconciling: any[] = [];
    for (let good of totalGoods) {
      let flag = false;
      for (let reconciledGood of reconciledGoods) {
        if (good == reconciledGood?.goodsNumber?.id) flag = true;
      }
      if (!flag) {
        goodsWithoutReconciling.push(good);
      }
    }
    return reconciledGoods;
  }

  getMaximunClosingTime() {
    return firstValueFrom(
      this.maximunClosingTimeService.getByProceedingsType('DEV')
    );
  }

  getScannedDocument() {
    console.log('getScannedDocument');
    return firstValueFrom(
      this.documentService.getByFilters({
        id: this.dataProceedingsSelected.universalFolio,
        scanStatus: 'ESCANEADO',
        numberProceedings: this.fileNumber,
      })
    );
  }

  getAllGoods() {
    console.log('getAllGoods');
    return firstValueFrom(
      this.detailProceedingsDevolutionService.getDetailProceedingsDevolutionByProceedingsNumb(
        this.proceedingsNumb,
        { limit: this.quantityOfGoods }
      )
    );
  }

  // getMaximumClosingTime() {
  //   this.reconciledAssetsAndNumerary = [];
  //   this.maximunClosingTimeService.getByProceedingsType('DEV').subscribe({
  //     //Cambiar por data: IListResponse<IMaximumClosingTime> El endpoint no devuelve un array sino un objeto
  //     next: (data: any) => {
  //       this.maximunClosingTime = data?.date;
  //       if (this.validateClosingDate()) {
  //         if (this.dataProceedingsSelected.universalFolio != '') {
  //           this.documentService
  //             .getByFilters({
  //               id: this.dataProceedingsSelected.universalFolio,
  //               scanStatus: 'ESCANEADO',
  //               numberProceedings: this.fileNumber,
  //             })
  //             .subscribe({
  //               next: data => {
  //                 //Obtener todos los bienes para verificar si estan conciliados
  //                 this.detailProceedingsDevolutionService
  //                   .getDetailProceedingsDevolutionByProceedingsNumb(
  //                     this.proceedingsNumb
  //                   )
  //                   .subscribe({
  //                     next: data => {
  //                       let infoGood: any;
  //                       let goodsNumber: any[] = [];
  //                       for (let good of data?.data) {
  //                         if (
  //                           good.numGoodId.goodsReferenceId ==
  //                           this.di_clasif_numerario
  //                         ) {
  //                           infoGood.numerary = 's';
  //                         } else {
  //                           infoGood.numerary = 'n';
  //                         }
  //                         (infoGood.goodNumber = good.numGoodId),
  //                           (infoGood.reconciled = 's'),
  //                           this.reconciledAssetsAndNumerary.push(infoGood);
  //                       }
  //                       console.log(this.reconciledAssetsAndNumerary);
  //                       if (this.reconciledAssetsAndNumerary.length > 0) {
  //                         goodsNumber = this.extractNumberOfGoods(
  //                           this.reconciledAssetsAndNumerary
  //                         );
  //                         this.accountMovements.getAll();
  //                       } else {
  //                         this.onLoadToast(
  //                           'error',
  //                           'Error',
  //                           'Para cerrar un acta debe contener al menos un bien, favor de registrar éste en la pantalla de actas'
  //                         );
  //                       }
  //                     },
  //                     error: err => {
  //                       this.onLoadToast('error', 'Error', err.message);
  //                     },
  //                   });
  //               },
  //               error: err => {
  //                 this.onLoadToast(
  //                   'error',
  //                   'Error',
  //                   'Acta con estatus de documento diferente a escaneado'
  //                 );
  //                 console.log(err);
  //               },
  //             });
  //         } else {
  //           this.onLoadToast('error', 'Error', 'El valor del folio es vacío');
  //         }
  //       } else {
  //         this.onLoadToast(
  //           'error',
  //           'Error',
  //           'El plazo para cerrar actas del mes anterior ha caducado.'
  //         );
  //       }
  //     },
  //     error: err => {
  //       this.handleError(err, err.msg);
  //     },
  //   });
  // }

  extractNumberOfGoods(goods: any) {
    console.log('extractNumberOfGoods');
    console.log(goods);
    let arrayGoods: any[] = [];
    for (let good of goods) {
      console.log(good);
      arrayGoods.push(good.goodNumber?.goodsID);
    }
    return arrayGoods;
  }

  validateClosingDate(maximunClosingTime: Date) {
    let validDate: boolean = false;
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3); //restando un mes a la fecha actual
    console.log(currentDate);
    //se obtiene el último día del mes
    let lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    console.log(lastDayOfMonth.getDate());
    currentDate.setDate(currentDate.getDate() + lastDayOfMonth.getDate());
    console.log(currentDate);
    let testDate = new Date('2008-06-1');
    console.log(maximunClosingTime);
    if (testDate < new Date(maximunClosingTime)) {
      //cambiar testDate x currentDate
      validDate = true;
    }
    console.log(validDate);
    return validDate;
  }

  //se construye el objeto necesario para actualizar el acta
  buildObjectToUpdate(status: string) {
    console.log(this.dataResp);
    let dataToUpdate: any = {};
    for (let key in this.dataResp) {
      if (key == 'transferNumber') {
        dataToUpdate[key] = this.dataResp[key].id;
      } else {
        if (key == 'fileNumber') {
          dataToUpdate[key] = this.dataResp[key].filesId;
        } else {
          if (key != 'delegationNumber')
            dataToUpdate[key] = this.dataResp[key as keyof IProceedings];
        }
      }
    }
    dataToUpdate.proceedingStatus = status;
    return dataToUpdate;
  }

  updateProceeding(dataToUpdate: any) {
    console.log('update...');
    return firstValueFrom(
      this.proceedingsService.update(dataToUpdate.id, dataToUpdate)
    );

    // .subscribe({
    //   next: (resp: IListResponse<IProceedings>) => {
    //     this.onLoadToast(
    //       'success',
    //       'Actualizada',
    //       'El acta ha sido actualizado exitosamente'
    //     );
    //     // this.proceedingsKey = this.form.value.proceedingsCve;
    //     this.search(this.fileNumber);
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     if (error.status <= 404) {
    //       this.form.patchValue(this.dataForm);
    //       this.onLoadToast('error', 'Error', error.message);
    //     }
    //   },
    // });
  }

  copyFormValues(dataToUpdate: IUpdateProceedings, data: any) {
    for (let property in data) {
      dataToUpdate ? [property] : data[property];
    }
    console.log(dataToUpdate);
    // dataToUpdate.proceedingsCve = this.form.value.proceedingsCve;
    // dataToUpdate.observations = this.form.value.observations;
    // dataToUpdate.authorityOrder = this.form.value.authorityOrder;
    // dataToUpdate.universalFolio = this.form.value.universalFolio;
  }

  prepareForm() {
    this.form = this.fb.group({
      previewFind: [null],
      penaltyCause: [null, []],
    });
  }

  getScreenName() {
    this.screenName = this.activatedRoute.snapshot.data['screen'];
    console.log(this.screenName);
  }
}
