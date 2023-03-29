import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IGood } from 'src/app/core/models/good/good.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REQUEST_OF_ASSETS_COLUMNS } from '../classification-assets.columns';

@Component({
  selector: 'app-classification-assets-tab',
  templateUrl: './classification-assets-tab.component.html',
  styles: [],
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
  title: string = 'Bienes de la Solicitud';
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsFraction = new BehaviorSubject<ListParams>(new ListParams());
  paramsChapter = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl1 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl2 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl3 = new BehaviorSubject<ListParams>(new ListParams());
  paramsLvl4 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  assetsId: string | number;
  detailArray: any;
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
  levels4 = new DefaultSelect();
  goodSelect: IGood;
  idGood: string | number;
  constructor(
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private goodTypeService: GoodTypeService,
    private fb: FormBuilder,
    private fractionService: FractionService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private typeRelevantSevice: TypeRelevantService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.showHideErrorInterceptorService.showHideError(false);
    this.prepareForm();
    this.tablePaginator();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: REQUEST_OF_ASSETS_COLUMNS,
    };
    this.initForm();
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
    console.log('data', this.dataObject);
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
    if (this.idRequest) {
      this.loading = true;
      this.params.getValue()['filter.requestId'] = this.idRequest;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          this.showHideErrorInterceptorService.showHideError(false);
          const info = data.data.map(items => {
            const fraction: any = items.fractionId;
            this.idFraction = fraction.code;
            items.fractionId = fraction.description;
            return items;
          });

          const filtergoodType = info.map(async item => {
            const goodType: any = await this.getGoodType(item.goodTypeId);
            item['goodTypeId'] = goodType;
            if (item['physicalStatus'] == 1) item['physicalStatus'] = 'BUENO';
            if (item['physicalStatus'] == 2) item['physicalStatus'] = 'MALO';
            if (item['stateConservation'] == 1)
              item['stateConservation'] = 'BUENO';
            if (item['stateConservation'] == 2)
              item['stateConservation'] = 'MALO';
            if (item['destiny'] == 1) item['destiny'] = 'VENTA';
            return item;
          });

          Promise.all(filtergoodType).then(data => {
            this.paragraphs = data;
            this.totalItems = this.paragraphs.length;
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }

  getGoodType(goodTypeId: string | number) {
    this.showHideErrorInterceptorService.showHideError(false);
    return new Promise((resolve, reject) => {
      this.typeRelevantSevice.getById(goodTypeId).subscribe(data => {
        resolve(data.description);
      });
    });
  }

  rowSelected(good: IGood) {
    this.typeDoc = 'assets';
    this.requestObject = this.requestObject;
    this.goodObject = good;
    this.assetsId = good.id;
    this.domicilieObject = good.addressId;
    this.idGood = good.id;
    this.goodService.getById(good.id).subscribe((data: any) => {
      this.goodsForm.patchValue(data);
      this.detailArray = this.goodsForm;
    });
  }

  initForm() {
    this.goodsForm = this.fb.group({
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
      color: [null],
      goodDescription: [null],
      quantity: [1, [Validators.required]],
      duplicity: ['N'],
      capacity: [null, [Validators.pattern(STRING_PATTERN)]],
      volume: [null, [Validators.pattern(STRING_PATTERN)]],
      fileeNumber: [null],
      useType: [null, [Validators.pattern(STRING_PATTERN)]],
      physicalStatus: [null],
      stateConservation: [null],
      origin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      goodClassNumber: [null],
      ligieUnit: [null],
      appraisal: [null],
      destiny: [null], //preguntar Destino ligie
      transferentDestiny: [null],
      compliesNorm: ['N'], //cumple norma
      notesTransferringEntity: [null, [Validators.pattern(STRING_PATTERN)]],
      unitMeasure: [null], // preguntar Unidad Medida Transferente
      saeDestiny: [null],
      brand: [null, [Validators.required]],
      subBrand: [null, [Validators.required]],
      armor: [null],
      model: [null, [Validators.required]],
      doorsNumber: [null],
      axesNumber: [null, [Validators.required]],
      engineNumber: [null, [Validators.required]], //numero motor
      tuition: [null, [Validators.required]],
      serie: [null, [Validators.required]],
      chassis: [null],
      cabin: [null],
      fitCircular: ['N', [Validators.required]],
      theftReport: ['N', [Validators.required]],
      addressId: [null],
      operationalState: [null, [Validators.required]],
      manufacturingYear: [null, [Validators.required]],
      enginesNumber: [null, [Validators.required]], // numero de motores
      flag: [null, [Validators.required]],
      openwork: [null, [Validators.required]],
      sleeve: [null],
      length: [null, [Validators.required]],
      shipName: [null, [Validators.required]],
      publicRegistry: [null, [Validators.required]], //registro public
      ships: [null],
      dgacRegistry: [null, [Validators.required]], //registro direccion gral de aereonautica civil
      airplaneType: [null, [Validators.required]],
      caratage: [null, [Validators.required]], //kilatage
      material: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      fractionId: [null],
    });
  }
}
