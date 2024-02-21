import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { LIST_ASSETS_COLUMNS } from './list-assets-columns';

const defaultData = [
  {
    id: 0,
    noManagement: '',
    descripTransfeAsset: '',
    typeAsset: '',
    physicalState: '',
    conservationState: '',
    tansferUnitMeasure: '',
    transferAmount: '',
    destinyLigie: '',
    destinyTransfer: '',
    householdAsset: '',
  },
];
@Component({
  selector: 'app-approval-assets-tabs',
  templateUrl: './approval-assets-tabs.component.html',
  styles: [],
})
export class ApprovalAssetsTabsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() dataObject: string;
  @Input() process: string;
  @Input() requestObject: any;
  //bsModalRef: BsModalRef;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: any[] = [];
  totalItems: number = 0;
  goodForm: ModelForm<IGood>;
  domicilieObject: any;
  typeDoc: string = 'approval-process';
  open: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.requestObject);
  }

  constructor(
    private readonly goodService: GoodService,
    private readonly genericService: GenericService,
    private readonly menageService: MenageService,
    private readonly typeRelevantSevice: TypeRelevantService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly goodDomicilieService: GoodDomiciliesService,
    private readonly goodFinderService: GoodFinderService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Activando tab: approval-assets-tabs');
    this.prepareForm();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_ASSETS_COLUMNS,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  private prepareForm() {
    this.goodForm = this.fb.group({
      id: [null],
      goodId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieSection: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieChapter: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel1: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel2: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel3: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel4: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      requestId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(13),
        ],
      ],
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
      physicalStatus: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      stateConservation: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      origin: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
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
      transferentDestiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      compliesNorm: [
        'N',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ], //cumple norma
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
          Validators.maxLength(300),
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
          Validators.maxLength(300),
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
      addressId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
  }

  getData(): void {
    this.loading = true;
    this.paragraphs = [];
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.params.value.addFilter('requestId', requestId);
    this.params.value.addFilter('processStatus', 'SOLICITAR_APROBACION');

    this.goodFinderService
      .goodFinder(this.params.getValue().getParams())
      .subscribe({
        next: async (resp: any) => {
          const result = resp.data.map(async (item: any) => {
            const goodMenaje = await this.getMenaje(item.id);
            item['goodMenaje'] = goodMenaje;
          });

          Promise.all(result).then(x => {
            this.totalItems = resp.count;
            this.paragraphs = resp.data;
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se encontraron registros', '');
          console.log('no se encontraron registros del bien ', error);
        },
      });
  }

  getMenaje(id: number) {
    return new Promise((resolve, reject) => {
      this.menageService.getById(id).subscribe({
        next: (resp: any) => {
          if (resp) {
            resolve(resp['noGood']);
          } else {
            resolve('');
          }
        },
        error: error => {
          resolve('');
        },
      });
    });
  }

  getDomicilieGood(id: number) {
    return new Promise((resolve, reject) => {
      this.goodDomicilieService.getById(id).subscribe({
        next: resp => {
          this.domicilieObject = resp as IDomicilies;
          resolve(true);
        },
        error: error => {
          resolve(false);
          this.onLoadToast(
            'error',
            'Error en domicilio',
            'No se encontro un domicilio de bien'
          );
        },
      });
    });
  }

  async selectRow(event: any) {
    this.open = false;
    if (event.isSelected === true) {
      const domicileResp = await this.getDomicilieGood(event.data.addressId);
      this.goodForm.patchValue(event.data);
      if (domicileResp === true) {
        this.open = true;
      }
    }
  }
}
