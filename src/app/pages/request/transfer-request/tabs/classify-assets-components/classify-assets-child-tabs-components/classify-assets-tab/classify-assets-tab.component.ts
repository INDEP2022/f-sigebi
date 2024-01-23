import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, of, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IFormGroup, ModelForm } from 'src/app/core/interfaces/model-form';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IPostGoodResDev } from 'src/app/core/models/ms-rejectedgood/get-good-goodresdev';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodDataAsetService } from 'src/app/core/services/ms-good/good-data-aset.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  NUM_POSITIVE_LETTERS,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ChangeOfGoodCharacteristicService } from 'src/app/pages/administrative-processes/change-of-good-classification/services/change-of-good-classification.service';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';

import { FractionSelectedService } from './classify-assets-tab-service';
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
  @Input() typeOfTransfer?: string = '';
  //@Input() noFracction: any;
  @Output() updateClassifyAssetTableEvent?: EventEmitter<any> =
    new EventEmitter();
  @Output() classifyChildSaveFraction?: EventEmitter<any> = new EventEmitter();

  classiGoodsForm: IFormGroup<IGood>; //bien
  noFracction: any;
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
  typeTransfer: string = '';
  domicileSelected: any = null;

  service = inject(ChangeOfGoodCharacteristicService);
  showButtonSave: boolean = true;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsQueryService: GoodsQueryService,
    private fractionService: FractionService,
    private goodService: GoodService,
    private route: ActivatedRoute,
    private requestHelperService: RequestHelperService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private goodFinderService: GoodFinderService,
    private goodDataAsetService: GoodDataAsetService,
    private authService: AuthService,
    private historyGoodService: HistoryGoodService,
    private goodsInvService: GoodsInvService,
    private fractionSelectedService: FractionSelectedService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Bien, ', this.good);
    this.task = JSON.parse(localStorage.getItem('Task'));
    this.typeTransfer = this.typeOfTransfer;
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
    this.typeTransfer = this.typeOfTransfer;
    if (this.process === 'classify-assets' && this.typeTransfer != 'MANUAL') {
      //desabilita loa botones de guardar y limpiar en caso de ser distinto a manual
      //se comenta la variable por modificaciones
      //this.isClassifyAsset = true;
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
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
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      engineNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
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
      val1: [null],
      val2: [null],
      val3: [null],
      val4: [null],
      val5: [null],
      val6: [null],
      val7: [null],
      val8: [null],
      val9: [null],
      val10: [null],
      val11: [null],
      val12: [null],
      val13: [null],
      val14: [null],
      val15: [null],
      val16: [null],
      val17: [null],
      val18: [null],
      val19: [null],
      val20: [null],
      val21: [null],
      val22: [null],
      val23: [null],
      val24: [null],
      val25: [null],
      val26: [null],
      val27: [null],
      val28: [null],
      val29: [null],
      val30: [null],
      val31: [null],
      val32: [null],
      val33: [null],
      val34: [null],
      val35: [null],
      val36: [null],
      val37: [null],
      val38: [null],
      val39: [null],
      val40: [null],
      val41: [null],
      val42: [null],
      val43: [null],
      val44: [null],
      val45: [null],
      val46: [null],
      val47: [null],
      val48: [null],
      val49: [null],
      val50: [null],
      val51: [null],
      val52: [null],
      val53: [null],
      val54: [null],
      val55: [null],
      val56: [null],
      val57: [null],
      val58: [null],
      val59: [null],
      val60: [null],
      val61: [null],
      val62: [null],
      val63: [null],
      val64: [null],
      val65: [null],
      val66: [null],
      val67: [null],
      val68: [null],
      val69: [null],
      val70: [null],
      val71: [null],
      val72: [null],
      val73: [null],
      val74: [null],
      val75: [null],
      val76: [null],
      val77: [null],
      val78: [null],
      val79: [null],
      val80: [null],
      val81: [null],
      val82: [null],
      val83: [null],
      val84: [null],
      val85: [null],
      val86: [null],
      val87: [null],
      val88: [null],
      val89: [null],
      val90: [null],
      val91: [null],
      val92: [null],
      val93: [null],
      val94: [null],
      val95: [null],
      val96: [null],
      val97: [null],
      val98: [null],
      val99: [null],
      val100: [null],
      val101: [null],
      val102: [null],
      val103: [null],
      val104: [null],
      val105: [null],
      val106: [null],
      val107: [null],
      val108: [null],
      val109: [null],
      val110: [null],
      val111: [null],
      val112: [null],
      val113: [null],
      val114: [null],
      val115: [null],
      val116: [null],
      val117: [null],
      val118: [null],
      val119: [null],
      val120: [null],
    });

    if (this.goodObject != null) {
      if (this.good.ligieSection) {
        this.getSection(new ListParams(), this.good.ligieSection);
      } else {
        this.onLoadToast(
          'warning',
          'Clasificación del bien',
          'El Bien no cuenta con la fracción arancelaria'
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

    this.classiGoodsForm.controls['goodTypeId'].valueChanges.subscribe(data => {
      if (data != 2) {
        this.classiGoodsForm.controls['axesNumber'].setValidators([]);
        this.classiGoodsForm.controls['engineNumber'].setValidators([]);
      }
      this.classiGoodsForm.updateValueAndValidity();
    });
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
  }
  getLevels4(params: ListParams, id?: number, clean: boolean = false) {
    params['filter.parentId'] = '$eq:' + id.toString();
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
    params['sortBy'] = `code:ASC`;
    delete params.text;
    delete params.inicio;
    delete params.pageSize;
    delete params.take;
    params.limit = 100;
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
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
    params['sortBy'] = `id:ASC`;
    params.limit = 100;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectSection = data.data;
        },
        error: error => {
          console.log('Error al obtener la sección 1');
        },
      });
  }

  getSection(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.level'] = '$eq:' + 0;
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params['sortBy'] = `id:ASC`;
    params.limit = 100;
    this.fractionService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          this.selectSection = data.data; //= new DefaultSelect(data.data, data.count);
          if (this.advSearch === true) {
            this.listAdvancedFractions.push(data.data[0].id);
            const listReverse = this.listAdvancedFractions.reverse();
            //estable los id para ser visualizados
            this.setFractions(listReverse);
          }

          if (this.goodObject != null && this.advSearch == false) {
            this.classiGoodsForm.controls['ligieSection'].setValue(id);
          }
          this.advSearch = false;
        },
        error: error => {
          console.log('Error al obtener la sección');
        },
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
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
          console.log('Error al obtener el capítulo');
        },
      });
  }

  getLevel1(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params['sortBy'] = `code:ASC`;
    delete params.text;
    delete params.inicio;
    delete params.pageSize;
    delete params.take;
    params.limit = 100;
    this.fractionService
      .getAll(params)
      .pipe(
        takeUntil(this.$unSubscribe),
        catchError((e: any) => {
          if (e.status == 400) return of({ data: [], count: 0 });
          throw e;
        })
      )
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
          console.log('Error al obtener el nivel 1');
        },
      });
  }

  getLevel2(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
          console.log('Error al obtener el nivel 2');
        },
      });
  }

  getLevel3(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
          console.log('Error al obtener el nivel 3');
        },
      });
  }

  getLevel4(params: ListParams, id?: number, clean: boolean = false) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params['sortBy'] = `code:ASC`;
    params.limit = 100;
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
          console.log('Error al obtener el nivel 4');
        },
      });
  }

  openSearchModal(): void {
    let config: ModalOptions = {
      initialState: {
        parameter: '',
        callback: (next: boolean, fractionSelect: any) => {
          if (next) {
            console.log('Se cerró el modal de búsqueda avanzada');
          }
          console.log('Proceso: ', this.typeDoc);

          const noFracction2 = Number(fractionSelect.id);
          this.fractionSelectedService.actualizarValorCompartido(noFracction2);

          const fractionOrigin = this.good?.fractionId;
          console.log('Fracción del Bien original ', fractionOrigin);
          console.log('Fracción seleccionada de la búsqueda', noFracction2);
          console.log(
            'Original: ',
            fractionOrigin,
            'VS Nuevo: ',
            Number(noFracction2)
          );
          console.log('Formulario de capitulos: ');

          if (this.typeDoc === 'classify-assets') {
            if (noFracction2 != 0) {
              if (fractionOrigin != Number(noFracction2)) {
                console.log(
                  'Actualizando bien automáticamente al cerrar modal'
                );
                setTimeout(() => {
                  this.saveGoodAut(Number(noFracction2));
                }, 3000);
              }
            }
          }
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(AdvancedSearchComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
      console.log('this.matchLevelFraction(res)', res);
      this.noFracction = res.id;
    });
  }

  saveGoodAut(fractionSelect: number) {
    let goodObj = this.classiGoodsForm.value;
    goodObj.goodTypeId = this.classiGoodsForm.controls['goodTypeId'].value;
    goodObj.ligieSection = this.classiGoodsForm.controls['ligieSection'].value;
    goodObj.ligieChapter = this.classiGoodsForm.controls['ligieChapter'].value;
    goodObj.ligieLevel1 = this.classiGoodsForm.controls['ligieLevel1'].value;
    goodObj.ligieLevel2 = this.classiGoodsForm.controls['ligieLevel2'].value;
    goodObj.ligieLevel3 = this.classiGoodsForm.controls['ligieLevel3'].value;
    goodObj.ligieLevel4 = this.classiGoodsForm.controls['ligieLevel4'].value;
    goodObj.goodClassNumber =
      this.classiGoodsForm.controls['goodClassNumber'].value;
    goodObj.fractionId = fractionSelect;

    this.goodService.update(goodObj).subscribe({
      next: resp => {
        console.log('Se actualizó de forma automática: ', resp);
        this.message(
          'success',
          'Fracción del bien cambiada',
          `Asegúrese de guardar sus atributos`
        );
        this.classifyChildSaveFraction.emit(resp.result);
      },
      error: error => {
        console.log('No se actualizó ', error);
        this.message(
          'warning',
          'Fracción del bien no cambió',
          `Verifique la fracción seleccionada`
        );
      },
    });

    /*console.log(this.classiGoodsForm.controls['goodTypeId'].value);
    console.log(this.classiGoodsForm.controls['ligieSection'].value);
    console.log(this.classiGoodsForm.controls['ligieChapter'].value);
    console.log(this.classiGoodsForm.controls['ligieLevel1'].value);
    console.log(this.classiGoodsForm.controls['ligieLevel2'].value);
    console.log(this.classiGoodsForm.controls['ligieLevel3'].value);
    console.log(this.classiGoodsForm.controls['ligieLevel4'].value);
    console.log(this.classiGoodsForm.controls['goodClassNumber'].value);*/
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
    this.advSearch = false;
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
    console.log('this.dataAtribute', this.dataAtribute);
    const goods = this.classiGoodsForm.getRawValue();
    console.log('const goods', goods);
    if (goods.addressId === null) {
      this.message(
        'warning',
        'Domicilio Requerido:',
        'Es requerido el domicilio del Bien'
      );
      return;
    }

    if (this.fractionCode == null) {
      this.message(
        'warning',
        'Sin código de fracción',
        'Todos los Bienes deben tener una fracción'
      );
      return;
    } else {
      if (this.fractionCode.length < 8) {
        this.message(
          'warning',
          'Código de fracción inválida',
          'Todos los Bienes deben tener una fracción de 8 números'
        );
        return;
      }
    }

    /**
     * descomentar en caso de usar la tabla
     */
    /*if (goods.goodId) {
      let noCumply: boolean = false;
      if (this.dataAtribute.length > 0) {
        for (let index = 0; index < this.dataAtribute.length; index++) {
          const element = this.dataAtribute[index];
          if (element.required == true && element.value == null) {
            this.onLoadToast(
              'info',
              `El tributo ${element.attribute.toLowerCase()} es requerido`
            );
            noCumply = true;
            break;
          }
        }
        if (noCumply == false) {
          this.dataAtribute.map((item: any) => {
            if (item.value != null) {
              goods[item.column] = item.value;
            }
          });
        } else {
          return;
        }
      }
    }*/

    if (!goods.idGoodProperty) {
      goods.idGoodProperty =
        Number(goods.goodTypeId) === 1 ? Number(goods.id) : null;
    }

    if (goods.fractionId.id) {
      goods.fractionId = Number(goods.fractionId.id);
    }
    //modificar el campo duplicidad en caso de estar nulo
    goods.duplicity = goods.duplicity == null ? 'N' : goods.duplicity;

    //se modifica el estadus del bien
    if (this.process == 'classify-assets') {
      goods.processStatus = 'CLASIFICAR_BIEN';
    } else {
      goods.processStatus = 'REGISTRO_SOLICITUD';
      //goods.status = 'ROP';
    }

    //Verificar que la cantidad transferente para los tipos de bienes

    //no sea vacío
    if (goods.quantity == null) {
      this.onLoadToast(
        'warning',
        'Cantidad de Transferente',
        'No puede estar vacío'
      );
      return;
    }

    //no sean mayor a 1
    if (
      goods.goodTypeId == 1 ||
      goods.goodTypeId == 4 ||
      goods.goodTypeId == 2 ||
      goods.goodTypeId == 3
    ) {
      if (goods.quantity > 1) {
        this.onLoadToast(
          'warning',
          'Cantidad de Transferente',
          'El Bien no puede tener cantidad de transferente mayor a 1'
        );
        return;
      }

      //Verifica que la cantidad de Transferente para los tienes diferentes acepte fracciones
      if (goods.quantity % 1 != 0) {
        console.log('Entra validacion de decimales');
        this.onLoadToast(
          'warning',
          'Cantidad de Transferente',
          'El Bien no se puede guardar con cantidad de transferente con decimales'
        );
        return;
      }
    }

    //Verifica que la cantidad de Transferente para los tienes diferentes acepte fracciones
    if (
      (goods.unitMeasure == 'PZ' ||
        goods.unitMeasure == 'BAR' ||
        goods.unitMeasure == 'PAR' ||
        goods.unitMeasure == 'PZ' ||
        goods.unitMeasure == 'CZA') &&
      goods.quantity % 1 != 0
    ) {
      console.log('Entra validacion de decimales');
      this.onLoadToast(
        'warning',
        'No permitido',
        'La unidad de medida no permite guardar cantidades en decimal'
      );
      return;
    }

    //Revisa si va vacio Unidad de Medida de Transferente
    if (goods.unitMeasure == null) {
      this.onLoadToast(
        'warning',
        'Debe ingresar unidad de medida transferente'
      );
      return;
    }

    //Establece el campo val25 si es apto o no
    if (goods.val25 == null && goods.goodTypeId == 2) {
      goods.val25 =
        goods.fitCircular == 'Y'
          ? 'APTO PARA CIRCULAR'
          : 'NO APTO PARA CIRCULAR';
    }

    let goodResult: any = null;
    if (goods.goodId === null) {
      goods.requestId = Number(goods.requestId);
      goods.addressId = Number(goods.addressId);
      goods.status = 'ROP';

      //Agrega los vals en caso de ser inmueble
      if (goods.goodTypeId == 1) {
        goods.val1 =
          this.domicileSelected.wayName != null
            ? this.domicileSelected.wayName
            : ' ';
        goods.val2 =
          this.domicileSelected.colonia != null
            ? this.domicileSelected.colonia
            : ' ';
        goods.val3 =
          this.domicileSelected.regionalDelegationId.description != null
            ? this.domicileSelected.regionalDelegationId.description
            : ' ';
        goods.val4 =
          this.domicileSelected.stateOfRepublicName != null
            ? this.domicileSelected.stateOfRepublicName
            : ' ';
      }

      if (goods.goodTypeId == 8) {
        if (goods?.physicalStatus == 1) {
          goods.val1 = 'BUENO';
        } else if (goods?.physicalStatus == 2) {
          goods.val1 = 'MALO';
        }

        goods.val2 = goods?.origin;
      }

      goodResult = await this.createGood(goods);

      this.updateGoodFindRecord(goodResult.result);
      //manda a guardar los campos de los bienes, domicilio, inmueble
      this.childSaveAction = true;
      //window.scrollBy(0, window.innerHeight);
    } else {
      //const good = this.fillUpForm(goods);

      goodResult = await this.updateGood(goods);
      this.updateGoodFindRecord(goodResult.result);
      //manda a actualizar los campos de los bienes, domicilio, inmueble
      this.childSaveAction = true;

      /* setTimeout(() => {
        this.refreshTable(true);
      }, 5000); */
    }

    if (this.process === 'classify-assets') {
      this.classifyChildSaveFraction.emit(goodResult.result);
    } else {
      this.refreshTable(true);

      // setTimeout(() => {
      //   this.refreshTable(true);
      // }, 5000);
    }
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
            this.classiGoodsForm.controls['goodId'].setValue(data.goodId);

            resolve({ saved: true, result: data });
          },
          error: error => {
            resolve({ saved: false });
            this.onLoadToast(
              'error',
              'Bien no creado',
              `Ocurrió un error al guardar el Bien ${error.error.message}`
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
            this.message('success', 'El Bien se ha Actualizado', ``);
            this.classiGoodsForm.controls['id'].setValue(data.id);

            resolve({ saved: true, result: data });
          },
          error: error => {
            resolve({ saved: false });
            this.onLoadToast(
              'error',
              'Bien no creado',
              `Ocurrió un error al guardar el Bien ${error.error.message}`
            );
            console.log(error);
          },
        });
    });
  }

  updateGoodFindRecord(good: any) {
    this.goodDataAsetService
      .updateGoodFinderRecord(good.goodId, good.id)
      .subscribe({
        next: resp => {
          console.log('registro actualizado');
        },
        error: error => {
          console.log('Error actualizar el registro de good', error);
          this.onLoadToast(
            'error',
            'Error al actualizar',
            'No se pudo actualizar el registro'
          );
        },
      });
  }

  getReactiveFormActions() {
    this.classiGoodsForm.controls['ligieSection'].valueChanges.subscribe(
      (data: any) => {
        if (data != null) {
          if (this.advSearch === false) {
            // this.classiGoodsForm.controls['ligieChapter'].setValue(null);
            let fraction = this.selectSection.filter(
              (x: any) => x.id === data
            )[0];

            if (fraction) {
              this.fractionCode = fraction.fractionCode;

              if (this.fractionCode.length === 8) {
                this.setNoClasifyGood(fraction);
                this.setUnidLigieMeasure(fraction);
                this.setFractionId(data, fraction.fractionCode, 'Seccion');

                const relativeTypeId = this.getRelevantTypeId(
                  this.selectSection,
                  data
                );
                this.setRelevantTypeId(relativeTypeId);
              }
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
          let fraction = this.selectChapter.filter(
            (x: any) => x.id === dataChapter
          )[0];
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
          let fractionCodes =
            this.selectLevel1.filter((x: any) => x.id === dataLevel1)[0]
              .fractionCode ?? '';

          let fraction = this.selectLevel1.filter(
            (x: any) => x.id === dataLevel1
          )[0];
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
          let fraction = this.selectLevel2.filter(
            (x: any) => x.id === dataLevel2
          )[0];
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
          let fraction = this.selectLevel3.filter(
            (x: any) => x.id === dataLevel3
          )[0];
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
          const relevantTypeId = this.getRelevantTypeId(
            this.selectLevel4,
            dataLevel4
          );
          this.setRelevantTypeId(relevantTypeId);

          let fraction = this.selectLevel4.filter(
            (x: any) => x.id === dataLevel4
          )[0];
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
    if (arrayData != undefined || arrayData != null) {
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
        this.classiGoodsForm.controls['destiny'].setValue(
          fraction.norms.destination
        );
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
            'warning',
            'Clasificación de Bien nula',
            'El Bien seleccionado no tiene número de clasificación'
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

  createHistoricGood(status: string, good: number) {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: IHistoryGood = {
        propertyNum: good,
        status: status,
        changeDate: new Date(),
        userChange: user.username,
        statusChangeProgram: 'SOLICITUD_TRANSFERENCIA',
        reasonForChange: 'N/A',
      };
      this.historyGoodService.create(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se pudo crear el historico del bien');
        },
      });
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  refreshTable(refresh: boolean) {
    this.requestHelperService.isComponentSaving(refresh);
  }

  getDetailInfoEvent(event: any) {
    this.updateClassifyAssetTableEvent.emit(event);
  }

  getDomicile(event: any) {
    this.domicileSelected = event;
    console.log(this.domicileSelected);
    const stateOfRepId = this.domicileSelected.statusKey;
    const municipalityId = this.domicileSelected.municipalityKey;
    const localityKey = this.domicileSelected.localityKey;
    this.getLocality(Number(municipalityId), stateOfRepId, localityKey);
  }

  getLocality(municipalityId: number, stateKey: number, localityKey: number) {
    const params = new ListParams();
    params['sortBy'] = 'township:ASC';
    params['filter.municipalityKey'] = `$eq:${municipalityId}`;
    params['filter.stateKey'] = `$eq:${stateKey}`;
    params['filter.townshipKey'] = `$eq:${localityKey}`;
    this.goodsInvService
      .getAllTownshipByFilter(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.domicileSelected['colonia'] = resp.data[0].township;
        },
      });
  }

  get dataAtribute() {
    return this.service.data;
  }

  fillUpForm(good: IGood) {
    for (let i = 0; i < this.dataAtribute.length; i++) {
      const element = this.dataAtribute[i];
      if (good.goodTypeId == 2) {
        //if (element.column == 'val3') good.brand = element.value; //se necesita que sea tipo numerico
        //if (element.column == 'val10') good.subBrand = element.value; //se necesita que sea tipo numerico
        if (element.column == 'val8') good.serie = element.value;
        if (element.column == 'val4') good.model = element.value;
        if (element.column == 'val9') good.origin = element.value;
        if (element.column == 'val5') good.axesNumber = +element.value;
        if (element.column == 'val25') good.fitCircular = element.value;
        if (element.column == 'val6') good.engineNumber = +element.value;
        if (element.column == 'val26') good.theftReport = element.value;
      } else if (good.goodTypeId == 3) {
        if (element.column == 'val3') good.operationalState = element.value;
        if (element.column == 'val18') good.engineNumber = +element.value;
        if (element.column == 'val17') good.enginesNumber = element.value;
        if (element.column == 'val13') good.tuition = element.value;
        if (element.column == 'val8') good.flag = element.value;
        if (element.column == 'val4') good.openwork = element.value;
        if (element.column == 'val5') good.length = element.value;
        if (element.column == 'val20') good.sleeve = element.value;
        if (element.column == 'val15') good.shipName = element.value;
        if (element.column == 'val2') good.manufacturingYear = element.value;
        if (element.column == 'val21') good.publicRegistry = element.value;
        if (element.column == 'val7') good.capacity = element.value;
      } else if (good.goodTypeId == 4) {
        if (element.column == 'val1') good.manufacturingYear = element.value;
        if (element.column == 'val7') good.model = element.value;
        if (element.column == 'val3') good.operationalState = element.value;
        if (element.column == 'val10') good.engineNumber = +element.value;
        if (element.column == 'val8') good.enginesNumber = element.value;
        if (element.column == 'val5') good.tuition = element.value;
        if (element.column == 'val15') good.dgacRegistry = element.value;
        if (element.column == 'val9') good.serie = element.value;
        if (element.column == 'val16') good.airplaneType = element.value;
        if (element.column == 'val4') good.origin = element.value;
      } else if (good.goodTypeId == 5) {
      }
    }

    return good;
  }
}
