import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDetailProceedingsDevolution } from 'src/app/core/models/ms-proceedings/detail-proceedings-devolution.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { IParameters } from './../../../../core/models/ms-parametergood/parameters.model';
import { IMaximumClosingTime } from './../../../../core/models/ms-proceedings/maximum-closing-time.model';
import { IUpdateProceedings } from './../../../../core/models/ms-proceedings/update-proceedings.model';
import { MaximunClosingTimeService } from './../../../../core/services/ms-proceedings/maximun-closing-time.service';
import { FormEditComponent } from './../form-edit/form-edit.component';
import { GOODS_RECORDS_COLUMNS } from './closing-records-columns';
import { PROCEEDINGS_RECORD_COLUMNS } from './proceedings-records-columns';

@Component({
  selector: 'app-closing-records',
  templateUrl: './closing-records.component.html',
  styles: [],
})
export class ClosingRecordsComponent extends BasePage implements OnInit {
  form: FormGroup;
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
  maximunClosingTime: Date;
  dataProceedingsSelected: any;
  private route: Router;

  constructor(
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    private documentService: DocumentsService,
    private maximunClosingTimeService: MaximunClosingTimeService,
    private parametersService: ParametersService,
    private modalService: BsModalService
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
    this.getParamCve(); //
    this.prepareForm();
    this.initPaginatorProceedings();
    this.initPaginatorGoods();
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

  search(fileNumber: string) {
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
    // this.dataResp = data.proceedings.data[0];
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

  update() {
    this.buildObjectToUpdate();
  }

  closeProceedings() {
    var maximunClosingTime: IMaximumClosingTime;
    this.getMaximumClosingTime();
  }

  getMaximumClosingTime() {
    this.maximunClosingTimeService.getByProceedingsType('DEV').subscribe({
      //Cambiar por data: IListResponse<IMaximumClosingTime> El endpoint no devuelve un array sino un objeto
      next: (data: any) => {
        this.maximunClosingTime = data?.date;
        if (this.validateClosingDate()) {
          if (this.dataProceedingsSelected.universalFolio != '') {
            this.documentService
              .getByFilters({
                id: this.dataProceedingsSelected.universalFolio,
                scanStatus: 'ESCANEADO',
                numberProceedings: this.fileNumber,
              })
              .subscribe({
                next: data => {
                  console.log(data);
                },
                error: err => {
                  this.onLoadToast(
                    'error',
                    'Error',
                    'Acta con estatus de documento diferente a escaneado'
                  );
                  console.log(err);
                },
              });
          } else {
            this.onLoadToast('error', 'Error', 'El valor del folio es vacío');
          }
        } else {
          this.onLoadToast(
            'error',
            'Error',
            'El plazo para cerrar actas del mes anterior ha caducado.'
          );
        }
      },
      error: err => {
        this.handleError(err, err.msg);
      },
    });
  }

  validateClosingDate() {
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
    if (testDate < new Date(this.maximunClosingTime)) {
      //cambiar testDate x currentDate
      validDate = true;
    }
    return validDate;
  }

  //se construye el objeto necesario para actualizar el acta
  buildObjectToUpdate() {
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
    this.copyFormValues(dataToUpdate);
    this.proceedingsService.update(dataToUpdate.id, dataToUpdate).subscribe({
      next: (resp: IListResponse<IProceedings>) => {
        this.onLoadToast(
          'success',
          'Actualizada',
          'El acta ha sido actualizado exitosamente'
        );
        this.proceedingsKey = this.form.value.proceedingsCve;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status <= 404) {
          this.form.patchValue(this.dataForm);
          this.onLoadToast('error', 'Error', error.message);
        }
      },
    });
    // .subscribe((resp: IListResponse<IProceedings>) => {
    // });
  }

  copyFormValues(dataToUpdate: IUpdateProceedings) {
    dataToUpdate.proceedingsCve = this.form.value.proceedingsCve;
    dataToUpdate.observations = this.form.value.observations;
    dataToUpdate.authorityOrder = this.form.value.authorityOrder;
    dataToUpdate.universalFolio = this.form.value.universalFolio;
  }

  prepareForm() {
    this.form = this.fb.group({
      previewFind: [null],
      penaltyCause: [null, []],
    });
  }
}
