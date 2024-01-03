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
import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAddress } from 'src/app/core/models/administrative-processes/siab-sami-interaction/address.model';
import {
  IDomicilies,
  IGood,
  IGoodRealState,
  IGoodTable,
} from 'src/app/core/models/good/good.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ParameterSubBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-sub-brands.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  DOUBLE_POSITIVE_PATTERN,
  NUMBERS_PATTERN,
  NUMBERS_POINT_PATTERN,
  NUM_POSITIVE_LETTERS,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CharacteristicGoodCellComponent } from 'src/app/pages/administrative-processes/change-of-good-classification/change-of-good-classification/characteristicGoodCell/characteristic-good-cell.component';
import { ATRIBUT_ACT_COLUMNS } from 'src/app/pages/administrative-processes/change-of-good-classification/change-of-good-classification/columns';
import { ChangeOfGoodCharacteristicService } from 'src/app/pages/administrative-processes/change-of-good-classification/services/change-of-good-classification.service';
import { getClassColour } from 'src/app/pages/general-processes/goods-characteristics/goods-characteristics/good-table-vals/good-table-vals.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { MenajeComponent } from '../../transfer-request/tabs/records-of-request-components/records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from '../../transfer-request/tabs/records-of-request-components/records-of-request-child-tabs-components/select-address/select-address.component';
@Component({
  selector: 'app-detail-assets-tab-component',
  templateUrl: './detail-assets-tab-component.component.html',
  styleUrls: ['./detail-assets-tab-component.component.scss'],
})
export class DetailAssetsTabComponentComponent
  extends BasePage
  implements OnInit, OnChanges
{
  // private _detailAssets: ModelForm<any>;
  //usado para cargar los adatos de los bienes en el caso de cumplimientos de bienes y clasificacion de bienes
  @Input() requestObject: any; //solicitud
  @Input() assetsId: any; //id del bien
  @Input() detailAssets: ModelForm<any>;
  @Input() domicilieObject: IDomicilies; // domicilio del bien
  @Input() typeDoc: any;
  @Input() process: string = '';
  @Input() childSaveAction: boolean = false;
  @Output() sendDetailInfoEvent?: EventEmitter<any> = new EventEmitter();
  @Output() sendDomicileSelectedEvent?: EventEmitter<any> = new EventEmitter();

  goodData: IGood;
  bsModalRef: BsModalRef;
  request: IRequest;
  stateOfRepId: number = null;
  municipalityId: number | string = null;
  combineMunicipalityId = true;
  localityKey: number | string = null;
  combineLocalityId = true;
  code: string = '0';
  combineCode = true;
  relevantTypeName: string;
  goodDomicilieForm: ModelForm<IGoodRealState>; // bien inmueble
  domicileForm: ModelForm<IDomicilies>; //domicilio del bien
  assetsForm: ModelForm<any>; //borrar

  selectSae = new DefaultSelect<any>();
  selectConservationState = new DefaultSelect<any>();
  goodTypeName: string = '';
  nameTypeRelevant: string = '';
  duplicity: boolean = false;
  duplicityString: string = 'N';
  armor: boolean = false;
  destinyLigie: string = '';
  addressId: number = null;
  bsEvaluoDate: any;
  bsCertifiDate: any;
  bsPffDate: any;
  brandId: string = '';
  circulate: boolean = false;
  circulateString: string = 'N';
  theftReport: boolean = false;
  theftReportString: string = 'N';
  complyNorm: boolean = false;
  complyNormString: string = 'N';
  appraisal: boolean = false;
  appraisalString = 'N';
  nameGoodType: string = '';
  //tipo de bien seleccionado
  otherAssets: boolean = false;
  carsAssets: boolean = false;
  boatAssets: boolean = false;
  jewelerAssets: boolean = false;
  aircraftAssets: boolean = false;
  especialMachineryAssets: boolean = false;
  mineralsAssets: boolean = false;
  immovablesAssets: boolean = false;
  manejeAssets: boolean = false; //diverso
  foodAndDrink: boolean = false; //diverso

  //selectores
  selectQuantityTransfer = new DefaultSelect<any>();
  selectPhysicalState = new DefaultSelect<any>();
  selectConcervationState = new DefaultSelect<any>();
  selectDestinyTransfer = new DefaultSelect<any>();
  selectTansferUnitMeasure = new DefaultSelect<any>();
  selectDestintSae = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectMunicipe = new DefaultSelect<any>();
  selectLocality = new DefaultSelect<any>();
  selectCP = new DefaultSelect<any>();
  selectBrand = new DefaultSelect<any>();
  selectSubBrand = new DefaultSelect<any>();
  selectTypeUseBoat = new DefaultSelect<any>();
  selectTypeAirplane = new DefaultSelect<any>();
  selectTypeUseAirCrafte = new DefaultSelect<any>();

  atributActSettings: any;
  atributNewSettings: any;
  initValue = false;
  goodChange = 0;
  goodChange2 = 0;
  classificationNumber: number = null;

  service = inject(ChangeOfGoodCharacteristicService);

  router = inject(ActivatedRoute);
  typeRelevantSevice = inject(TypeRelevantService);
  genericService = inject(GenericService);
  requestService = inject(RequestService);
  stateOfRepublicService = inject(StateOfRepublicService);
  municipeSeraService = inject(MunicipalityService);
  localityService = inject(LocalityService);
  goodsQueryService = inject(GoodsQueryService);
  goodDomicilie = inject(GoodDomiciliesService);
  goodEstateService = inject(RealStateService);
  requestHelperService = inject(RequestHelperService);
  authService = inject(AuthService);
  parameterBrandsService = inject(ParameterBrandsService);
  parameterSubBrandsService = inject(ParameterSubBrandsService);
  menageService = inject(MenageService);
  goodsInvService = inject(GoodsInvService);

  isDisabled: boolean = true; //desabilita el campo domicilio
  menajeSelected: any;
  isSaveMenaje: boolean = false;
  disableDuplicity: boolean = false; //para verificar cumplimientos = false
  isGoodInfReadOnly: boolean = false;
  isGoodTypeReadOnly: boolean = false;
  ligieUnit: string = '';
  typeOfRequest: string = '';
  detailAssetsInfo: any;
  subBrand: string = null;
  @Output() saveDetailInfo: EventEmitter<any> = new EventEmitter();
  unit: string = null;

  dataToSend: any = {};

  constructor(
    private fb: FormBuilder,
    private modalServise: BsModalService,
    private goodService: GoodService,
    private goodTypeService: GoodTypeService,
    private relevantTypeService: TypeRelevantService,
    private goodDomicilieService: GoodDomiciliesService,
    private goodProcessService: GoodProcessService,
    private strategyService: StrategyServiceService //private goodService2: GoodService2,
  ) {
    super();
    this.atributActSettings = {
      ...this.settings,
      actions: null,
      hideSubHeader: false,
      columns: { ...ATRIBUT_ACT_COLUMNS },
    };
  }

  getDomicilieGood(id: number) {
    this.goodDomicilieService.getById(id).subscribe({
      next: resp => {
        this.domicilieObject = resp as IDomicilies;
        this.setGoodDomicilieSelected(this.domicilieObject);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const address: IAddress = this.detailAssets.controls['addressId'].value;

    for (const campo in this.detailAssets.controls) {
      if (this.detailAssets.controls.hasOwnProperty(campo)) {
        const control = this.detailAssets.get(campo);
        if (control.value === undefined || control.value === 'undefined') {
          this.detailAssets.get(campo).setValue(null);
        }
      }
    }
    this.typeOfRequest = this.requestObject.typeOfTransfer
      ? this.requestObject.typeOfTransfer
      : this.requestObject.controls['typeOfTransfer'].value;
    if (this.process == 'validate-document') {
      this.getDomicilieGood(
        parseInt(this.detailAssets.controls['addressId'].value)
      );
    }
    if (this.process == 'classify-assets') {
      this.initForm();
      if (this.domicilieObject) {
        this.setGoodDomicilieSelected(this.domicilieObject);
      }
      // this.goodData = this.detailAssets.value;

      if (this.detailAssets.controls['subBrand'].value) {
        const brand = this.detailAssets.controls['brand'].value;

        this.brandId = brand;
        this.getSubBrand(new ListParams(), brand);
      }
      /*if (this.typeOfRequest == 'MANUAL') {
        this.isGoodTypeReadOnly = false;
      } else {
        this.isGoodTypeReadOnly = true;
      }*/
    }

    if (this.typeDoc === 'clarification') {
      if (this.detailAssets.controls['subBrand'].value) {
        const brand = this.detailAssets.controls['brand'].value;
        this.brandId = brand;
        this.getSubBrand(new ListParams(), brand);
      }
    }
    //verifica si la vista es verificacion de cumplimiento o bien
    if (
      this.typeDoc === 'verify-compliance' ||
      this.typeDoc === 'assets' ||
      this.typeDoc === 'approval-process' ||
      this.typeDoc === 'classify-assets' ||
      this.typeDoc === 'clarification'
    ) {
      if (address?.id) {
        this.getGoodDomicilie(address?.id);
      }
      //verifica si la vista es verificacion de cumplimiento
      if (this.typeDoc === 'verify-compliance') {
        this.detailAssets.disable();
        this.disableDuplicity = true;
        if (this.goodDomicilieForm !== undefined) {
          this.goodDomicilieForm.disable();
        }
      }

      if (this.typeDoc === 'clarification') {
        this.isGoodInfReadOnly = true;
        this.disableDuplicity = true;
        this.isGoodTypeReadOnly = true;
      }

      if (this.typeDoc === 'approval-process') {
        this.isGoodInfReadOnly = true;
        this.isGoodTypeReadOnly = true;
        this.disableDuplicity = true;
      }

      /*if (this.detailAssets.controls['subBrand'].value) {
        const brand = this.detailAssets.controls['brand'].value;
        this.brandId = brand;
        this.subBrand = this.detailAssets.controls['subBrand'].value;
        this.getSubBrand(
          new ListParams(),
          brand,
          this.subBrand
        );
      }*/
    }
    if (this.detailAssets.controls['brand'].value) {
      this.getBrand(
        new ListParams(),
        this.detailAssets.controls['brand'].value
      );
    }

    //verifica si la vista es verificacion de cumplimiento o bien
    if (this.typeDoc === 'verify-compliance' || this.typeDoc === 'assets') {
      if (this.detailAssets.controls['addressId'].value) {
        this.addressId = this.detailAssets.controls['addressId'].value;

        this.getGoodDomicilie(this.addressId);
      }

      //verifica si la vista es verificacion de cumplimiento
      if (this.typeDoc === 'verify-compliance') {
        this.detailAssets.disable();
        this.disableDuplicity = true;
        if (this.goodDomicilieForm !== undefined) {
          this.goodDomicilieForm.disable();
        }
        this.isGoodInfReadOnly = true;
        this.isGoodTypeReadOnly = true;
      }
    }

    //revisa si el formulario de bienes contiene el id del tipo de bien
    if (
      this.detailAssets.controls['goodTypeId'].value != null &&
      this.childSaveAction === false
    ) {
      const data = this.detailAssets.controls['goodTypeId'].value;
      this.getTypeGood(this.detailAssets.controls['goodTypeId'].value);
      this.displayTypeTapInformation(Number(data));
    }

    /*if (this.detailAssets.controls['subBrand'].value) {
      const brand = this.detailAssets.controls['brand'].value;
      this.brandId = brand;
      this.getSubBrand(new ListParams(), brand);
    }*/

    if (this.detailAssets.controls['destiny'].value) {
      var destiny = this.detailAssets.controls['destiny'].value;
      if (destiny) {
        this.getDestiny(destiny);
      }
    }

    if (this.childSaveAction === true) {
      this.save();
    }
  }

  goodType(goodTypeId: number) {
    this.typeRelevantSevice
      .getById(goodTypeId)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.nameGoodType = response.description;
        },
        error: error => {},
      });
  }

  typeRelevant(typeRelevantId: number) {
    this.typeRelevantSevice
      .getById(typeRelevantId)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.nameTypeRelevant = data.description;
        },
        error: error => {},
      });
  }

  ngOnInit(): void {
    this.detailAssetsInfo = this.detailAssets.value;
    this.classificationNumber = +this.detailAssetsInfo?.goodClassNumber;
    //Cambiar la forma de traer el clasificador
    //Selecciono la fracción
    //Espero unos segundos
    //Se guarda en automatico
    //Obtener el clasificador
    this.initForm();
    this.getDestinyTransfer(new ListParams(), this.detailAssetsInfo.requestId);
    this.getPhysicalState(new ListParams());
    this.getConcervationState(new ListParams());
    //this.getTransferentUnit(new ListParams());
    this.getReactiveFormCall();

    /**
     * Se inicializa el value de la tabla
     */
    if (this.detailAssetsInfo != undefined) {
      this.initValue = true;
      setTimeout(() => {
        this.goodChange2++;
      }, 2000);
    }

    if (
      this.requestObject != undefined &&
      this.detailAssets.controls['addressId'].value === null
    ) {
      this.domicileForm.controls['requestId'].setValue(this.requestObject.id);
    }

    if (this.detailAssets.controls['brand'].value == null) {
      this.getBrand(new ListParams());
    }

    /**
     * Se settea las columnas de la tabla Val
     */
    this.atributNewSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: {
        ...ATRIBUT_ACT_COLUMNS,
        value: {
          ...ATRIBUT_ACT_COLUMNS.value,
          type: 'custom',
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: row, good: this.detailAssetsInfo };
          },
          renderComponent: CharacteristicGoodCellComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data, false) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };
  }

  initForm() {
    this.domicileForm = this.fb.group({
      id: [null],
      warehouseAlias: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      wayref2Key: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      wayref3Key: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      statusKey: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      municipalityKey: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      localityKey: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      code: ['', [Validators.pattern(STRING_PATTERN), Validators.maxLength(6)]],
      latitude: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      length: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      wayName: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      wayOrigin: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      exteriorNumber: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      interiorNumber: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayDestiny: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      wayref1Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      wayChaining: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      description: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      regionalDelegationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      requestId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
  }

  getGoodEstateTab() {
    this.goodDomicilieForm = this.fb.group({
      id: [null],
      description: [null],
      propertyType: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      surfaceMts: [
        0,
        [Validators.required, Validators.pattern(DOUBLE_POSITIVE_PATTERN)],
      ],
      consSurfaceMts: [
        0,
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(DOUBLE_POSITIVE_PATTERN),
        ],
      ],
      publicDeed: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      pubRegProperty: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      appraisalValue: [
        0,
        [
          Validators.required,
          Validators.pattern(DOUBLE_POSITIVE_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      appraisalDate: [null, [Validators.required]],
      certLibLien: [null, [Validators.pattern(STRING_PATTERN)]],
      guardCustody: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      vigilanceRequired: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      vigilanceLevel: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      mtsOfiWarehouse: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.maxLength(40)],
      ],
      bedrooms: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      bathroom: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      kitchen: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      diningRoom: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      livingRoom: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      study: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      espPark: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(40)],
      ],
      userCreation: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      creationDate: [null],
      addressId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      userModification: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      modificationDate: [null],
      forProblems: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      certLibLienDate: [null],
      pffDate: [null],
      gravFavorThird: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(40)],
      ],
      attachment: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      embFavorThird: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(40)],
      ],
      coOwnership: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      ownershipPercentage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      decreeExproProc: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      decreeExproSupe: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      declareRemediation: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      heritage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      assurance: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      propTitleFolio: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      measuresAdjacent: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      vouchersWater: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      debts: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      physicalPossession: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      closed: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      familyHeritage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      problemDesc: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      photosAttached: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      echoForecast: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      echoForecastPercentage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      status: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      lien: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      gravPleaseTrans: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      //val25: [null],
    });

    /* METODO QUE CAMBIA LOS CAMPOS DEL DOMICILIO A REQUERIDOS
    ========================================================== */
    this.setDomiciliesFieldRequired();
  }

  setDomiciliesFieldRequired() {
    const transferent = this.requestObject.transferenceId;

    /*if (this.typeOfRequest === 'MANUAL') {
      this.goodDomicilieForm.controls['pffDate'].setValidators([
        Validators.required,
      ]);
    }*/
    if (transferent == 120 || transferent == 752 || transferent == 942) {
      this.goodDomicilieForm.controls['pffDate'].setValidators([
        Validators.required,
      ]);
    }

    this.goodDomicilieForm.updateValueAndValidity();
  }

  getPhysicalState(params: ListParams) {
    params['filter.name'] = '$eq:Estado Fisico';
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.selectPhysicalState = new DefaultSelect(data.data, data.count);
        },
      });
  }

  getConcervationState(params: ListParams) {
    params['filter.name'] = '$eq:Estado Conservacion';
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.selectConcervationState = new DefaultSelect(
            data.data,
            data.count
          );
        },
      });
  }

  getDestinyTransfer(params: ListParams, idSolicitud?: string | number) {
    /*let params2 = new ListParams();
    params['filter.requestId'] = `$eq:${idSolicitud}`;

    this.goodService.getAll(params2).subscribe({
      next: (resp: any) => {
        this.dataToSend.id = resp.id;
        this.saveDetailInfo.emit(this.dataToSend);
        this.onLoadToast('success', 'Actualizado', 'Formulario actualizado');
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          `El formulario no se puede actualizar ${error.error.message}`
        );
        // this.onLoadToast(
        //   'error',
        //   'Error',
        //   `El formulario no se puede actualizar ${error.error.message}`
        // );
      },
    });*/

    params['filter.name'] = '$eq:Destino';
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.selectDestinyTransfer = new DefaultSelect(data.data, data.count);

          //OBTENER TIPO DE SOLICITUD
          /*this.requestService.getById(idSolicitud).subscribe({
            next: res => {*/
          const transferente = this.typeOfRequest;

          switch (transferente) {
            case 'SAT_SAE':
              if (
                this.detailAssets.controls['transferentDestiny'].value === null
              ) {
                this.detailAssets.controls['transferentDestiny'].setValue('1');
              } else {
                const destinyTransf =
                  this.detailAssets.controls['transferentDestiny'].value;
                this.detailAssets.controls['transferentDestiny'].setValue(
                  destinyTransf
                );
              }

              break;
            case 'PGR_SAE':
              if (
                this.detailAssets.controls['transferentDestiny'].value === null
              ) {
                this.detailAssets.controls['transferentDestiny'].setValue('4');
              } else {
                const destinyTransf =
                  this.detailAssets.controls['transferentDestiny'].value;
                this.detailAssets.controls['transferentDestiny'].setValue(
                  destinyTransf
                );
              }

              break;
            case 'MANUAL':
              console.log('MANUAL');

              if (
                this.detailAssets.controls['transferentDestiny'].value === null
              ) {
                this.detailAssets.controls['transferentDestiny'].setValue('1');
              } else {
                const destinyTransf =
                  this.detailAssets.controls['transferentDestiny'].value;
                this.detailAssets.controls['transferentDestiny'].setValue(
                  destinyTransf
                );
              }

              break;
          }
        },
        // error: error => {
        //   this.typeTransferent = '';
        //   console.log(
        //     'Error al consultar solicitud',
        //     error,
        //     'Transferente, ',
        //     this.typeTransferent
        //   );
        // },
      });
    /*},
      });*/
  }

  destinySae(event: any) {
    this.dataToSend.saeDestiny = event.keyId;
  }

  getDestiny(id: number | string) {
    let params = new ListParams();
    params['filter.name'] = '$eq:Destino';
    params['filter.keyId'] = `$eq:${id}`;
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: ({ data }: any) => {
          this.destinyLigie = data[0].description;
        },
      });
  }
  getTansferUnitMeasure(event: any) {}

  getDestintSae(event: any) {}

  getState(event: any) {}

  getMunicipaly(params: ListParams, municipalyId?: number | string) {
    params['filter.stateKey'] = `$eq:${this.stateOfRepId}`;
    this.goodsInvService
      .getAllMunipalitiesByFilter(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          if (this.municipalityId !== 0 && this.municipalityId !== null) {
            if (this.combineMunicipalityId) {
              const newParams = {
                ...params,
                'filter.municipalityKey': `$eq:${this.municipalityId}`,
              };
              this.goodsInvService
                .getAllMunipalitiesByFilter(newParams)
                .subscribe({
                  next: response => {
                    const newData = resp.data.filter(
                      (item: any) =>
                        item.municipalityKey + '' !== this.municipalityId + ''
                    );
                    if (response.data && response.data[0]) {
                      newData.unshift(response.data[0]);
                    }
                    this.selectMunicipe = new DefaultSelect(
                      newData,
                      resp.count
                    );
                    this.combineMunicipalityId = false;
                  },
                  error: err => {
                    this.selectMunicipe = new DefaultSelect(
                      resp.data,
                      resp.count
                    );
                  },
                });
            } else {
              this.selectMunicipe = new DefaultSelect(
                resp.data.filter(
                  (item: any) =>
                    item.municipalityKey + '' !== this.municipalityId + ''
                ),
                resp.count
              );
            }
          } else {
            this.selectMunicipe = new DefaultSelect(resp.data, resp.count);
          }
        },
        error: error => {},
      });
    /* this.municipeSeraService.getAll(params).subscribe({
      next: data => {
        this.selectMunicipe = new DefaultSelect(data.data, data.count);
      },
      error: error => {},
    }); */
  }

  getLocality(
    params: ListParams,
    municipalityId?: number | string,
    stateKey?: number | string
  ) {
    if (municipalityId === null || stateKey === null) {
      return;
    }
    params['sortBy'] = 'township:ASC';
    params['filter.municipalityKey'] = `$eq:${municipalityId}`;
    params['filter.stateKey'] = `$eq:${stateKey}`;
    this.goodsInvService
      .getAllTownshipByFilter(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          if (this.localityKey !== 0 && this.localityKey !== null) {
            if (this.combineLocalityId) {
              const newParams = {
                ...params,
                'filter.townshipKey': `$eq:${this.localityKey}`,
              };
              this.goodsInvService
                .getAllTownshipByFilter(newParams)
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe({
                  next: response => {
                    const newData = resp.data.filter(
                      (item: any) =>
                        item.townshipKey + '' !== this.localityKey + ''
                    );
                    if (response.data && response.data[0]) {
                      newData.unshift(response.data[0]);
                    }
                    this.selectLocality = new DefaultSelect(
                      newData,
                      resp.count
                    );
                    this.combineLocalityId = false;
                  },
                  error: err => {
                    this.selectLocality = new DefaultSelect(resp.data);
                  },
                });
            } else {
              this.selectLocality = new DefaultSelect(
                resp.data.filter(
                  (item: any) => item.townshipKey !== this.localityKey
                )
              );
            }
          } else {
            this.selectLocality = new DefaultSelect(resp.data);
          }
        },
        error: error => {},
      });
  }

  getCP(params: ListParams, localityId?: number, municipalityId?: number) {
    // params.limit = 20;
    delete params.text;
    delete params.take;
    delete params.inicio;
    delete params.pageSize;
    if (
      this.localityKey === null ||
      this.municipalityId === null ||
      this.stateOfRepId === null
    ) {
      return;
    }
    params['filter.townshipKey'] = `$eq:${this.localityKey}`; //localidad
    params['filter.municipalityKey'] = `$eq:${this.municipalityId}`; //municipio
    params['filter.stateKey'] = `$eq:${this.stateOfRepId}`; //estado de la republica
    this.goodsInvService
      .getAllCodePostalByFilter(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          if (this.code !== '' && this.code !== null) {
            if (this.combineCode) {
              const newParams = {
                ...params,
                'filter.postalCode': `$eq:${this.code}`,
              };
              this.selectCP = new DefaultSelect(resp.data, resp.count);
              this.domicileForm
                .get('code')
                .setValue(this.selectCP.data[0]['postalCode']);
              /* this.goodsInvService.getAllCodePostalByFilter(newParams).subscribe({
              next: response => {
                const newData = resp.data.filter(
                  (item: any) => item.postalCode + '' !== this.code + ''
                );
                if (response.data && response.data[0]) {
                  newData.unshift(response.data[0]);
                }
                this.selectCP = new DefaultSelect(newData, resp.count);
                this.domicileForm.get('code').setValue(newData);
                this.combineCode = false;
              },
              error: err => {
                this.selectCP = new DefaultSelect(resp.data, resp.count);
              },
            }); */
            } else {
              this.selectCP = new DefaultSelect(
                resp.data.filter(
                  (item: any) => item.postalCode + '' !== this.code + ''
                )
              );
            }
          } else {
            this.selectCP = new DefaultSelect(resp.data, resp.count);
          }
        },
        error: err => {
          this.selectCP = new DefaultSelect([], 0);
        },
      });
  }

  // getCP(
  //   params: ListParams,
  //   keyTownship?: number,
  //   keyState?: number,
  //   keySettlement?: number
  // ): any {
  //   params.limit = 20;
  //   params['filter.keyState'] = `$eq:${keyState}`;
  //   delete params.text;
  //   delete params.take;
  //   delete params.inicio;
  //   delete params.pageSize;

  //   // const par = new FilterParams();

  //   this.goodsQueryService
  //     .getZipCode(params)
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         let resp: any = '';
  //         if (error?.error?.message !== 'No se encontrarón registros') {
  //           resp = error;
  //         }
  //         return resp;
  //       })
  //     )
  //     .subscribe({
  //       next: (data: any) => {
  //         this.selectCP = new DefaultSelect(data.data, data.count);
  //       },
  //     });
  // }

  getTransferentUnit(params: ListParams, unit?: string) {
    params['filter.unit'] = `$eq:${unit}`;
    this.strategyService.getUnitsMedXConv(params).subscribe({
      next: async resp => {
        const result = resp.data.map(async (item: any) => {
          const ligieunit: any = await this.getAsyncMedUnid(item.idUnitDestine);
          item['nbCode'] = ligieunit.data[0].nbCode;
        });

        Promise.all(result).then(data => {
          this.selectTansferUnitMeasure = new DefaultSelect(
            resp.data,
            resp.count
          );

          if (this.detailAssets.controls['unitMeasure'].value) {
            this.detailAssets.controls['unitMeasure'].setValue(
              this.detailAssets.controls['unitMeasure'].value
            );
          }
        });
      },
    });
  }

  async unitChange(event: any) {
    if (event == undefined) {
      this.selectTansferUnitMeasure = new DefaultSelect();
      this.getTransferentUnit(new ListParams(), this.unit);
    } else {
      this.selectTansferUnitMeasure = new DefaultSelect();
      this.getTransferentUnit(new ListParams(), event.idUnitDestine);
      const medUnid: any = await this.getAsyncMedUnid(event.idUnitDestine);

      if (medUnid.data[0].decimals == 'N') {
        this.detailAssets.controls['quantity'].setValidators([
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ]);
      } else {
        this.detailAssets.controls['quantity'].setValidators([
          Validators.pattern(DOUBLE_PATTERN),
        ]);
      }
      this.detailAssets.updateValueAndValidity();
    }
  }

  getLigieUnit(params: ListParams, id?: string) {
    const detail = this.detailAssets.value;
    let fraction = null;
    if (detail.ligieLevel4 != '0' && detail.ligieLevel4 != null) {
      fraction = detail.ligieLevel4;
    } else if (detail.ligieLevel3 != '0' && detail.ligieLevel3 != null) {
      fraction = detail.ligieLevel3;
    } else if (detail.ligieLevel2 != '0' && detail.ligieLevel2 != null) {
      fraction = detail.ligieLevel2;
    } else if (detail.ligieLevel1 != '0' && detail.ligieLevel1 != null) {
      fraction = detail.ligieLevel1;
    } else if (detail.ligieChapter != '0' && detail.ligieChapter != null) {
      fraction = detail.ligieChapter;
    } else if (detail.ligieSection != '0' && detail.ligieSection != null) {
      fraction = detail.ligieSection;
    }
    params['filter.nbCode'] = `$eq:${id}`;
    params['filter.fractionId'] = `$eq:${+fraction}`;
    this.goodProcessService.getVsigLigie(params).subscribe({
      next: resp => {
        this.ligieUnit = resp.data[0].unitDescription;
        this.unit = resp.data[0].unit;
        this.getTransferentUnit(new ListParams(), resp.data[0].unit);
        this.setQuantityTypeInput(resp.data[0]);
      },
    });
  }

  async setQuantityTypeInput(unity: any) {
    if (this.typeOfRequest == 'PGR_SAE' || this.typeOfRequest == 'SAT_SAE') {
      this.detailAssets.controls['quantity'].disable();
    } else {
      if (unity.amountDecimal == 'N') {
        this.detailAssets.controls['quantity'].setValidators([
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ]);
      } else {
        this.detailAssets.controls['quantity'].setValidators([
          Validators.pattern(DOUBLE_PATTERN),
        ]);
      }
    }
    this.detailAssets.updateValueAndValidity();
  }

  onValuesChange(data: any) {
    if (data != undefined) {
      this.getSubBrand(new ListParams(), data.flexValue);
      this.detailAssets.controls['subBrand'].setValue(null);
    } else {
      this.getBrand(new ListParams());
    }
  }

  onSubBranchChange(event: any) {
    if (this.brandId) {
      this.getSubBrand(new ListParams(), this.brandId);
    }
  }

  getBrand(params: ListParams, brandId?: string) {
    const filter = new FilterParams();
    filter.page = params.page;
    filter.limit = params.limit;
    filter.addFilter('flexValueMeaning', params.text, SearchFilter.ILIKE);
    if (brandId) {
      brandId = brandId.toLowerCase();
      brandId = brandId[0].toUpperCase() + brandId.substring(1);
      filter.addFilter('flexValue', brandId);
      //filter.search = brandId
    }

    this.goodsInvService
      .getAllBrandWithFilter(filter.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.selectBrand = new DefaultSelect(resp.data, resp.count);
          if (brandId) {
            this.detailAssets.controls['brand'].setValue(brandId);
          }
        },
        error: () => {
          this.selectBrand = new DefaultSelect();
        },
      });
  }

  getSubBrand(params: ListParams, brandId?: string, description?: string) {
    const filter = new ListParams();
    filter.page = params.page;
    filter.limit = params.limit;
    this.brandId = this.brandId
      ? this.brandId.toLowerCase()
      : brandId.toLowerCase();
    this.brandId = this.brandId
      ? this.brandId[0].toUpperCase() + this.brandId.substring(1)
      : brandId[0].toUpperCase() + brandId.substring(1);
    filter['filter.carBrand'] = `$ilike:${this.brandId}`;
    if (description != null) {
      description = description.toLowerCase();
      description = description[0].toUpperCase() + description.substring(1);
      filter['filter.flexValueMeaningDependent'] = `$ilike:${description}`;
    }
    if (params.text) {
      filter['filter.flexValueMeaningDependent'] = `$ilike:${params.text}`;
    }

    this.goodsInvService
      .getAllSubBrandWithFilter(filter)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.selectSubBrand = new DefaultSelect(resp.data, resp.count);
          if (description) {
            this.detailAssets.controls['subBrand'].setValue(description);
          }
        },
      });
  }

  modifyResponse(event: any) {
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.detailAssets.controls['duplicity'].setValue(value);
  }

  handleArmor(event: any) {
    if (event.currentTarget.checked) {
      let checked = event.currentTarget.checked;
      let value = checked === true ? 'Y' : 'N';
      this.detailAssets.controls['armor'].setValue(value);
    }
  }

  handleCirculateEvent(event: any) {
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.circulateString = value;
    this.detailAssets.controls['fitCircular'].setValue(value);
    const val25 = value == 'Y' ? 'APTO PARA CIRCULAR' : 'NO APTO PARA CIRCULAR';
    //this.detailAssets.controls['val25'].setValue(val25);
  }

  handleTheftReportEvent(event: any) {
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.theftReportString = value;
    this.detailAssets.controls['theftReport'].setValue(value);
  }

  //TODO: recibir los datos de cumple norma
  handleCumpliesNormEvent(event: any) {
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.complyNormString = value;
    this.detailAssets.controls['compliesNorm'].setValue(value);
  }

  handleAppraisalEvent(event: any) {
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.appraisalString = value;
    this.detailAssets.controls['appraisal'].setValue(value);
  }

  initInputs(): void {
    //control de disable de pantalla
    if (this.typeDoc === 'verify-compliance') {
      this.detailAssets.disable();
    } else if (this.typeDoc === 'classify-assets') {
      this.assetsForm.disable();
      this.assetsForm.controls['physicalState'].enable();
      this.assetsForm.controls['conservationState'].enable();
      this.assetsForm.controls['destintSae'].enable();
    } else if (this.typeDoc === 'assets') {
      this.assetsForm.controls['address'].disable();
    }
  }

  //obtener el estado de la republic por defecto
  getStateOfRepublic(params: ListParams, keyState?: number) {
    if (keyState != null) {
      this.stateOfRepublicService
        .getById(keyState)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            this.selectState = new DefaultSelect([data]);
            //this.domicileForm.controls['statusKey'].setValue(data.id);
          },
          /*error: error => {
          console.log(error);
        },*/
        });
    }
  }

  //Habre el modal de seleccion del domicilio
  openSelectAddressModal(): void {
    let config: ModalOptions = {
      initialState: {
        request: this.requestObject,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(SelectAddressComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //cargarlos en el formulario
      this.setGoodDomicilieSelected(res);
      //habilita los campos
      this.isDisabled = false;
    });
  }

  openSelectMenage() {
    let config: ModalOptions = {
      initialState: {
        goodsObject: [this.detailAssets.getRawValue()],
        requestId: this.requestObject.id,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(MenajeComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //ver si es necesario recivir los datos desde menaje
      if (res) {
        this.menajeSelected = res;
        this.isSaveMenaje = true;
      }
    });
  }

  getTypeGood(id: number) {
    let params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.typeRelevantSevice
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.goodTypeName = data.data[0].description;
        },
      });
  }

  changeDateEvaluoEvent(event: any) {
    this.bsEvaluoDate = event;
    if (this.bsEvaluoDate) {
      let date = this.bsEvaluoDate.toISOString(); //moment(this.bsEvaluoDate).format('DD-MM-YYYY');
      this.goodDomicilieForm.controls['appraisalDate'].setValue(date);
    }
  }
  changeCertiviDateEvent(event: any) {
    this.bsCertifiDate = event;

    if (this.bsCertifiDate) {
      let date = this.bsCertifiDate.toISOString(); //moment(this.bsEvaluoDate).format('DD-MM-YYYY');
      this.goodDomicilieForm.controls['certLibLienDate'].setValue(date);
    }
  }

  changeCertiviffDateEvent(event: any) {
    this.bsPffDate = event;

    if (this.bsPffDate) {
      let date = this.bsPffDate.toISOString(); //moment(this.bsEvaluoDate).format('DD-MM-YYYY');
      this.goodDomicilieForm.controls['pffDate'].setValue(date);
    }
  }
  displayTypeTapInformation(typeRelevantId: number) {
    /*if (this.detailAssets.get('id').value == null) {
      return;
    }
    this.detailAssetsInfo = this.detailAssets.value;
    this.classificationNumber = +this.detailAssetsInfo.goodClassNumber;
    this.initValue = true;
    this.goodChange2++;*/

    switch (typeRelevantId) {
      case 1:
        this.getGoodEstateTab();
        this.getGoodEstate();
        this.closeTabs();
        this.immovablesAssets = true;
        break;
      case 2:
        this.closeTabs();
        this.carsAssets = true;
        break;
      case 3:
        this.closeTabs();
        this.boatAssets = true;
        break;
      case 4:
        this.closeTabs();
        this.aircraftAssets = true;
        break;
      case 5:
        this.closeTabs();
        this.jewelerAssets = true;
        break;
      case 8:
        this.closeTabs();
        this.detailAssetsInfo = [];
        this.classificationNumber = null;
        this.service.data = [];
        this.otherAssets = true;
        break;
      default:
        this.closeTabs();
        break;
    }
  }

  closeTabs() {
    this.immovablesAssets = false;
    this.carsAssets = false;
    this.boatAssets = false;
    this.aircraftAssets = false;
    this.jewelerAssets = false;
    this.otherAssets = false;
  }

  async save() {
    setTimeout(() => {
      this.goodChange2++;
    }, 100);
    const domicilie = this.domicileForm.getRawValue();
    //se guarda bien domicilio
    if (domicilie.id !== null) {
      await this.saveDomicilieGood(domicilie);
    }
    //Se guardar el bien inmueble
    if (this.immovablesAssets === true) {
      if (this.domicileForm.controls['id'].value === null) {
        this.message(
          'warning',
          'Error',
          `Se requiere ingresar el domicilio del Bien`
        );
      } else {
        if (this.goodDomicilieForm.invalid == true) {
          setTimeout(() => {
            this.onLoadToast('warning', 'Recuerde llenar los campos faltantes');
          }, 1000);
          return;
        }
        if (!this.goodDomicilieForm.controls['id'].value) {
          await this.saveGoodRealState();
        } else {
          await this.updateGoodRealState();
        }
      }
    }

    //guarda el menaje
    if (this.isSaveMenaje === true) {
      await this.saveMenaje();
    }
  }

  viewAct: boolean = false;
  disableUpdate: boolean = false;
  good: IGoodTable = {};

  updateGood() {
    console.log('Información del Bien: ', this.detailAssetsInfo);
    let required: boolean = false;
    this.dataAtribute.forEach((item: any) => {
      if (item.required && (item.value === null || item.value === '')) {
        required = true;
      }
    });
    if (required) {
      this.alert('warning', 'Debe Registrar los Atributos Requeridos.', '');
      return;
    }

    let body: any = {};
    this.dataAtribute.forEach((row: any) => {
      body[row.column] = row.value;
    });
    body['id'] = Number(this.detailAssetsInfo.id);
    body['goodId'] = Number(this.detailAssetsInfo.id);
    this.goodService.updateGoodTable(body).subscribe({
      next: resp => {
        this.viewAct = !this.viewAct;
        this.disableUpdate = !this.disableUpdate;
        this.good = resp;
        this.alert('success', 'El Bien se ha Actualizado', '');
        setTimeout(() => {
          this.goodChange++;
        }, 100);
      },
      error: err => {
        this.alert('error', 'Error al Actualizar el Bien', '');
      },
    });
  }

  /*convertirFecha(fechaOriginal: any): string {
    const [dia, mes, anio] = fechaOriginal.split('/');
    const fechaObjeto: Date = new Date(`${mes}/${dia}/${anio}`);
    const anioFormateado: string = fechaObjeto.getFullYear().toString();
    const mesFormateado: string = (fechaObjeto.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const diaFormateado: string = fechaObjeto
      .getDate()
      .toString()
      .padStart(2, '0');
    const fechaFormateada: string = `${anioFormateado}-${mesFormateado}-${diaFormateado}`;
    return fechaFormateada;
  }

  convertirFecha2(fecha: string | Date): string {
    let fechaObj: Date;
    if (typeof fecha === 'string') {
      fechaObj = new Date(fecha);
    } else {
      fechaObj = fecha;
    }
    const anio = fechaObj.getFullYear();
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaObj.getDate().toString().padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    const fechaObjeto: Date = new Date(`${mes}/${dia}/${anio}`);
    const anioFormateado: string = fechaObjeto.getFullYear().toString();
    const mesFormateado: string = (fechaObjeto.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const diaFormateado: string = fechaObjeto
      .getDate()
      .toString()
      .padStart(2, '0');
    const fechaFormateada: string = `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
    return fechaFormateada;
  }
*/

  saveMenaje() {
    new Promise((resolve, reject) => {
      for (let i = 0; i < this.menajeSelected.length; i++) {
        const element = this.menajeSelected[i];

        this.menageService
          .create(element)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: data => {
              if (data.statusCode != null) {
                this.message(
                  'error',
                  'Error',
                  `El menaje no se pudo guardar\n. ${data.message}`
                );
                reject('El registro del Bien del domicilio no se guardó');
              }

              if (data.id != null) {
                this.message(
                  'success',
                  'Menaje Guardado',
                  `Se guardaron los menajes exitosamente`
                );
                this.isSaveMenaje = false;
                resolve('Se guardó correctamente el menaje');
              }
            },
          });
      }
    });
  }

  //guarda bien domicilio
  saveDomicilieGood(domicilie: any) {
    return new Promise((resolve, reject) => {
      domicilie.regionalDelegationId = domicilie.regionalDelegationId.id;
      domicilie.requestId = domicilie.requestId.id;
      this.goodDomicilie
        .update(domicilie.id, domicilie)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (data: any) => {
            if (data.statusCode != null) {
              this.message(
                'error',
                'Error',
                `El registro de domicilio del bien no se pudo actualizar\n. ${data.message}`
              );
              reject(
                'No se puede actualizar el registro del domicilio del bien'
              );
            }

            if (data.id != null) {
              this.domicileForm.controls['id'].setValue(data.id);
              resolve(true);
            }
          },
          error: error => {
            this.message(
              'error',
              'Error',
              `El registro de domicilio del bien no se pudo actualizar\n. ${error.error.message}`
            );
          },
        });
    });
  }

  //guardar el bien inmueble
  saveGoodRealState() {
    return new Promise((resolve, reject) => {
      let domicilio = this.goodDomicilieForm.getRawValue();
      //let domicilio = this.fillUpForm(); en caso de que se este usando la tabla
      domicilio.addressId = this.domicileForm.controls['id'].value;
      domicilio.creationDate = new Date().toISOString();
      domicilio.modificationDate = new Date().toISOString();

      const username = this.authService.decodeToken().preferred_username;
      domicilio.userCreation = username;
      domicilio.userModification = username;
      domicilio.id = this.detailAssets.controls['id'].value; //id good

      this.goodEstateService.create(domicilio).subscribe({
        next: resp => {
          console.log(resp);
          this.goodDomicilieForm.controls['id'].setValue(resp.id);
          this.goodDomicilieForm.controls['userCreation'].setValue(
            resp.userCreation
          );
          resolve(true);
        },
        error: error => {
          reject(false);
          console.log('inmueble crear', error);
          this.message(
            'error',
            'Error',
            `El registro del inmueble no se guardo\n. ${error.error.message}`
          );
        },
      });
    });
  }

  updateGoodRealState() {
    return new Promise((resolve, reject) => {
      const username = this.authService.decodeToken().preferred_username;
      let domicilio = this.goodDomicilieForm.getRawValue();
      domicilio.modificationDate = new Date().toISOString();
      domicilio.creationDate = new Date().toISOString();

      domicilio.userCreation = username;
      domicilio.userModification = username;
      this.goodEstateService.update(domicilio).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          reject(false);
          console.log('inmueble actualizar', error);
          this.message(
            'error',
            'Error',
            `El registro del inmueble no se actualizo\n. ${error.error.message}`
          );
        },
      });
    });
  }

  getGoodDomicilie(addressId: any) {
    let address = null;
    if (addressId.id != null) {
      address = addressId.id;
    } else {
      address = addressId;
    }

    this.goodDomicilie
      .getById(address)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (resp: any) => {
          this.setGoodDomicilieSelected(resp);
        },
      });
  }

  getReactiveFormCall() {
    if (this.detailAssets.controls['ligieUnit'].value) {
      const ligieUnit = this.detailAssets.controls['ligieUnit'].value;
      this.getLigieUnit(new ListParams(), ligieUnit);
    }

    this.detailAssets.controls['destiny'].valueChanges.subscribe(
      (destiny: any) => {
        if (destiny != null || destiny != undefined) {
          this.getDestiny(destiny);
        }
      }
    );

    this.detailAssets.controls['ligieUnit'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          const ligieUnit = this.detailAssets.controls['ligieUnit'].value;
          this.getLigieUnit(new ListParams(), ligieUnit);
        }
      }
    );

    this.detailAssets.controls['goodTypeId'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.getTypeGood(this.detailAssets.controls['goodTypeId'].value);
          this.displayTypeTapInformation(Number(data));
        } else {
          //limpia los tabs de los bienes
          this.displayTypeTapInformation(data);
        }
      }
    );

    this.detailAssets.controls['brand'].valueChanges.subscribe((data: any) => {
      if (data) {
        this.brandId = data;
        if (this.detailAssets.controls['subBrand'].value) {
          const subBrand = this.detailAssets.controls['subBrand'].value;
          this.getSubBrand(new ListParams(), data, subBrand);
        }
      }
    });

    /*this.detailAssets.controls['transferentDestiny'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          let value = this.selectDestinyTransfer.data.filter(
            x => x.keyId === data
          );
          this.destinyLigie = value[0].description;
          this.detailAssets.controls['destiny'].setValue(data);
        }
      }
    );*/

    this.domicileForm.controls['statusKey'].valueChanges.subscribe(data => {
      if (data !== null) {
        /*this.stateOfRepId = data;
        this.municipalityId =
          this.domicileForm.controls['municipalityKey'].value ?? '';
        this.getMunicipaly(new ListParams());*/
      }
    });

    this.domicileForm.controls['municipalityKey'].valueChanges.subscribe(
      (data: any) => {
        if (data === null) {
          this.combineMunicipalityId = true;
        }
        this.municipalityId = data;
        this.selectLocality = new DefaultSelect([]);
        this.domicileForm.get('localityKey').setValue(null);
        this.getLocality(new ListParams(), data, this.stateOfRepId);
        // if (data) {
        //   /*var stateKey =
        //     this.request !== undefined
        //       ? this.request.keyStateOfRepublic
        //       : this.domicileForm.controls['statusKey'].value;

        //   this.municipalityId = data;
        //   this.getLocality(new ListParams(), data, stateKey);*/
        // }
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
        if (data === null) {
          this.combineLocalityId = true;
          this.domicileForm.get('code').setValue(null);
        }
        this.localityKey = data;
        /* this.selectCP = new DefaultSelect([]); */
        /* this.domicileForm.get('code').setValue(null); */
        this.getCP(new ListParams());
        if (data) {
          /*  this.getCP(
            new ListParams(),
            this.municipalityId,
            this.stateOfRepId,
            Number(data)
          ); */
        }
      }
    );

    if (this.detailAssets.controls['armor'].value) {
      //this.armorString = this.detailAssets.controls['armor'].value;
      this.armor =
        this.detailAssets.controls['armor'].value === 'Y' ? true : false;
    }

    if (this.detailAssets.controls['duplicity'].value) {
      this.duplicityString = this.detailAssets.controls['duplicity'].value;
      this.duplicity =
        this.detailAssets.controls['duplicity'].value === 'Y' ? true : false;
    }

    if (this.detailAssets.controls['fitCircular'].value) {
      this.circulateString = this.detailAssets.controls['fitCircular'].value;
      this.circulate =
        this.detailAssets.controls['fitCircular'].value === 'Y' ? true : false;
    }

    if (this.detailAssets.controls['theftReport'].value) {
      this.theftReportString = this.detailAssets.controls['theftReport'].value;
      this.theftReport =
        this.detailAssets.controls['theftReport'].value === 'Y' ? true : false;
    }

    if (this.detailAssets.controls['compliesNorm'].value) {
      this.complyNormString = this.detailAssets.controls['compliesNorm'].value;
      this.complyNorm =
        this.detailAssets.controls['compliesNorm'].value === 'Y' ? true : false;
    }

    if (this.detailAssets.controls['appraisal'].value) {
      this.appraisalString = this.detailAssets.controls['appraisal'].value;
      this.appraisal =
        this.detailAssets.controls['appraisal'].value === 'Y' ? true : false;
    }

    /**
     * descomentar en caso de usar la tabla
     */
    /* this.detailAssets.controls['id'].valueChanges.subscribe((data: any) => {
      const goodType = this.detailAssets.controls['goodTypeId'].value;
      this.getTypeGood(this.detailAssets.controls['goodTypeId'].value);
      this.displayTypeTapInformation(Number(goodType));
    }); */
  }

  getGoodEstate() {
    if (this.detailAssets.controls['id'].value !== null) {
      try {
        const id = this.detailAssets.controls['id'].value;
        this.goodEstateService
          .getById(id)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: resp => {
              this.goodDomicilieForm.patchValue(resp);
              /* establece las fechas  */
              const dateEvaluo =
                this.goodDomicilieForm.controls['appraisalDate'].value;
              this.bsEvaluoDate = dateEvaluo
                ? this.parseDateNoOffset(dateEvaluo)
                : null;
              const datePFF = this.goodDomicilieForm.controls['pffDate'].value;
              this.bsPffDate = datePFF ? this.parseDateNoOffset(datePFF) : null;
              const dateCerti =
                this.goodDomicilieForm.controls['certLibLienDate'].value;
              this.bsCertifiDate = dateCerti
                ? this.parseDateNoOffset(dateCerti)
                : null;
            },
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  message(header: any, title: string, body: string) {
    setTimeout(() => {
      this.onLoadToast(header, title, body);
    }, 2000);
  }

  /*isSavingData() {
    this.requestHelperService.currentRefresh.subscribe({
      next: data => {
        if (data) {
          this.save();
        }
      },
    });
  }*/

  setGoodDomicilieSelected(domicilie: any) {
    domicilie.localityKey = Number(domicilie.localityKey);
    this.detailAssets.controls['addressId'].setValue(Number(domicilie.id));
    this.stateOfRepId = domicilie.statusKey;
    this.municipalityId = domicilie.municipalityKey;
    this.localityKey = domicilie.localityKey;
    this.getStateOfRepublic(new ListParams(), domicilie.statusKey);
    this.getMunicipaly(new ListParams(), this.municipalityId);

    this.getLocality(
      new ListParams(),
      Number(this.municipalityId),
      this.stateOfRepId
    );

    this.domicileForm.patchValue(domicilie);

    this.domicileForm.controls['localityKey'].setValue(domicilie.localityKey);
    this.sendDomicileSelectedEvent.emit(domicilie);
  }

  getDetailInfo(event: any) {
    console.log(event);
    this.sendDetailInfoEvent.emit(event);
  }

  getAsyncMedUnid(unit: string) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.unit'] = `$eq:${unit}`;
      this.strategyService.getMedUnits(params).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  get dataAtribute() {
    return this.service.data;
  }

  fillUpForm() {
    const realState: IGoodRealState = this.goodDomicilieForm.value;
    console.log(this.dataAtribute);
    for (let i = 0; i < this.dataAtribute.length; i++) {
      const element = this.dataAtribute[i];
      if (element.column == 'val40') realState.description = element.value;

      if (element.column == 'val23')
        realState.vigilanceRequired = element.value;
      if (element.column == 'val7') realState.propertyType = element.value;
      if (element.column == 'val5') realState.surfaceMts = +element.value; //valor positivo
      if (element.column == 'val6') realState.consSurfaceMts = +element.value; //valor positivo
      if (element.column == 'val45') realState.publicDeed = element.value;
      if (element.column == 'val20') realState.pubRegProperty = element.value;
      if (element.column == 'val14') realState.appraisalValue = +element.value; //valor del avaluo
      if (element.column == 'val35') realState.appraisalDate = element.value;
      if (element.column == 'val10') realState.propTitleFolio = element.value;
      if (element.column == 'val26') realState.vouchersWater = element.value;
      if (element.column == 'val26') realState.vouchersWater = element.value;
    }

    return realState;
  }
}
