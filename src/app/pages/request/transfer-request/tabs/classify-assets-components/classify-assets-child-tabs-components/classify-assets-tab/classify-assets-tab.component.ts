import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IFormGroup, ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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

  classiGoodsForm: IFormGroup<IGood>; //bien
  private bsModalRef: BsModalRef;
  private advSearch: boolean = false;
  private listAdvancedFractions: any = [];

  public selectSection: any;
  public selectChapter: any = []; // = new DefaultSelect<any>();
  public selectLevel1: any = []; // = new DefaultSelect<any>();
  public selectLevel2: any = []; // = new DefaultSelect<any>();
  public selectLevel3: any = []; // = new DefaultSelect<any>();
  public selectLevel4: any = []; // = new DefaultSelect<any>();

  detailArray: any = {};

  good: any = null;

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
    this.showHideErrorInterceptorService.showHideError(false);
    this.initForm();
    if (!this.goodObject) {
      this.getSection(new ListParams());
    }
    this.getReactiveFormActions();
    this.processView();
  }

  //Obtenemos el tipo de proceso//
  processView() {
    this.route.data.forEach((item: any) => {
      this.process = item.process;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*console.log('df', this.assetsId);
      if (changes['assetsId'].currentValue != '') {
        //cargar la clasificacion de bienes segun el id que se envio
      } */
    //bienes selecionados
    this.good = changes['goodObject']?.currentValue;
    if (this.classiGoodsForm != undefined) {
      if (this.goodObject != null) {
        this.getSection(new ListParams(), this.good?.ligieSection);
        this.classiGoodsForm.patchValue(this.good);
      }
    }
  }

  initForm() {
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.classiGoodsForm = this.fb.group({
      id: [null],
      goodId: [null],
      ligieSection: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieChapter: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel1: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel2: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel3: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel4: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
      quantity: [1, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      duplicity: [
        'N',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      capacity: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      volume: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      fileeNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ],
      useType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      physicalStatus: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      stateConservation: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      origin: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      goodClassNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieUnit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      appraisal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      destiny: [null, [Validators.pattern(NUMBERS_PATTERN)]], //preguntar Destino ligie
      transferentDestiny: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ], // preguntar Unidad Medida Transferente
      saeDestiny: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      brand: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      subBrand: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      armor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      model: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      doorsNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      axesNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      engineNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ], //numero motor
      tuition: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      serie: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      chassis: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      cabin: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
      addressId: [null],
      operationalState: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      manufacturingYear: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      enginesNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ], // numero de motores
      flag: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      openwork: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      sleeve: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      length: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
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
          Validators.maxLength(30),
        ],
      ], //registro public
      ships: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      dgacRegistry: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ], //registro direccion gral de aereonautica civil
      airplaneType: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
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
          Validators.maxLength(30),
        ],
      ],
      fractionId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });

    if (this.goodObject != null) {
      this.getSection(new ListParams(), this.good.ligieSection);
      this.classiGoodsForm.patchValue(this.good);
    }
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

    for (let i = 0; i < listReverse.length; i++) {
      const id = listReverse[i];
      this.classiGoodsForm.controls[fractions[i]].setValue(id);
    }
  }

  getSection(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.level'] = '$eq:' + 0;
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.showHideErrorInterceptorService.showHideError(false);
        this.selectSection = data.data; //= new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.listAdvancedFractions.push(data.data[0].id);
          const listReverse = this.listAdvancedFractions.reverse();
          //estable los id para ser visualizados
          this.setFractions(listReverse);
          this.advSearch = false;
        }

        if (this.goodObject != null) {
          this.classiGoodsForm.controls['ligieSection'].setValue(id);
        }
      },
      error: error => {},
    });
  }

  getChapter(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        //this.selectChapter = new DefaultSelect(data.data, data.count);
        this.selectChapter = data.data;

        if (this.advSearch === true) {
          this.listAdvancedFractions.push(data.data[0].id);
          this.getSection(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieChapter'].setValue(
            this.good.ligieChapter
          );
        }
      },
      error: error => {},
    });
  }

  getLevel1(params: ListParams, id?: number) {
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
    this.fractionService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectLevel1 = data.data; //= new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.listAdvancedFractions.push(data.data[0].id);
          this.getChapter(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel1'].setValue(
            this.good.ligieLevel1
          );
        }
      },
      error: error => {},
    });
  }

  getLevel2(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectLevel2 = data.data; //= new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.listAdvancedFractions.push(data.data[0].id);
          this.getLevel1(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel2'].setValue(
            this.good.ligieLevel2
          );
        }
      },
      error: error => {},
    });
  }

  getLevel3(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.selectLevel3 = data.data; //= new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.listAdvancedFractions.push(data.data[0].id);
          this.getLevel2(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel3'].setValue(
            this.good.ligieLevel3
          );
        }
      },
      error: error => {},
    });
  }

  getLevel4(params: ListParams, id?: number) {
    if (this.advSearch === false) {
      params['filter.parentId'] = '$eq:' + id.toString();
    } else {
      params['filter.id'] = '$eq:' + id.toString();
    }
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectLevel4 = new DefaultSelect(data.data, data.count);

        if (this.advSearch === true) {
          this.listAdvancedFractions.push(data.data[0].id);
          this.getLevel3(new ListParams(), data.data[0].parentId);
        }

        if (this.goodObject) {
          this.classiGoodsForm.controls['ligieLevel4'].setValue(
            this.good.ligieLevel4
          );
        }
      },
      error: error => {
        this.loading = false;
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

  clean() {
    this.classiGoodsForm.controls['ligieSection'].setValue(null);
    this.classiGoodsForm.controls['ligieChapter'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
    this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
    this.classiGoodsForm.controls['goodTypeId'].setValue(null);
  }

  saveRequest(): void {
    const goods = this.classiGoodsForm.getRawValue();
    if (goods.addressId === null) {
      this.message(
        'error',
        'Domicilio requerido',
        'Es requerido el domicilio del bien'
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

    let goodAction: any = null;
    if (goods.goodId === null) {
      goods.requestId = Number(goods.requestId);
      goods.addressId = Number(goods.addressId);
      this.createGood(goods);
    } else {
      this.updateGood(goods);
    }
  }

  createGood(good: any) {
    this.goodService.create(good).subscribe({
      next: data => {
        this.message(
          'success',
          'Guardado',
          `El registro se guardo exitosamente!`
        );
        this.classiGoodsForm.controls['id'].setValue(data.id);

        this.refreshTable(true);

        setTimeout(() => {
          this.refreshTable(false);
        }, 5000);
      },
      error: error => {},
    });
  }

  updateGood(good: any) {
    good.requestId = good.requestId.id;
    this.goodService.update(good).subscribe({
      next: data => {
        this.message(
          'success',
          'Guardado',
          `El registro se actualizo exitosamente!`
        );
        this.classiGoodsForm.controls['id'].setValue(data.id);

        this.refreshTable(true);

        setTimeout(() => {
          this.refreshTable(false);
        }, 5000);
      },
      error: error => {},
    });
  }

  getReactiveFormActions() {
    this.classiGoodsForm.controls['ligieSection'].valueChanges.subscribe(
      (data: any) => {
        //this.classiGoodsForm.controls['ligieChapter'].setValue(null);
        if (data != null) {
          if (this.advSearch === false) {
            this.getChapter(new ListParams(), data);
            /* this.classiGoodsForm.controls['ligieChapter'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.classiGoodsForm.controls['goodTypeId'].setValue(null); */
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieChapter'].valueChanges.subscribe(
      (dataChapter: any) => {
        if (dataChapter != null) {
          let fractionCode = this.selectChapter.filter(
            (x: any) => x.id === dataChapter
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);
          this.setFractionId(dataChapter, fractionCode, 'Capítulo');

          const relativeTypeId = this.getRelevantTypeId(
            this.selectChapter,
            dataChapter
          );
          this.setRelevantTypeId(relativeTypeId);

          if (this.advSearch === false) {
            this.getLevel1(new ListParams(), dataChapter);
            /* this.classiGoodsForm.controls['ligieLevel1'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.classiGoodsForm.controls['goodTypeId'].setValue(null); */
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel1'].valueChanges.subscribe(
      (dataLevel1: any) => {
        if (dataLevel1 != null) {
          let fractionCode =
            this.selectLevel1.filter((x: any) => x.id === dataLevel1)[0]
              .fractionCode ?? '';
          this.getUnidMeasure(fractionCode);
          this.setFractionId(dataLevel1, fractionCode, 'Nivel 1');

          const relativeTypeId = this.getRelevantTypeId(
            this.selectLevel1,
            dataLevel1
          );
          this.setRelevantTypeId(relativeTypeId);
          if (this.advSearch === false) {
            this.getLevel2(new ListParams(), dataLevel1);
            /* this.classiGoodsForm.controls['ligieLevel2'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
            this.classiGoodsForm.controls['goodTypeId'].setValue(null); */
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel2'].valueChanges.subscribe(
      (dataLevel2: any) => {
        //this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
        if (dataLevel2 != null) {
          let fractionCode = this.selectLevel2.filter(
            (x: any) => x.id === dataLevel2
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);

          const relativeTypeId = this.getRelevantTypeId(
            this.selectLevel2,
            dataLevel2
          );
          this.setRelevantTypeId(relativeTypeId);
          this.setFractionId(dataLevel2, fractionCode, 'Nivel 2');

          if (this.advSearch === false) {
            this.getLevel3(new ListParams(), dataLevel2);
            /* this.classiGoodsForm.controls['ligieLevel3'].setValue(null);
            this.classiGoodsForm.controls['ligieLevel4'].setValue(null); */
          }
        }
      }
    );
    this.classiGoodsForm.controls['ligieLevel3'].valueChanges.subscribe(
      (dataLevel3: any) => {
        //this.classiGoodsForm.controls['ligieLevel4'].setValue(null);
        if (dataLevel3 != null) {
          let fractionCode = this.selectLevel3.filter(
            (x: any) => x.id === dataLevel3
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);
          this.setFractionId(dataLevel3, fractionCode, 'Nivel 3');

          const relevantTypeId = this.getRelevantTypeId(
            this.selectLevel3,
            dataLevel3
          );
          this.setRelevantTypeId(relevantTypeId);
          //this.getRelevantTypeId(this.selectLevel3.data, dataLevel3);

          if (this.advSearch === false) {
            this.getLevel4(new ListParams(), dataLevel3);
            /* this.classiGoodsForm.controls['ligieLevel4'].setValue(null); */
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

          let fractionCode = this.selectLevel4.filter(
            (x: any) => x.id === dataLevel4
          )[0].fractionCode;
          this.getUnidMeasure(fractionCode);
          this.setFractionId(dataLevel4, fractionCode, 'Nivel 4');
        }
      }
    );
  }

  getRelevantTypeId(arrayData: any, id: number): any {
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
      if (fractionCode.length >= 8) {
        this.classiGoodsForm.controls['fractionId'].setValue(
          Number(fractionId)
        );
      }
    } /* else {
      this.message(
        'info',
        'Fraccion Nula',
        `La fracción del campo ${campo} no tiene un codigo`
      );
    } */
  }

  //obtenien la unidad de medida
  getUnidMeasure(value: string) {
    if (value) {
      if (value.length === 8) {
        const fractionCode = { fraction: value };
        this.goodsQueryService
          .getUnitLigie(fractionCode)
          .subscribe((data: any) => {
            //guarda el no_clasify_good
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
          });
      }
    }
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  refreshTable(refresh: boolean) {
    this.requestHelperService.isComponentSaving(refresh);
  }
}
