import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError } from 'rxjs/operators';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IDomicilies,
  IGoodRealState,
} from 'src/app/core/models/good/good.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ParameterSubBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-sub-brands.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  @Input() detailAssets: ModelForm<any>; // bienes ModelForm
  @Input() domicilieObject: IDomicilies; // domicilio del bien
  @Input() typeDoc: any;
  bsModalRef: BsModalRef;
  request: IRequest;
  stateOfRepId: number = null;
  municipalityId: number = null;

  goodDomicilieForm: ModelForm<IGoodRealState>; // bien inmueble
  domicileForm: ModelForm<IDomicilies>; //domicilio del bien
  assetsForm: ModelForm<any>; //borrar

  selectSae = new DefaultSelect<any>();
  selectConservationState = new DefaultSelect<any>();

  goodTypeName: string = '';
  duplicity: boolean = false;
  armor: boolean = false;
  destinyLigie: string = '';
  addressId: number = null;
  bsEvaluoDate: any;
  brandId: string = '';

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

  isDisabled: boolean = true; //desabilita el campo domicilio
  menajeSelected: any;
  isSaveMenaje: boolean = false;
  disableDuplicity: boolean = false; //para verificar cumplimientos = false

  constructor(private fb: FormBuilder, private modalServise: BsModalService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc === 'clarification') {
      console.log(changes['detailAssets'].currentValue);
    }
    if (this.typeDoc === 'verify-compliance' || this.typeDoc === 'assets') {
      if (this.detailAssets.controls['addressId'].value) {
        this.addressId = this.detailAssets.controls['addressId'].value;
        this.getGoodDomicilie(this.addressId);
      }
      if (this.typeDoc === 'verify-compliance') {
        this.detailAssets.disable();
        this.disableDuplicity = true;
        if (this.goodDomicilieForm !== undefined) {
          this.goodDomicilieForm.disable();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
    console.log('tipo de bien');
    console.log(this.typeDoc);
    this.getDestinyTransfer(new ListParams());
    this.getPhysicalState(new ListParams());
    this.getConcervationState(new ListParams());
    this.getReactiveFormCall();
    this.isSavingData();

    //.getGoodDomicilieTab();
    if (
      this.requestObject != undefined &&
      this.detailAssets.controls['addressId'].value === null
    ) {
      this.domicileForm.controls['requestId'].setValue(this.requestObject.id);
      this.domicileForm.controls['regionalDelegationId'].setValue(
        this.requestObject.regionalDelegationId
      );
      this.getStateOfRepublic(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      );
      this.getMunicipaly(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      );
    }

    //console.log('detalle del objeto enviado');
    //console.log(this.detailAssets);

    //this.initInputs();
  }

  initForm() {
    this.assetsForm = this.fb.group({
      noManagement: [null],
      typeAsset: [null, [Validators.pattern(STRING_PATTERN)]],
      color: [null, [Validators.pattern(STRING_PATTERN)]],
      transferQuantity: [null],
      descripTransfeAsset: [null, [Validators.pattern(STRING_PATTERN)]],
      duplicity: [false],
      capacityLts: [null, [Validators.pattern(STRING_PATTERN)]],
      volumem3: [null, [Validators.pattern(STRING_PATTERN)]],
      noExpedient: [null],
      typeUse: [null],
      conservationState: [null],
      origin: [null, [Validators.pattern(STRING_PATTERN)]],
      LigieUnitMeasure: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      avaluo: [null],
      destinyLigie: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      meetNoraml: [true],
      destinyTransfer: [null],
      tansferUnitMeasure: [null],
      notes: [null, [Validators.pattern(STRING_PATTERN)]],
      sae: [null],
      physicalState: [null],
      destintSae: [{ value: null, disabled: true }],
      /* tab bienes */
      address: new FormGroup({
        aliasWarehouse: new FormControl(''),
        referenceVia2: new FormControl(''),
        state: new FormControl(''),
        referenceVia3: new FormControl(''),
        municipe: new FormControl(''),
        suburb: new FormControl(''),
        cp: new FormControl(''),
        longitud: new FormControl(''),
        latitud: new FormControl(''),
        nameRoute: new FormControl(''),
        numExt: new FormControl(''),
        originRoute: new FormControl(''),
        numInt: new FormControl(''),
        routeDestination: new FormControl(''),
        referenceVia1: new FormControl(''),
        kilometerRoute: new FormControl(''),
        description: new FormControl(''),
      }),
      vehicle: new FormGroup({
        brand: new FormControl(''),
        enrollment: new FormControl(''),
        subBrand: new FormControl(''),
        serie: new FormControl(''),
        armored: new FormControl(''),
        chassis: new FormControl(''),
        model: new FormControl(''),
        numDoors: new FormControl(''),
        cabin: new FormControl(''),
        numEje: new FormControl(''),
        originVehicle: new FormControl(''),
        engineNum: new FormControl(''),
        canCirculate: new FormControl(''),
        hasTheftReport: new FormControl(''),
      }),
      boat: new FormGroup({
        boatArmored: new FormControl(''),
        operativeStatus: new FormControl(''),
        engineNumBoat: new FormControl(''),
        numEngines: new FormControl(''),
        enrollmentBoat: new FormControl(''),
        flag: new FormControl(''),
        cabinBoat: new FormControl(''),
        fretwork: new FormControl(''),
        volumem3Boat: new FormControl(''),
        eslora: new FormControl(''),
        originBoat: new FormControl(''),
        manga: new FormControl(''),
        typeUseBoat: new FormControl(''),
        boatName: new FormControl(''),
        yearProduction: new FormControl(''),
        boatRegistration: new FormControl(''),
        capacityLtsBoat: new FormControl(''),
        boats: new FormControl(''),
      }),
      jewel: new FormGroup({
        kilos: new FormControl(''),
        material: new FormControl(''),
        weight: new FormControl(''),
      }),
      aircraft: new FormGroup({
        aircraftArmored: new FormControl(''),
        yearProductionAircraft: new FormControl(''),
        modelAircraft: new FormControl(''),
        operativeStatusAircraf: new FormControl(''),
        engineNumAircraft: new FormControl(''),
        numEnginesAircraft: new FormControl(''),
        enrollmentAircraft: new FormControl(''),
        AeronauticsRegistry: new FormControl(''),
        serieAircraft: new FormControl(''),
        typeAirplane: new FormControl(''),
        originAircraft: new FormControl(''),
        flagAircraft: new FormControl(''),
        typeUseAirCraft: new FormControl(''),
      }),
      immovables: new FormGroup({
        descriptionImmovable: new FormControl(''),
        custody: new FormControl(''),
        statusImmovable: new FormControl(''),
        requireVigilance: new FormControl(''),
        levelVigilance: new FormControl(''),
        typeImmovable: new FormControl(''),
        metersWarehouse: new FormControl(''),
        metersLand: new FormControl(''),
        rooms: new FormControl(''),
        metersBuiltLand: new FormControl(''),
        bathRoom: new FormControl(''),
        kitchen: new FormControl(''),
        dinningRoom: new FormControl(''),
        livingRoom: new FormControl(''),
        studyRoom: new FormControl(''),
        garage: new FormControl(''),
        publicDeed: new FormControl(''),
        appraisedValue: new FormControl(''),
        valueDate: new FormControl(''),
        gravamen: new FormControl(''),
      }),
    });

    //formulario de domicilio
    this.domicileForm = this.fb.group({
      id: [null],
      warehouseAlias: ['DOMICILIO TRANSFERENTE'],
      wayref2Key: [null],
      wayref3Key: [null],
      statusKey: [null],
      municipalityKey: [null],
      localityKey: [null],
      code: [''],
      latitude: [''],
      length: [''], //por cambiar
      wayName: [''],
      wayOrigin: [''],
      exteriorNumber: [''],
      interiorNumber: [''],
      wayDestiny: [''],
      wayref1Key: [null],
      wayChaining: [''],
      description: [''],
      regionalDelegationId: [null],
      requestId: [null],
    });

    //this.assetsForm.controls['typeAsset'].disable();
    //this.assetsForm.disable();
    //this.assetsForm.controls['typeAsset'].enable();
  }

  //formulario del inmueble
  getGoodEstateTab() {
    this.goodDomicilieForm = this.fb.group({
      id: [null],
      description: [null],
      status: [null],
      propertyType: [null],
      surfaceMts: [0, Validators.required],
      consSurfaceMts: [0, Validators.required],
      publicDeed: [null],
      pubRegProperty: [null],
      appraisalValue: [0, Validators.required],
      appraisalDate: [null],
      certLibLien: [null],
      guardCustody: [null],
      vigilanceRequired: [null],
      vigilanceLevel: [null],
      mtsOfiWarehouse: [null],
      bedrooms: [null],
      bathroom: [null],
      kitchen: [null],
      diningRoom: [null],
      livingRoom: [null],
      study: [null],
      espPark: [null],
      userCreation: [null],
      creationDate: [null],
      addressId: [null],
      userModification: [null],
      modificationDate: [null],
    });
  }
  getSae(event: any) {}

  getConservationState(event: any): void {}

  getQuantityTransfer(event: any) {}

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

  getMunicipaly(params: ListParams, keyState?: number) {
    params['stateKey'] = keyState;
    params['limit'] = 20;
    this.municipeSeraService.getAll(params).subscribe({
      next: data => {
        this.selectMunicipe = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getLocality(params: ListParams, municipalityId?: number, stateKey?: number) {
    params.limit = 20;
    params['municipalityId'] = municipalityId;
    params['stateKey'] = stateKey;
    this.localityService.getAll(params).subscribe({
      next: data => {
        this.selectLocality = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getCP(
    params: ListParams,
    keyTownship?: number,
    keyState?: number,
    keySettlement?: number
  ): any {
    params.limit = 20;
    params['filter.keyTownship'] = `$eq:${keyTownship}`;
    params['filter.keyState'] = `$eq:${keyState}`;
    params['filter.keySettlement'] = `$eq:${keySettlement}`;
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

  getBrand(params: ListParams) {
    const pa = new FilterParams();
    pa.addFilter('id', params.text, SearchFilter.ILIKE);

    this.parameterBrandsService.getAll(pa.getParams()).subscribe({
      next: resp => {
        this.selectBrand = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getSubBrand(params: ListParams, brandId?: string) {
    const idBrand = brandId ? brandId : this.brandId;
    const pa = new FilterParams();
    pa.limit = 20;
    pa.addFilter('idBrand', idBrand);
    pa.addFilter('idSubBrand', params.text, SearchFilter.ILIKE);

    this.parameterSubBrandsService.getAll(pa.getParams()).subscribe({
      next: resp => {
        this.selectSubBrand = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getTypeUseBoat(event: any) {
    //mis cambios
  }

  getTypeAirplane(event: any) {}

  getTypeUseAirCrafte(event: any) {}

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
          this.domicileForm.controls['statusKey'].setValue(data.id);
        },
        /*error: error => {
          console.log(error);
        },*/
      });
    }
  }

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

  displayTypeTapInformation(typeRelevantId: number) {
    switch (typeRelevantId) {
      case 1:
        this.getGoodEstateTab();
        this.getGoodEstate();
        this.immovablesAssets = true;
        break;
      case 2:
        this.carsAssets = true;
        break;
      case 3:
        this.boatAssets = true;
        break;
      case 4:
        this.aircraftAssets = true;
        break;
      case 5:
        this.jewelerAssets = true;
        break;
      default:
        this.immovablesAssets = false;
        this.carsAssets = false;
        this.boatAssets = false;
        this.aircraftAssets = false;
        this.jewelerAssets = false;
        break;
    }
  }

  async save(): Promise<void> {
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
        await this.saveGoodDomicilie();
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

  saveDomicilieGood(domicilie: IDomicilies) {
    return new Promise((resolve, reject) => {
      domicilie.id = Number(domicilie.id);
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

  saveGoodDomicilie() {
    return new Promise((resolve, reject) => {
      this.goodDomicilieForm.controls['addressId'].setValue(
        this.domicileForm.controls['id'].value
      );
      this.goodDomicilieForm.controls['creationDate'].setValue(
        new Date().toISOString()
      );
      this.goodDomicilieForm.controls['modificationDate'].setValue(
        new Date().toISOString()
      );
      const username = this.authService.decodeToken().preferred_username;
      this.goodDomicilieForm.controls['userCreation'].setValue(username);
      this.goodDomicilieForm.controls['userModification'].setValue(username);

      var domicilie = this.goodDomicilieForm.getRawValue();
      var action = null;
      if (domicilie.id === null) {
        domicilie.id = this.detailAssets.controls['id'].value;
        action = this.goodEstateService.create(domicilie);
      } else {
        action = this.goodEstateService.update(domicilie.id, domicilie);
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
        var value = resp;
        this.getStateOfRepublic(new ListParams(), value.statusKey);
        //this.domicileForm.controls['statusKey'].setValue(value.statusKey);
        this.domicileForm.patchValue(value);
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
        this.stateOfRepId = data;
        this.getMunicipaly(new ListParams(), data);
      }
    });

    this.domicileForm.controls['municipalityKey'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          var stateKey =
            this.request !== undefined
              ? this.request.keyStateOfRepublic
              : this.domicileForm.controls['statusKey'].value;

          this.municipalityId = data;
          this.getLocality(new ListParams(), data, stateKey);
        }
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.getCP(
            new ListParams(),
            this.municipalityId,
            this.stateOfRepId,
            Number(data)
          );
        }
      }
    );
  }

  getGoodEstate() {
    if (this.detailAssets.controls['id'].value !== null) {
      const id = this.detailAssets.controls['id'].value;
      this.goodEstateService.getById(id).subscribe({
        next: resp => {
          console.log(resp);
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

  setGoodDomicilieSelected(domicilie: IDomicilies) {
    this.detailAssets.controls['addressId'].setValue(Number(domicilie.id));
    this.getStateOfRepublic(new ListParams(), domicilie.statusKey);
    //this.domicileForm.controls['statusKey'].setValue(res.statusKey);
    this.domicileForm.patchValue(domicilie);

    this.domicileForm.controls['municipalityKey'].setValue(
      domicilie.municipalityKey
    );
  }
}
