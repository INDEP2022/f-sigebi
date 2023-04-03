import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError } from 'rxjs/operators';
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
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ParameterSubBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-sub-brands.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  //usado para cargar los adatos de los bienes en el caso de cumplimientos de bienes y clasificacion de bienes
  @Input() requestObject: any; //solicitud
  @Input() assetsId: any; //id del bien
  @Input() detailAssets: ModelForm<any>; // bienes ModelForm
  @Input() domicilieObject: IDomicilies; // domicilio del bien
  @Input() typeDoc: any;
  @Input() process: string = '';

  goodData: IGood;
  bsModalRef: BsModalRef;
  request: IRequest;
  stateOfRepId: number = null;
  municipalityId: number | string = null;
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

  constructor(
    private fb: FormBuilder,
    private modalServise: BsModalService,
    private goodService: GoodService,
    private goodTypeService: GoodTypeService,
    private relevantTypeService: TypeRelevantService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const address: IAddress = this.detailAssets.controls['addressId'].value;

    if (this.process == 'classify-assets') {
      this.goodData = this.detailAssets.value;
      console.log('data', this.goodData);
      this.relevantTypeService
        .getById(this.goodData.fractionId.relevantTypeId)
        .subscribe(data => {
          this.relevantTypeName = data.description;
        });

      if (this.process == 'classify-assets') {
        if (this.detailAssets.controls['subBrand'].value) {
          //console.log(this.detailAssets.controls['brand'].value);
          const brand = this.detailAssets.controls['brand'].value;
          this.getSubBrand(new ListParams(), brand);
        }
      }
      this.isGoodTypeReadOnly = true;
    }

    if (this.typeDoc === 'clarification') {
      if (this.detailAssets.controls['subBrand'].value) {
        const brand = this.detailAssets.controls['brand'].value;
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

      if (this.detailAssets.controls['subBrand'].value) {
        const brand = this.detailAssets.controls['brand'].value;
        this.getSubBrand(new ListParams(), brand);
      }
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
      }

      if (this.detailAssets.controls['subBrand'].value) {
        const subBrand = this.detailAssets.controls['subBrand'].value;
        this.getSubBrand(new ListParams(), subBrand);
      }
    }

    //revisa si el formulario de bienes contiene el id del tipo de bien
    if (this.detailAssets.controls['goodTypeId'].value != null) {
      const data = this.detailAssets.controls['goodTypeId'].value;
      this.getTypeGood(this.detailAssets.controls['goodTypeId'].value);
      this.displayTypeTapInformation(Number(data));
    }
  }

  goodType(goodTypeId: number) {
    this.typeRelevantSevice.getById(goodTypeId).subscribe({
      next: response => {
        this.nameGoodType = response.description;
      },
      error: error => {},
    });
  }

  typeRelevant(typeRelevantId: number) {
    this.typeRelevantSevice.getById(typeRelevantId).subscribe({
      next: data => {
        this.nameTypeRelevant = data.description;
      },
      error: error => {},
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getDestinyTransfer(new ListParams());
    this.getPhysicalState(new ListParams());
    this.getConcervationState(new ListParams());
    this.getTransferentUnit(new ListParams());
    this.getReactiveFormCall();
    this.isSavingData();
    this.getBrand(new ListParams());

    if (
      this.requestObject != undefined &&
      this.detailAssets.controls['addressId'].value === null
    ) {
      this.domicileForm.controls['requestId'].setValue(this.requestObject.id);
    }
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayref3Key: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      statusKey: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      municipalityKey: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      localityKey: [
        null,
        [(Validators.pattern(STRING_PATTERN), Validators.maxLength(100))],
      ],
      code: [
        '',
        [(Validators.pattern(STRING_PATTERN), Validators.maxLength(6))],
      ],
      latitude: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      length: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayName: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayOrigin: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      exteriorNumber: [
        '',
        [(Validators.pattern(STRING_PATTERN), Validators.maxLength(30))],
      ],
      interiorNumber: [
        '',
        [(Validators.pattern(STRING_PATTERN), Validators.maxLength(30))],
      ],
      wayDestiny: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayref1Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayChaining: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      status: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      propertyType: [null, [Validators.required, Validators.maxLength(30)]],
      surfaceMts: [
        0,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      consSurfaceMts: [
        0,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      publicDeed: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
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
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      appraisalDate: [null],
      certLibLien: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(50),
        ],
      ],
      guardCustody: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      vigilanceRequired: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      vigilanceLevel: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      mtsOfiWarehouse: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      bedrooms: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      bathroom: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      kitchen: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      diningRoom: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      livingRoom: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      study: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      espPark: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      attachment: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      embFavorThird: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      coOwnership: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      ownershipPercentage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      decreeExproProc: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      decreeExproSupe: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      declareRemediation: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      heritage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      assurance: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      debts: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      physicalPossession: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      closed: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      familyHeritage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
    });
  }

  getPhysicalState(params: ListParams) {
    params['filter.name'] = '$eq:Estado Fisico';
    this.genericService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectPhysicalState = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getConcervationState(params: ListParams) {
    params['filter.name'] = '$eq:Estado Conservacion';
    this.genericService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectConcervationState = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getDestinyTransfer(params: ListParams) {
    params['filter.name'] = '$eq:Destino';
    this.genericService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectDestinyTransfer = new DefaultSelect(data.data, data.count);
        this.detailAssets.controls['transferentDestiny'].setValue('1');
      },
    });
  }

  getTansferUnitMeasure(event: any) {}

  getDestintSae(event: any) {}

  getState(event: any) {}

  getMunicipaly(params: ListParams, municipalyId?: number | string) {
    params['filter.stateKey'] = `$eq:${this.stateOfRepId}`;
    /*if (municipalyId) {
      params['filter.municipalityKey'] = `$eq:${municipalyId}`;
    }*/
    this.goodsInvService.getAllMunipalitiesByFilter(params).subscribe({
      next: resp => {
        this.selectMunicipe = new DefaultSelect(resp.data, resp.count);
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
    params['filter.municipalityKey'] = `$eq:${municipalityId}`;
    params['filter.stateKey'] = `$eq:${stateKey}`;
    this.goodsInvService.getAllTownshipByFilter(params).subscribe({
      next: data => {
        this.selectLocality = new DefaultSelect(data.data, data.count);
      },
      error: error => {},
    });
  }

  getCP(
    params: ListParams,
    keyTownship?: number,
    keyState?: number,
    keySettlement?: number
  ): any {
    params.limit = 20;
    params['filter.keyState'] = `$eq:${keyState}`;
    delete params.text;
    delete params.take;
    delete params.inicio;
    delete params.pageSize;

    const par = new FilterParams();

    this.goodsQueryService
      .getZipCode(params)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let resp: any = '';
          if (error?.error?.message !== 'No se encontrarón registros') {
            resp = error;
          }
          return resp;
        })
      )
      .subscribe({
        next: (data: any) => {
          this.selectCP = new DefaultSelect(data.data, data.count);
        },
      });
  }

  getTransferentUnit(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.goodsInvService.getCatUnitMeasureView(params).subscribe({
      next: resp => {
        this.selectTansferUnitMeasure = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
    });
  }

  getBrand(params: ListParams, brandId?: string) {
    const filter = new FilterParams();
    filter.addFilter('flexValueMeaning', params.text, SearchFilter.ILIKE);
    if (brandId) {
      filter.addFilter('flexValue', brandId);
    }

    this.goodsInvService.getAllBrandWithFilter(filter.getParams()).subscribe({
      next: resp => {
        this.selectBrand = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getSubBrand(params: ListParams, brandId?: string) {
    const idBrand = brandId ? brandId : this.brandId;
    const filter = new ListParams();

    filter['filter.carBrand'] = `$eq:${idBrand}`;
    filter['filter.flexValueMeaningDependent'] = `$ilike:${params.text}`;

    this.goodsInvService.getAllSubBrandWithFilter(filter).subscribe({
      next: resp => {
        this.selectSubBrand = new DefaultSelect(resp.data, resp.count);
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
      this.stateOfRepublicService.getById(keyState).subscribe({
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
    this.typeRelevantSevice.getById(id).subscribe({
      next: (data: any) => {
        this.goodTypeName = data.description;
      },
    });
  }

  changeDateEvaluoEvent(event: any) {
    this.bsEvaluoDate =
      this.bsEvaluoDate !== undefined ? this.bsEvaluoDate : event;

    if (this.bsEvaluoDate) {
      let date = new Date(this.bsEvaluoDate);
      this.goodDomicilieForm.controls['appraisalDate'].setValue(
        date.toISOString()
      );
    }
  }
  changeCertiviDateEvent(event: any) {
    this.bsCertifiDate =
      this.bsCertifiDate !== undefined ? this.bsCertifiDate : event;

    if (this.bsCertifiDate) {
      let date = new Date(this.bsCertifiDate);
      this.goodDomicilieForm.controls['certLibLienDate'].setValue(
        date.toISOString()
      );
    }
  }

  changeCertiviffDateEvent(event: any) {
    this.bsPffDate = this.bsPffDate !== undefined ? this.bsPffDate : event;

    if (this.bsPffDate) {
      let date = new Date(this.bsPffDate);
      this.goodDomicilieForm.controls['pffDate'].setValue(date.toISOString());
    }
  }
  displayTypeTapInformation(typeRelevantId: number) {
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
    const domicilie = this.domicileForm.getRawValue();
    //se guarda bien domicilio
    if (domicilie.id !== null) {
      await this.saveDomicilieGood(domicilie);
    }
    //Se guardar el bien inmueble
    if (this.immovablesAssets === true) {
      if (this.domicileForm.controls['id'].value === null) {
        this.message(
          'info',
          'Error',
          `Se reguiqere ingresar el domicilio del bien`
        );
      } else {
        await this.saveGoodRealState();
      }
    }

    //guarda el menaje
    if (this.isSaveMenaje === true) {
      await this.saveMenaje();
    }
  }

  saveMenaje() {
    new Promise((resolve, reject) => {
      for (let i = 0; i < this.menajeSelected.length; i++) {
        const element = this.menajeSelected[i];

        this.menageService.create(element).subscribe({
          next: data => {
            if (data.statusCode != null) {
              this.message(
                'error',
                'Error',
                `El menaje no se pudo guardar!\n. ${data.message}`
              );
              reject('El registro del bien del domicilio no se guardo!');
            }

            if (data.id != null) {
              this.message(
                'success',
                'Menaje guardado',
                `Se guardaron los menajes existosamente`
              );
              this.isSaveMenaje = false;
              resolve('Se guardo correctamente el menaje!');
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
      this.goodDomicilie.update(domicilie.id, domicilie).subscribe({
        next: (data: any) => {
          if (data.statusCode != null) {
            this.message(
              'error',
              'Error',
              `El registro de domicilio del bien no se pudo actualizar!\n. ${data.message}`
            );
            reject('No se puedo actualizar el registro del domicilio del bien');
          }

          if (data.id != null) {
            this.message(
              'success',
              'Actualizado',
              `Se actualizo el domicilio del bien!`
            );
            this.domicileForm.controls['id'].setValue(data.id);
            resolve('Se actualizo el registro del domicilio del bien');
          }
        },
      });
    });
  }

  //guardar el bien inmueble
  saveGoodRealState() {
    return new Promise((resolve, reject) => {
      let domicilio = this.goodDomicilieForm.getRawValue();
      domicilio.addressId = this.domicileForm.controls['id'].value;
      domicilio.creationDate = new Date().toISOString();
      domicilio.modificationDate = new Date().toISOString();

      const username = this.authService.decodeToken().preferred_username;
      domicilio.userCreation = username;
      domicilio.userModification = username;

      var action = null;
      if (domicilio.id === null) {
        domicilio.id = this.detailAssets.controls['id'].value;
        action = this.goodEstateService.create(domicilio);
      } else {
        action = this.goodEstateService.update(domicilio.id, domicilio);
      }

      action.subscribe({
        next: data => {
          if (data.statusCode != null) {
            this.message(
              'error',
              'Error',
              `No se guardo el registro del bien inmueble!\n. ${data.message}`
            );
            reject('El registro del bien del inmueble no se guardo!');
          }

          if (data.id != null) {
            this.message(
              'success',
              'Guardado',
              `Se guardo correctamente el bien inmueble!`
            );

            resolve('Se guardo correctamente el bien inmueble!');
          }
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

    this.goodDomicilie.getById(address).subscribe({
      next: (resp: any) => {
        this.setGoodDomicilieSelected(resp);
      },
    });
  }

  getReactiveFormCall() {
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
        this.getSubBrand(new ListParams(), data);
      }
    });

    this.detailAssets.controls['transferentDestiny'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          let value = this.selectDestinyTransfer.data.filter(
            x => x.keyId === data
          );
          this.destinyLigie = value[0].description;
          this.detailAssets.controls['destiny'].setValue(data);
        }
      }
    );

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
        if (data) {
          /*var stateKey =
            this.request !== undefined
              ? this.request.keyStateOfRepublic
              : this.domicileForm.controls['statusKey'].value;

          this.municipalityId = data;
          this.getLocality(new ListParams(), data, stateKey);*/
        }
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
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
  }

  getGoodEstate() {
    if (this.detailAssets.controls['id'].value !== null) {
      const id = this.detailAssets.controls['id'].value;
      this.goodEstateService.getById(id).subscribe({
        next: resp => {
          this.goodDomicilieForm.patchValue(resp);
        },
      });
    }
  }

  message(header: any, title: string, body: string) {
    setTimeout(() => {
      this.onLoadToast(header, title, body);
    }, 2000);
  }

  isSavingData() {
    this.requestHelperService.currentRefresh.subscribe({
      next: data => {
        if (data) {
          this.save();
        }
      },
    });
  }

  setGoodDomicilieSelected(domicilie: any) {
    domicilie.localityKey = Number(domicilie.localityKey);
    this.detailAssets.controls['addressId'].setValue(Number(domicilie.id));
    this.stateOfRepId = domicilie.statusKey;
    this.municipalityId = domicilie.municipalityKey;

    this.getStateOfRepublic(new ListParams(), domicilie.statusKey);
    this.getMunicipaly(new ListParams(), this.municipalityId);

    this.getLocality(
      new ListParams(),
      Number(this.municipalityId),
      this.stateOfRepId
    );

    this.domicileForm.patchValue(domicilie);

    this.domicileForm.controls['localityKey'].setValue(domicilie.localityKey);

    /*setTimeout(() => {
      this.domicileForm.patchValue(domicilie);
      console.log(this.domicileForm.getRawValue());
    }, 3000);

    this.domicileForm.controls['municipalityKey'].setValue(
      domicilie.municipalityKey
    );
    this.stateOfRepId = domicilie.statusKey;
    this.getMunicipaly(new ListParams(), domicilie.municipalityKey);

    this.domicileForm.controls['municipalityKey'].setValue(
      domicilie.municipalityKey
    );*/
  }
}
