import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  EMPTY,
  from,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import {
  DetailProceedingsDevolutionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GoodService } from './../../../../core/services/ms-good/good.service';
import { COLUMNS } from './columns';
import { GOODS_COLUMNS } from './goods-columns';
import { PROCEEDINGS_COLUMNS } from './proceedings-columns';

@Component({
  selector: 'app-return-acts',
  templateUrl: './return-acts.component.html',
  styleUrls: ['./return-acts.component.scss'],
})
export class FdpAddCReturnActsComponent extends BasePage implements OnInit {
  proceedingList: any[] = [
    { value: 'DEV', text: 'DEV' },
    { value: 'REST', text: 'REST' },
  ];
  response: boolean = false;
  actForm: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2;
  settingsDetailProceedings: any;
  settingsGoods: any;
  proceedingsColumns: any;
  fileNumber: number;
  flag: boolean;
  selectedProceedings: boolean;
  proceedingsData: any[] = [];
  proceedingsData2: any[] = [];
  detailProceedingsData: any[] = [];
  goodsData: any[] = [];
  dataResp: IProceedings;
  totalProceedings: number;
  totalGoods: number;
  totalDetailProceedings: number;
  copyDataProceedings: any;
  quantityOfGoods: number;
  quantityDetailProceedings: number;
  // dataTable: any[] = [];
  proceedingsNumb: number;
  //paginacion
  firsTime: boolean = false;
  paginatorGoods: any = {};
  paginatorProceedings: any = {};
  paramsDetailProceedings = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsProceedings = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    private goodService: GoodService
  ) {
    super();

    this.settings = { ...this.settings };
    this.settings.selectMode = 'single';
    (this.settings.rowClassFunction = (row: any) => {
      if (row.isSelected) {
        return 'selected-row';
      }
      return '';
    }),
      (this.settings.columns = PROCEEDINGS_COLUMNS);
    this.settings.actions.delete = true;
    this.settingsDetailProceedings = { ...this.settings, actions: false };
    this.settingsDetailProceedings.columns = COLUMNS;
    this.settingsGoods = { ...this.settings, actions: false };
    this.settingsGoods.columns = GOODS_COLUMNS;
    this.proceedingsColumns = { ...this.settings, actions: false };
    this.proceedingsColumns.columns = this.proceedingsColumns;
  }

  ngOnInit(): void {
    this.initForm();
    this.initPaginatorProceedings();
    this.initPaginatorGoods();
    this.initPaginatorDetailProceedings();
  }

  onRowSelect(event: any): void {
    const selectedRow = event.data;
    this.proceedingsData.forEach(row => {
      row.isSelected = false;
    });
    selectedRow.isSelected = true;
    // this.gridService.grid.dataSet.select(selectedRow);
  }

  getGoods() {
    return this.goodService.getByExpedient(this.fileNumber, {
      text: '?expedient=',
      page: this.paginatorGoods.page,
      limit: this.paginatorGoods.limit,
    });
    // .subscribe(data => console.log(data));
  }

  search(term: string | number) {
    this.fileNumber = Number(term);
    this.getInfo();
  }

  handleError(error: HttpErrorResponse, msg: string) {
    if (error.status <= 404) {
      this.onLoadToast('info', 'Información', msg);
    }
  }

  getProceedings(fileNumber: number) {
    this.selectedProceedings = false;
    return this.proceedingsService.getActByFileNumber(
      fileNumber,
      this.paginatorProceedings
    );
  }

  getDetailProceedings(proceedingsNumb: number) {
    console.log(proceedingsNumb);
    return this.detailProceedingsDevolutionService.getDetailProceedingsDevolutionByProceedingsNumb(
      proceedingsNumb,
      this.paginatorGoods
    );
  }

  getInfo() {
    this.flag = false;
    this.firsTime = false;
    this.getProceedings(this.fileNumber)
      .pipe(
        catchError(err => {
          this.handleError(
            err,
            'No se han encontrado registros para este expediente'
          );
          return EMPTY;
        }),
        switchMap((proceedings: IListResponse<IProceedings>) =>
          this.getDetailProceedings(proceedings.data[0].id).pipe(
            catchError(err => {
              tap(resp => console.log(resp)),
                this.handleError(
                  err,
                  'No existen bienes asociados a esta acta'
                );
              return of(err);
            }),
            concatMap((detail: any) => {
              console.log(detail.data);
              return from(detail.data).pipe(
                concatMap((element: any) => {
                  console.log(element);
                  return this.goodService
                    .getFromGoodsAndExpedients({
                      goodNumber: Number(element?.numGoodId?.id),
                    })
                    .pipe(
                      map((status_description: any) => {
                        console.log('222222222: ', status_description);
                        return {
                          ...element,
                          di_status_good:
                            status_description.data[0].description,
                        };
                      })
                    );
                }),
                toArray()
              );
            }),
            // map((data: any) => {
            //   for (let good of data?.data) {
            //     this.goodService
            //       .getFromGoodsAndExpedients({
            //         goodNumber: Number(good.numGoodId.id),
            //       })
            //       .pipe(
            //         tap((data: any) => {
            //           good.di_status_good = data.data[0].description;
            //         })
            //       );
            //   }
            // }),
            concatMap((detailProceeding: any) =>
              this.getGoods().pipe(
                map((goods: any) => ({
                  proceedings,
                  detailProceeding,
                  goods,
                }))
              )
            )
          )
        )
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.firsTime = false;
          this.prepareData(data);
          this.totalProceedings = Number(data.proceedings.count);
          console.log(data?.detailProceeding?.length);
          this.totalDetailProceedings = Number(data.detailProceeding.length);
          this.totalGoods = Number(data.goods.count);
        },
        error: error => {
          console.log(error);
        },
      });
  }

  prepareData(data: {
    proceedings: IListResponse<IProceedings>;
    goods: any;
    detailProceeding: any;
  }) {
    console.log(data);
    this.proceedingsData = [];
    this.proceedingsData2 = [];
    let expedientInfo: any = {};
    this.dataResp = data.proceedings.data[0];
    expedientInfo.penaltyCause =
      data.proceedings.data[0].fileNumber.penaltyCause;
    expedientInfo.previewFind = data.proceedings.data[0].fileNumber.previewFind;
    this.actForm.patchValue(expedientInfo);
    this.prepareProceedingsData(data.proceedings);
    // this.proceedingsData = this.proceedingsData2;
    console.log(data);
    if (!data.goods?.hasOwnProperty('error')) {
      this.prepareGoodsData(data?.goods);
    }
    if (!data.detailProceeding?.hasOwnProperty('error')) {
      console.log(data.detailProceeding);
      this.prepareDetailProceedings(data?.detailProceeding);
    }
    // this.form.patchValue(this.dataForm);
    this.flag = true;
  }

  convertDate(date: Date) {
    return new Date(date).toLocaleDateString().toString();
  }

  prepareProceedingsData(data: IListResponse<IProceedings>) {
    let proceedingsTemp: any;
    this.copyDataProceedings = data.data;
    for (let proceedings of data.data) {
      proceedingsTemp = {
        proceeding: proceedings.id,
        receiptCve: proceedings.receiptCve,
        authorityOrder: proceedings.authorityOrder,
        proceedingsCve: proceedings.proceedingsCve,
        elaborationDate: this.convertDate(proceedings.elaborationDate),
        universalFolio: proceedings.universalFolio,
        witnessOne: proceedings.witnessOne,
        witnessTwo: proceedings.witnessTwo,
        beneficiaryOwner: proceedings.beneficiaryOwner,
        auditor: proceedings.auditor,
        observations: proceedings.observations,
      };
      console.log(proceedingsTemp.universalFolio);
      this.proceedingsData.push(proceedingsTemp);
    }
  }

  prepareGoodsData(data: IListResponse<IGood>) {
    console.log(data);
    this.quantityOfGoods = data.count;
    let goodsData: any[] = [];
    for (let good of data.data) {
      let data: any = {
        id: good.id,
        description: good.description,
        extDomProcess: good.extDomProcess,
        quantity: good.quantity,
        appraisedValue: good.appraisedValue,
      };
      goodsData.push(data);
    }
    this.goodsData = goodsData;
  }

  prepareDetailProceedings(detailProceedings: any) {
    console.log(detailProceedings);
    this.quantityDetailProceedings = detailProceedings?.count;
    let detailProceedingsData: any[] = [];
    console.log(detailProceedings);
    for (let detail of detailProceedings) {
      let data: any = {
        goodId: detail.good[0].id,
        description: detail.good[0].description,
        extDomProcess: detail.good[0].extDomProcess,
        quantity: detail.good[0].quantity,
        amountReturned: detail.amountReturned,
      };
      console.log(detailProceedingsData);
      detailProceedingsData.push(data);
    }
    this.detailProceedingsData = detailProceedingsData;
  }

  onSubmit() {}

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

  initPaginatorDetailProceedings() {
    this.paramsDetailProceedings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        console.log(2);
        this.paginatorGoods.page = data.page;
        this.paginatorGoods.limit = data.limit;
        if (!this.firsTime) {
          console.log('XXXX');
          this.getDetailProceedings(this.proceedingsNumb).subscribe(
            (data: any) => {
              this.prepareGoodsData(data);
            }
          );
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
        this.getGoods().subscribe((data: any) => {
          this.prepareGoodsData(data);
        });
      }
    });
  }

  settingsChange(event: any, op: number) {
    op === 1
      ? (this.settings = event)
      : (this.settingsDetailProceedings = event);
  }

  initForm() {
    this.actForm = this.fb.group({
      previewFind: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      penaltyCause: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      //DELITO     FALTA
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
    });
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }
}

const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    proceso: '1',
    cantidad: 1,
    importe: '1',
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    proceso: '2',
    cantidad: 3,
    importe: 5,
  },
];
