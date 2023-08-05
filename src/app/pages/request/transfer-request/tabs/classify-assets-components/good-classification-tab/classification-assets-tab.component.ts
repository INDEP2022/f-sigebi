import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IFormGroup } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REQUEST_OF_ASSETS_COLUMNS } from '../classification-assets.columns';

@Component({
  selector: 'app-classification-assets-tab',
  templateUrl: './classification-assets-tab.component.html',
  styleUrls: ['./classification-assets-tab.component.scss'],
})
export class ClassificationAssetsTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() dataObject: any;
  @Input() requestObject: any;
  @Input() typeDoc: any = '';
  @Input() process: string = '';

  idRequest: number = 0;
  request: any;
  title: string = 'Bienes de la Solicitud';
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsFraction = new BehaviorSubject<ListParams>(new ListParams());
  paramsChapter = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl1 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl2 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl3 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl4 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs = new LocalDataSource();
  assetsId: string | number;
  detailArray: IFormGroup<IGood>;
  goodObject: any;
  domicilieObject: any;
  totalItems: number = 0;
  idFraction: number = 0;
  classiGoodsForm: FormGroup = new FormGroup({});
  goodsForm: FormGroup = new FormGroup({}); // ModelForm<any>; //: FormGroup = new FormGroup({});
  ligiesSection = new DefaultSelect();
  chapters = new DefaultSelect();
  levels1 = new DefaultSelect();
  levels2 = new DefaultSelect();
  levels3 = new DefaultSelect();
  clarificationData: any = [];
  levels4 = new DefaultSelect();
  goodSelect: any = [];
  idGood: string | number;
  formLoading: boolean = false;
  settingsGood = { ...TABLE_SETTINGS, actions: false };
  columns = REQUEST_OF_ASSETS_COLUMNS;
  isGoodSelected: boolean = false;
  goodForClarifi: IGood[] = [];
  typeTransfer: string = '';
  goodSaeModified: any = [];

  constructor(
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private goodTypeService: GoodTypeService,
    private fb: FormBuilder,
    private fractionService: FractionService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private typeRelevantSevice: TypeRelevantService,
    private genericService: GenericService,
    private goodDomicilieService: GoodDomiciliesService,
    private goodsQueryService: GoodsQueryService,
    private goodFinderService: GoodFinderService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    console.log('Activando tab: classification-assets-tab');
    this.showHideErrorInterceptorService.showHideError(false);
    this.prepareForm();
    this.tablePaginator();
    this.settingsGood.columns = REQUEST_OF_ASSETS_COLUMNS;
    /*this.columns.select = {
      ...this.columns.select,
      onComponentInitFunction: this.selectGood.bind(this),
    };*/
    this.columns.descriptionGoodSae = {
      ...this.columns.descriptionGoodSae,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setDescriptionGoodSae(data);
        });
      },
    };

    this.initForm();
    this.request = this.requestObject.getRawValue();
    this.typeTransfer = this.request.typeOfTransfer;
  }

  prepareForm() {
    this.classiGoodsForm = this.fb.group({
      ligieSection: [null],
      chapter: [null],
      level1: [null],
      level2: [null],
      level3: [null],
      level4: [null],
    });
  }

  showGoods() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requestObject'].currentValue) {
      this.tablePaginator();
    }
  }

  tablePaginator() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    this.params.value.addFilter('requestId', this.idRequest);
    this.params.value.addFilter(
      'processStatus',
      'CLASIFICAR_BIEN,SOLICITAR_ACLARACION',
      SearchFilter.IN
    );
    const filter = this.params.getValue().getParams();
    this.goodFinderService.goodFinder(filter).subscribe({
      next: async (resp: any) => {
        this.totalItems = resp.count;
        this.paragraphs.load(resp.data);
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
        this.onLoadToast('error', 'No se encontraron registros', '');
      },
    });
  }

  getTypeGood(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.typeRelevantSevice.getById(id).subscribe({
          next: resp => {
            resolve(resp.description);
          },
        });
      } else {
        resolve(null);
      }
    });
  }

  updateTableInfo(event: any) {
    this.paragraphs.getElements().then(data => {
      data.map((item: any) => {
        if (item.id === event.id) {
          for (const key in event) {
            if (key != 'id') {
              item[key] = event[key];
            }
          }
        }
        this.paragraphs.load(data);
      });
    });
    this.goodObject = null;
  }

  selectGood(event: any) {
    /* event.toggle.subscribe((data: any) => { */
    /*const index = this.goodSelect.indexOf(data.row);
      if (index == -1 && data.toggle == true) {
        this.goodSelect.push(data.row);
      } else if (index != -1 && data.toggle == false) {
        this.goodSelect.splice(index, 1);
      }*/
    //this.typeDoc = '';
    this.goodSelect = [];
    //this.goodObject = null;
    this.goodSelect.push(event);

    this.formLoading = true;
    this.detailArray.reset();
    this.goodObject = this.goodSelect[0];
    this.goodForClarifi = this.goodSelect;
    this.assetsId = this.goodSelect[0] ? this.goodSelect[0].id : null;
    if (this.goodSelect.length === 1) {
      setTimeout(async () => {
        this.goodSelect[0].quantity = Number(this.goodSelect[0].quantity);
        this.detailArray.patchValue(this.goodSelect[0] as IGood);
        this.domicilieObject = await this.getDomicilieGood(
          this.goodSelect[0].addressId
        );
        if (this.detailArray.controls['id'].value !== null) {
          this.isGoodSelected = true;
        }
        //this.typeDoc = 'classify-assets';
        this.formLoading = false;
      }, 1000);
    } else if (this.goodSelect.length > 1) {
      // this.goodSelect[0].quantity = 0;
      this.detailArray.patchValue(null);
      this.domicilieObject = null;
      this.formLoading = false;
      this.goodForClarifi = [];
      this.onLoadToast('error', 'Solo se puede seleccionar un bien', '');
    } else {
      this.detailArray.patchValue(null);
      this.domicilieObject = null;
      this.formLoading = false;
      this.goodForClarifi = [];
    }
    /*  }); */
  }

  getDomicilieGood(id: number) {
    return new Promise((resolve, reject) => {
      this.goodDomicilieService.getById(id).subscribe({
        next: resp => {
          resolve(resp as IDomicilies);
        },
      });
    });
  }

  updateTableEvent(event: any) {
    this.goodSelect = [];
    this.getData();
    /*this.paragraphs.getElements().then((data: any) => {
      data.map(async (item: any) => {
        if (item.id === event.id) {
          item.ligieSection = event.ligiesSection;
          item.ligieChapter = event.ligieChapter;
          item.ligieLevel1 = event.ligieLevel1;
          item.ligieLevel2 = event.ligieLevel2;
          item.ligieLevel3 = event.ligieLevel3;
          item.ligieLevel4 = event.ligieLevel4;
          item.fractionId = event.fractionId;
          item.fractionCode = event.fractionCode;
          item.ligieUnit = event.ligieUnit;
          item.goodTypeId = event.goodTypeId;
          item.goodClassNumber = event.goodClassNumber;
          const goodTypeName = await this.getTypeGood(item.goodTypeId);
          item['goodTypeName'] = goodTypeName;
        }
      });
      this.paragraphs.load(data);
    });*/
  }

  updateStatusGood(event: any) {
    this.paragraphs.getElements().then((data: any) => {
      data.map(async (item: any) => {
        if (item.id === this.goodObject.id) {
          item.processStatus = event.processStatus;
          item.goodStatus = event.goodStatus;
        }
      });
      this.paragraphs.load(data);
    });
  }

  initForm() {
    this.detailArray = this.fb.group({
      id: [null],
      goodId: [null],
      ligieSection: [null],
      ligieChapter: [null],
      ligieLevel1: [null],
      ligieLevel2: [null],
      ligieLevel3: [null],
      ligieLevel4: [null],
      requestId: [null],
      goodTypeId: [null],
      goodTypeName: [null],
      color: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      goodDescription: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      quantity: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(13),
        ],
      ],
      duplicity: [
        null,
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      physicalStatus: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      stateConservation: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      stateConservationName: [null],
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
      destiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]], //preguntar Destino ligie
      destinyName: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]], //preguntar Destino ligie
      transferentDestiny: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      compliesNorm: [
        null,
        [Validators.pattern(STRING_PATTERN), , Validators.maxLength(1)],
      ],
      notesTransferringEntity: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      unitMeasure: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ], // preguntar Unidad Medida Transferente
      saeDestiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
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
          Validators.maxLength(350),
        ],
      ],
      armor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      model: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
          Validators.maxLength(100),
        ],
      ],
      chassis: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      cabin: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      fitCircular: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      theftReport: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      addressId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
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
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(5),
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
          Validators.maxLength(80),
        ],
      ],
      shipName: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ], //kilatage
      material: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      weight: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      physicstateName: [null],
      descriptionGoodSae: [null],
      type: [null],
      requestFolio: [null],
      uniqueKey: [null],
      description: [null],
      fileNumber: [null],
      fractionId: [null],
      saeMeasureUnit: [null],
    });
  }

  selectRow(row?: any) {
    console.log('Información de la fila seleccionada, ', row);
  }

  setDescriptionGoodSae(descriptionInput: any) {
    this.paragraphs['data'].map((item: any) => {
      if (item.id === descriptionInput.data.id) {
        item.descriptionGoodSae = descriptionInput.text;

        this.addGoodModified(item);
      }
    });
  }

  addGoodModified(good: any) {
    const index = this.goodSaeModified.indexOf(good);
    if (index != -1) {
      this.goodSaeModified[index] = good;
      if (this.goodSaeModified[index].descriptionGoodSae == '') {
        this.goodSaeModified[index].descriptionGoodSae = null;
      }
    } else {
      this.goodSaeModified.push(good);
    }
  }

  saveGoodSaeDescrip() {
    if (this.goodSaeModified.length == 0) {
      return;
    }
    this.loading = true;
    this.goodSaeModified.map(async (item: any, _i: number) => {
      const index = _i + 1;
      const body: any = {
        id: item.id,
        goodId: item.goodId,
        descriptionGoodSae: item.descriptionGoodSae,
      };
      const updateResult: any = await this.updateGood(body);
      if (this.goodSaeModified.length == index) {
        this.loading = false;
        this.goodSaeModified = [];
        this.onLoadToast('success', 'Bienes actualizados');
      }
    });
  }

  updateGood(good: any) {
    return new Promise((resolve, reject) => {
      this.goodService.update(good).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loading = false;
          this.onLoadToast(
            'error',
            'Ocurrio un problema al actualizar el bien',
            `${error.message}`
          );
          reject('Ocurrio un problema al actualizar el bien');
        },
      });
    });
  }
}
