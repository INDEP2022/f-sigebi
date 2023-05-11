import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IFormGroup, ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IPostGoodResDev } from 'src/app/core/models/ms-rejectedgood/get-good-goodresdev';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  NUM_POSITIVE_LETTERS,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';

@Component({
  selector: 'app-classify-assets-tab',
  templateUrl: './classify-assets-tab.component.html',
  styles: [],
})
export class ClassifyAssetsTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestObject: any;
  @Input() assetsId: any = '';
  @Input() typeDoc: string = '';
  @Input() goodObject: ModelForm<IGood>; //: IFormGroup<any> = null;
  @Input() domicilieObject: IDomicilies;
  @Input() process: string = '';
  @Input() goodSelect: any;
  @Output() classifyChildSaveFraction?: EventEmitter<any> = new EventEmitter();

  classiGoodsForm: IFormGroup<IGood>; //bien
  private bsModalRef: BsModalRef;
  private advSearch: boolean = false;
  private listAdvancedFractions: any = [];

  public selectSection: any;
  public selectChapter: any = []; // = new DefaultSelect<any>();
  public selectLevel1: any = []; //= new DefaultSelect<any>();
  public selectLevel2: any = []; //= new DefaultSelect<any>();
  public selectLevel3: any = []; // = new DefaultSelect<any>();
  public selectLevel4: any = []; // = new DefaultSelect<any>();

  detailArray: any = {};

  good: any = null;
  isClassifyAsset: boolean = false;
  formLoading: boolean = false;
  noItemsFoundMessage = 'No se encontraron elementos';
  fractionCode: string = null;
  goodResDev: IPostGoodResDev = {};
  task: any;
  statusTask: any = '';
  childSaveAction: boolean = false;
  canClean: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsQueryService: GoodsQueryService,
    private fractionService: FractionService,
    private goodService: GoodService,
    private route: ActivatedRoute,
    private requestHelperService: RequestHelperService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));

    // DISABLED BUTTON - FINALIZED //
    this.statusTask = this.task.status;

    this.showHideErrorInterceptorService.showHideError(false);
    this.initForm();
    if (!this.goodObject) {
      this.getSection(new ListParams());
    }
    this.getReactiveFormActions();
    this.processView();
    this.loadingForm();
  }

  //Obtenemos el tipo de proceso//
  processView() {
    this.route.data.forEach((item: any) => {
      this.process = item.process;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.process === 'classify-assets') {
      this.isClassifyAsset = true;
    }

    this.good = changes['goodObject']?.currentValue;
    if (this.classiGoodsForm != undefined) {
      if (this.goodObject != null) {
        this.getSection(new ListParams(), this.good?.ligieSection);
        this.classiGoodsForm.patchValue(this.good);
        this.classiGoodsForm.controls['quantity'].setValue(
          Number(this.good.quantity)
        );
      }
    }
  }

  initForm() {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.classiGoodsForm = this.fb.group({
      id: [null],
      goodId: [null],
      ligieSection: [null],
      ligieChapter: [null],
      ligieLevel1: [null],
      ligieLevel2: [null],
      ligieLevel3: [null],
      ligieLevel4: [null],
      requestFolio: [null],
      uniqueKey: [null],
      requestId: [requestId],
      goodTypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      color: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      goodDescription: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      quantity: [
        1,
        [
          Validators.required,
          Validators.pattern('^[0-9]+([.][0-9]+)?$'),
          Validators.maxLength(13),
        ],
      ],
      quantityy: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      duplicity: [
        'N',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      capacity: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      volume: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      fileeNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ],
      useType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      physicalStatus: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(40)],
      ],
      stateConservation: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(40)],
      ],
      origin: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      goodClassNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieUnit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      appraisal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      destiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]], //preguntar Destino ligie
      transferentDestiny: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      compliesNorm: [
        'N',
        [Validators.pattern(STRING_PATTERN), , Validators.maxLength(1)],
      ], //cumple norma
      notesTransferringEntity: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      unitMeasure: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ], // preguntar Unidad Medida Transferente
      saeDestiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      brand: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      subBrand: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      armor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      model: [
        null,
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE_LETTERS),
          Validators.maxLength(15),
        ],
      ],
      doorsNumber: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      axesNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      engineNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ], //numero motor
      tuition: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      serie: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      chassis: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      cabin: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      fitCircular: [
        'N',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      theftReport: [
        'N',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      addressId: [null, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      operationalState: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      manufacturingYear: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      enginesNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ], // numero de motores
      flag: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      openwork: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      sleeve: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      length: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      shipName: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      publicRegistry: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ], //registro public
      ships: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      dgacRegistry: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ], //registro direccion gral de aereonautica civil
      airplaneType: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      caratage: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ], //kilatage
      material: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      weight: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      fractionId: [null],
      duplicatedGood: [null],
      admissionDate: [null],
      federalEntity: [null],
    });

    if (this.goodObject != null) {
      if (this.good.ligieSection) {
        this.getSection(new ListParams(), this.good.ligieSection);
      } else {
        this.onLoadToast(
          'info',
          'Clasificación del bien',
          'El bien no cuenta con la fracción arancelaria'
        );
      }
      this.classiGoodsForm.patchValue(this.good);
      this.classiGoodsForm.controls['quantity'].setValue(
        Number(this.good.quantity)
      );
      if (this.classiGoodsForm.controls['theftReport'].value === null) {
        this.classiGoodsForm.controls['theftReport'].setValue('N');
      }
      if (this.classiGoodsForm.controls['fitCircular'].value === null) {
        this.classiGoodsForm.controls['fitCircular'].setValue('N');
      }
    }
  }

  loadingForm() {
    this.requestHelperService.currentFormLoading
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((data: any) => {
        if (data === true) {
          this.formLoading = true;

          if (!this.good.ligieSection) {
            this.getSection(new ListParams());
            setTimeout(() => {
              this.formLoading = false;
            }, 500);
          }
        }
      });
  }

  setFractions(listReverse: any) {
    const fractions = [
      'ligieSection',
      'ligieChapter',
      'ligieLevel1',
      'ligieLevel2',
      'ligieLevel3',
      'ligieLevel4',
    ];

    for (let i = 0; i <= listReverse.length; i++) {
      const id = listReverse[i];
      this.classiGoodsForm.controls[fractions[i]].setValue(id);
      if (i === 0) {
        this.getChapter1(new ListParams(), id);
      } else if (i === 1) {
        this.getLevels1(new ListParams(), id);
      } else if (i === 2) {
        this.getLevels2(new ListParams(), id);
      } else if (i === 3) {
        this.getLevels3(new ListParams(), id);
      } else if (i === 4) {
        this.getLevels4(new ListParams(), id);
      }
    }
    this.getSection1(new ListParams());

    // console.log(listReverse);
  }
  getLevels4(params: ListParams, id?: number, clean: boolean = false) {
    params['filter.parentId'] = '$eq:' + id.toString();
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectLevel4 = data.data; //new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.loading = false;
          this.formLoading = false;
        },
      });
  }
  getLevels3(params: ListParams, id?: number, clean: boolean = false) {
    params['filter.parentId'] = '$eq:' + id.toString();
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectLevel3 = data.data;
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }
  getLevels2(params: ListParams, id?: number, clean: boolean = false) {
    params['filter.parentId'] = '$eq:' + id.toString();
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectLevel2 = data.data; //= new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }
  getLevels1(params: ListParams, id?: number, clean: boolean = false) {
    params['filter.parentId'] = '$eq:' + id.toString();
    delete params.text;
    delete params.inicio;
    delete params.pageSize;
    delete params.take;
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectLevel1 = data.data;
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }
  getChapter1(params: ListParams, id?: number, clean: boolean = false) {
    if (id) {
      params['filter.parentId'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectChapter = data.data;
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }
  getSection1(params: ListParams, id?: number) {
    params['filter.level'] = '$eq:' + 0;
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectSection = data.data;
        },
        error: error => {},
      });
  }

  getSection(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.level'] = '$eq:' + 0;
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectSection = data.data; //= new DefaultSelect(data.data, data.count);
          console.log(this.selectSection);
          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            const listReverse = this.listAdvancedFractions.reverse();
            //estable los id para ser visualizados
            this.setFractions(listReverse);
          }

          if (this.goodObject != null && this.advSearch == false) {
            this.classiGoodsForm.controls['ligieSection'].setValue(id);
          }
          console.log(this.advSearch + '<advance search>>>>>>>>>>>><');
          this.advSearch = false;
        },
        error: error => {},
      });
  }

  getChapter(params: ListParams, id?: number, clean: boolean = false) {
    if (id) {
      if (this.advSearch === false) {
        params['filter.parentId'] = '$eq:' + id.toString();
      } else {
        params['filter.id'] = '$eq:' + id.toString();
      }
    }
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          //this.selectChapter = new DefaultSelect(data.data, data.count);
          this.selectChapter = data.data;

          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            this.getSection(new ListParams(), data.data[0].parentId);
          }

          if (
            this.goodObject &&
            this.good.ligieChapter &&
            this.advSearch == false &&
            clean == false
          ) {
            this.classiGoodsForm.controls['ligieChapter'].setValue(
              this.good.ligieChapter
            );
          }
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }

  getLevel1(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    delete params.text;
    delete params.inicio;
    delete params.pageSize;
    delete params.take;
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.selectLevel1 = data.data; //= new DefaultSelect(data.data, data.count);

          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            this.getChapter(new ListParams(), data.data[0].parentId);
          }

          if (this.goodObject && this.advSearch == false && clean == false) {
            this.classiGoodsForm.controls['ligieLevel1'].setValue(
              this.good.ligieLevel1
            );
          }
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }

  getLevel2(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.selectLevel2 = data.data; //= new DefaultSelect(data.data, data.count);

          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            this.getLevel1(new ListParams(), data.data[0].parentId);
          }

          if (this.goodObject && this.advSearch == false && clean == false) {
            this.classiGoodsForm.controls['ligieLevel2'].setValue(
              this.good.ligieLevel2
            );
          }
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }

  getLevel3(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.selectLevel3 = data.data; //= new DefaultSelect(data.data, data.count);

          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            this.getLevel2(new ListParams(), data.data[0].parentId);
          }

          if (this.goodObject && this.advSearch == false && clean == false) {
            this.classiGoodsForm.controls['ligieLevel3'].setValue(
              this.good.ligieLevel3
            );
          }
        },
        error: error => {
          this.formLoading = false;
        },
      });
  }

  getLevel4(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.selectLevel4 = data.data; //new DefaultSelect(data.data, data.count);

          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            this.getLevel3(new ListParams(), data.data[0].parentId);
          }

          if (this.goodObject && clean == false) {
            this.classiGoodsForm.controls['ligieLevel4'].setValue(
              this.good.ligieLevel4
            );

            setTimeout(() => {
              this.loading = false;
              this.formLoading = false;
            }, 300);
          }
        },
        error: error => {
          this.loading = false;
          this.formLoading = false;
        },
      });
  }

  openSearchModal(): void {
    let config: ModalOptions = {
      initialState: {
        parameter: '',
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(AdvancedSearchComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });
  }

  matchLevelFraction(res: any) {
    this.advSearch = true;
    this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
    this.classiGoodsForm.controls['ligieChapter'].setValue(null);
    this.classiGoodsForm.controls['ligieSection'].setValue(null);
    this.listAdvancedFractions = [];
    switch (Number(res.level)) {
      case 5:
        this.getLevel4(new ListParams(), res.id);
        break;
      case 4:
        this.getLevel3(new ListParams(), res.id);
        break;
      case 3:
        this.getLevel2(new ListParams(), res.id);
        break;
      case 2:
        this.getLevel1(new ListParams(), res.id);
        break;
      case 1:
        this.getChapter(new ListParams(), res.id);
        break;
      case 0:
        this.getSection(new ListParams(), res.id);
        break;
      default:
        break;
    }
  }
  cleanLvl(lvl?: number) {
    this.classiGoodsForm.controls['goodTypeId'].setValue(null);
    this.selectLevel4 = [];
    this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
    this.selectLevel3 = [];
    this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
    this.selectLevel2 = [];
    this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
    this.selectLevel1 = [];
    this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
    this.selectChapter = [];
    this.classiGoodsForm.controls['ligieChapter'].setValue(null);
    this.classiGoodsForm.controls['ligieSection'].setValue(null);
    this.getSection(new ListParams());
  }

  async saveRequest(): Promise<void> {
    const goods = this.classiGoodsForm.getRawValue();
    if (goods.addressId === null) {
      this.message(
        'error',
        'Domicilio requerido',
        'Es requerido el domicilio del bien'
      );
      return;
    }

    if (this.fractionCode.length < 8) {
      this.message(
        'error',
        'Codigo de fraccion',
        'Todos los bienes deben tener una fracción de 8 números'
      );
      return;
    }

    if (!goods.idGoodProperty) {
      goods.idGoodProperty =
        Number(goods.goodTypeId) === 1 ? Number(goods.id) : null;
    }

    if (goods.fractionId.id) {
      goods.fractionId = Number(goods.fractionId.id);
    }

    //se modifica el estadus del bien
    goods.processStatus = 'VERIFICAR_CUMPLIMIENTO';
    let goodResult: any = null;
    if (goods.goodId === null) {
      goods.requestId = Number(goods.requestId);
      goods.addressId = Number(goods.addressId);
      goodResult = await this.createGood(goods);
      //manda a guardar los campos de los bienes, domicilio, inmueble
      //if (this.process != 'classify-assets') {
      this.childSaveAction = true;
      //}
    } else {
      goodResult = await this.updateGood(goods);
      //manda a actualizar los campos de los bienes, domicilio, inmueble
      // if (this.process != 'classify-assets') {
      this.childSaveAction = true;
      //}
    }

    /*if(this.process === 'classify-assets'){
      this.classifyChildSaveFraction.emit(goodResult)
    }*/
    setTimeout(() => {
      this.refreshTable(true);
    }, 5000);
  }

  createGood(good: any) {
    return new Promise((resolve, reject) => {
      this.goodService
        .create(good)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            this.message(
              'success',
              'Guardado',
              `El registro se guardó exitosamente`
            );
            this.classiGoodsForm.controls['id'].setValue(data.id);

            resolve({ saved: true, result: data });
          },
          error: error => {
            resolve({ saved: false });
            this.onLoadToast(
              'error',
              'Bien no creado',
              `Ocurrio un error al guardar el bien ${error.error.message}`
            );
            console.log(error);
          },
        });
    });
  }

  updateGood(good: any) {
    return new Promise((resolve, reject) => {
      good.requestId = good.requestId.id;
      if (good.addressId.id) {
        good.addressId = Number(good.addressId.id);
      }
      good.quantity = Number(good.quantity);
      this.goodService
        .update(good)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            this.message(
              'success',
              'Guardado',
              `El registro se actualizo exitosamente`
            );
            this.classiGoodsForm.controls['id'].setValue(data.id);

            resolve({ saved: true, result: data });
          },
          error: error => {
            resolve({ saved: false });
            this.onLoadToast(
              'error',
              'Bien no creado',
              `Ocurrio un error al guardar el bien ${error.error.message}`
            );
            console.log(error);
          },
        });
    });
  }

  getReactiveFormActions() {
    this.classiGoodsForm.controls['ligieSection'].valueChanges.subscribe(
      (data: any) => {
        console.log('data', data);
        if (data != null) {
          if (this.advSearch === false) {
            // this.classiGoodsForm.controls['ligieChapter'].setValue(null);
            let fraction = this.selectSection.filter(
              (x: any) => x.id === data
            )[0];

            if (fraction) {
              this.fractionCode = fraction.fractionCode;
            }
            const section: any = this.good ? this.good.ligieSection : null;
            if (section != data) {
              this.selectChapter = [];
              this.selectLevel1 = [];
              this.selectLevel2 = [];
              this.selectLevel3 = [];
              this.selectLevel4 = [];
              this.classiGoodsForm.controls['ligieChapter'].setValue(null);
              this.getChapter(new ListParams(), data, true);
            } else {
              this.getChapter(new ListParams(), data, false);
            }
          }
        }
      }
    );

    this.classiGoodsForm.controls['ligieChapter'].valueChanges.subscribe(
      (dataChapter: any) => {
        if (dataChapter != null) {
          console.log('dataChapter', dataChapter);
          let fraction = this.selectChapter.filter(
            (x: any) => x.id === dataChapter
          )[0];
          console.log('fraccion', fraction);
          if (fraction) {
            this.fractionCode = fraction.fractionCode;
            this.setNoClasifyGood(fraction);
            this.setUnidLigieMeasure(fraction);
            this.setFractionId(dataChapter, fraction.fractionCode, 'Capítulo');

            const relativeTypeId = this.getRelevantTypeId(
              this.selectChapter,
              dataChapter
            );
            this.setRelevantTypeId(relativeTypeId);
          }

          const chapter: any = this.good ? this.good.ligieChapter : null;
          if (this.advSearch === false && chapter === dataChapter) {
            this.getLevel1(new ListParams(), dataChapter, false);
          } else if (this.advSearch === false && chapter != dataChapter) {
            this.selectLevel1 = [];
            this.selectLevel2 = [];
            this.selectLevel3 = [];
            this.selectLevel4 = [];
            this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.getLevel1(new ListParams(), dataChapter, true);
          }
        } else {
          this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
          this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
          this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel1'].valueChanges.subscribe(
      (dataLevel1: any) => {
        if (dataLevel1 != null) {
          console.log('dataLevel1', dataLevel1);

          let fractionCodes =
            this.selectLevel1.filter((x: any) => x.id === dataLevel1)[0]
              .fractionCode ?? '';

          let fraction = this.selectLevel1.filter(
            (x: any) => x.id === dataLevel1
          )[0];
          console.log('fraccion', fraction);
          this.fractionCode = fractionCodes;
          this.setNoClasifyGood(fraction);
          this.setUnidLigieMeasure(fraction);
          this.setFractionId(dataLevel1, fraction.fractionCode, 'Nivel 1');

          const relativeTypeId = this.getRelevantTypeId(
            this.selectLevel1,
            dataLevel1
          );
          this.setRelevantTypeId(relativeTypeId);
          //no se puse el this.getNorma(fraction);

          const lvl1: any = this.good ? this.good.ligieLevel1 : null;
          if (this.advSearch === false && lvl1 === dataLevel1) {
            this.getLevel2(new ListParams(), dataLevel1, false);
          } else if (this.advSearch === false && lvl1 != dataLevel1) {
            this.selectLevel2 = [];
            this.selectLevel3 = [];
            this.selectLevel4 = [];
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.getLevel2(new ListParams(), dataLevel1, true);
          }
        } else {
          this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
          this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel2'].valueChanges.subscribe(
      (dataLevel2: any) => {
        //this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
        if (dataLevel2 != null) {
          console.log('dataLevel2', dataLevel2);
          console.log('dataLevel2', this.selectLevel2);
          let fraction = this.selectLevel2.filter(
            (x: any) => x.id === dataLevel2
          )[0];
          console.log('fraccion', fraction);
          if (fraction) {
            this.fractionCode = fraction.fractionCode;
            this.setNoClasifyGood(fraction);
            this.setUnidLigieMeasure(fraction);
            this.setFractionId(dataLevel2, fraction.fractionCode, 'Nivel 2');

            const relativeTypeId = this.getRelevantTypeId(
              this.selectLevel2,
              dataLevel2
            );
            this.setRelevantTypeId(relativeTypeId);

            //this.getNorma(fraction);
          }

          const lvl2: any = this.good ? this.good.ligieLevel2 : null;
          if (this.advSearch === false && lvl2 === dataLevel2) {
            this.getLevel3(new ListParams(), dataLevel2, false);
          } else if (this.advSearch === false && lvl2 != dataLevel2) {
            this.selectLevel3 = [];
            this.selectLevel4 = [];
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.getLevel3(new ListParams(), dataLevel2, true);
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel3'].valueChanges.subscribe(
      (dataLevel3: any) => {
        //this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
        if (dataLevel3 != null) {
          console.log('fraccion lvl3', dataLevel3);
          console.log('fraccion lvl3', this.selectLevel3);
          let fraction = this.selectLevel3.filter(
            (x: any) => x.id === dataLevel3
          )[0];
          console.log('fraccion', fraction);
          if (fraction) {
            this.fractionCode = fraction.fractionCode;
            this.setNoClasifyGood(fraction);
            this.setUnidLigieMeasure(fraction);
            this.setFractionId(dataLevel3, fraction.fractionCode, 'Nivel 3');

            const relevantTypeId = this.getRelevantTypeId(
              this.selectLevel3,
              dataLevel3
            );
            this.setRelevantTypeId(relevantTypeId);
            this.getNorma(fraction);
          }

          const lvl3: any = this.good ? this.good.ligieLevel3 : null;
          if (this.advSearch === false && lvl3 === dataLevel3) {
            this.getLevel4(new ListParams(), dataLevel3, false);
          } else if (this.advSearch === false && lvl3 != dataLevel3) {
            this.selectLevel4 = [];
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.getLevel4(new ListParams(), dataLevel3, true);
          }
        }
      }
    );

    this.classiGoodsForm.controls['ligieLevel4'].valueChanges.subscribe(
      (dataLevel4: any) => {
        if (dataLevel4 !== null) {
          console.log('fraccion lvl4', dataLevel4);
          const relevantTypeId = this.getRelevantTypeId(
            this.selectLevel4,
            dataLevel4
          );
          this.setRelevantTypeId(relevantTypeId);

          let fraction = this.selectLevel4.filter(
            (x: any) => x.id === dataLevel4
          )[0];
          console.log('fraccion', fraction);
          if (fraction) {
            this.fractionCode = fraction.fractionCode;
            this.setNoClasifyGood(fraction);
            this.setUnidLigieMeasure(fraction);
            this.setFractionId(dataLevel4, fraction.fractionCode, 'Nivel 4');
            this.getNorma(fraction);
          }
        }
      }
    );
  }

  getRelevantTypeId(arrayData: any, id: number): any {
    // console.log(arrayData);
    if (arrayData) {
      return arrayData.filter((x: any) => x.id == id)[0].relevantTypeId;
    }
  }

  //inserta en el formulario el id del tipo de bien
  setRelevantTypeId(relativeTypeId: number) {
    if (this.classiGoodsForm.controls['goodTypeId'].value !== relativeTypeId) {
      this.classiGoodsForm.controls['goodTypeId'].setValue(relativeTypeId);
    }
  }

  //registra el fraction id en el formulario
  setFractionId(fractionId: number, fractionCode: string, campo: string) {
    if (fractionCode !== null) {
      //if (fractionCode.length >= 8) {
      this.classiGoodsForm.controls['fractionId'].setValue(Number(fractionId));
      //}
    }
  }

  /* obtener destino ligie */
  getNorma(fraction: any) {
    // el el codigo o el codigo de fracion es = 8 verifica la norma
    if (fraction.fractionCode.length === 8) {
      if (fraction.normId != null) {
        this.classiGoodsForm.controls['destiny'].setValue(fraction.normId);
      } else {
        this.classiGoodsForm.controls['destiny'].setValue(null);
      }
    }
  }

  //guarda el no_clasify_good numero clasificacion del bien
  setNoClasifyGood(fraction: any) {
    if (fraction.fractionCode != null) {
      if (fraction.fractionCode.length === 8) {
        if (fraction.clasificationId) {
          this.classiGoodsForm.controls['goodClassNumber'].setValue(
            fraction.clasificationId
          );
        } else {
          this.classiGoodsForm.controls['goodClassNumber'].setValue(null);
          this.message(
            'info',
            'clasificación de bien nula',
            'El bien seleccionado no tiene numero de clasificación de bien'
          );
        }
      }
    } else {
      this.classiGoodsForm.controls['goodClassNumber'].setValue(null);
    }
  }

  setUnidLigieMeasure(fraction: any) {
    if (fraction.unit != null) {
      //this.classiGoodsForm.controls['ligieUnit'].setValue(fraction.unit);

      this.classiGoodsForm.controls['ligieUnit'].setValue(fraction.unit);

      if (this.classiGoodsForm.controls['unitMeasure'].value === null) {
        this.classiGoodsForm.controls['unitMeasure'].setValue(fraction.unit);
      }
    } else {
      this.classiGoodsForm.controls['ligieUnit'].setValue(null);
    }
  }
  //obtenien la unidad de medida
  /*getUnidMeasure(value: string) {
    if (value) {
      if (value.length === 8) {
        const fractionCode = { fraction: value };
        this.goodsQueryService
          .getUnitLigie(fractionCode)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: (data: any) => {
              //guarda el no_clasify_good numero clasificacion del bien
              if (data.clasifGoodNumber !== null) {
                this.classiGoodsForm.controls['goodClassNumber'].setValue(
                  data.clasifGoodNumber
                );
              } else {
                this.message(
                  'info',
                  'clasificación de bien nula',
                  'el bien seleccionado no tiene numero de clasificación de bien'
                );
              }
              //guarda el tipo de unidad
              this.goodsQueryService
                .getLigieUnitDescription(data.ligieUnit)
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe((data: any) => {
                  this.classiGoodsForm.controls['ligieUnit'].setValue(
                    data.description
                  );

                  if (
                    this.classiGoodsForm.controls['unitMeasure'].value === null
                  ) {
                    const ligieUnit =
                      this.classiGoodsForm.controls['ligieUnit'].value;
                    this.classiGoodsForm.controls['unitMeasure'].setValue(
                      ligieUnit
                    );
                  }
                });
            },
            error: error => {
              console.log('codigo de graccion', value);
              console.log(error.error.message);
              this.onLoadToast(
                'error',
                '',
                'El bien no cuenta con su clasificacion del bien'
              );
            },
          });
      } 
    }
  }*/

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  refreshTable(refresh: boolean) {
    this.requestHelperService.isComponentSaving(refresh);
  }
}
