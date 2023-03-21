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
import { IFormGroup } from 'src/app/core/interfaces/model-form';
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
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { RealStateService } from 'src/app/core/services/ms-good/real-state.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { ParameterSubBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-sub-brands.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  @Input() detailAssets: IFormGroup<any>; // bienes ModelForm
  @Input() domicilieObject: IDomicilies; // domicilio del bien
  @Input() typeDoc: any;
  bsModalRef: BsModalRef;
  request: IRequest;
  stateOfRepId: number = null;
  municipalityId: number = null;

  goodDomicilieForm: IFormGroup<IGoodRealState>; // bien inmueble
  domicileForm: IFormGroup<IDomicilies>; //domicilio del bien
  assetsForm: IFormGroup<any>; //borrar

  selectSae = new DefaultSelect<any>();
  selectConservationState = new DefaultSelect<any>();

  goodTypeName: string = '';
  duplicity: boolean = false;
  armor: boolean = false;
  destinyLigie: string = '';
  addressId: number = null;
  bsEvaluoDate: any;
  brandId: string = '';
  circulate: boolean = false;
  circulateString: string = 'N';
  theftReport: boolean = false;
  theftReportString: string = 'N';
  complyNorm: boolean = false;
  complyNormString: string = 'N';
  appraisal: boolean = false;
  appraisalString = 'N';

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

  constructor(private fb: FormBuilder, private modalServise: BsModalService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc === 'clarification') {
      console.log(changes['detailAssets'].currentValue);
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
    }

    //revisa si el formulario de bienes contiene el id del tipo de bien
    if (this.detailAssets.controls['goodTypeId'].value != null) {
      const data = this.detailAssets.controls['goodTypeId'].value;
      this.getTypeGood(this.detailAssets.controls['goodTypeId'].value);
      this.displayTypeTapInformation(Number(data));
    }
  }

  ngOnInit(): void {
    this.initForm();
    console.log('tipo de bien');
    console.log(this.typeDoc);
    console.log(this.detailAssets);
    this.getDestinyTransfer(new ListParams());
    this.getPhysicalState(new ListParams());
    this.getConcervationState(new ListParams());
    this.getTransferentUnit(new ListParams());
    this.getReactiveFormCall();
    this.isSavingData();

    //.getGoodDomicilieTab();
    if (
      this.requestObject != undefined &&
      this.detailAssets.controls['addressId'].value === null
    ) {
      this.domicileForm.controls['requestId'].setValue(this.requestObject.id);
      /* this.domicileForm.controls['regionalDelegationId'].setValue(
        this.requestObject.regionalDelegationId
      ); */
      /*  this.getStateOfRepublic(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      );
      this.getMunicipaly(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      ); */
    }

    //console.log('detalle del objeto enviado');

    //this.initInputs();
  }

  initForm() {
    //formulario de domicilio
    this.domicileForm = this.fb.group({
      id: [null],
      warehouseAlias: [],
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
      propertyType: [null, [Validators.required]],
      surfaceMts: [0, [Validators.required]],
      consSurfaceMts: [0, [Validators.required]],
      publicDeed: [null, [Validators.required]],
      pubRegProperty: [null, [Validators.required]],
      appraisalValue: [0, [Validators.required]],
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
      forProblems: [null, [Validators.required]],
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

  getMunicipaly(params: ListParams, keyState?: number) {
    params['filter.stateKey'] = `$eq:${keyState}`;
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
    params['filter.municipalityId'] = `$eq:${municipalityId}`;
    params['filter.stateKey'] = `$eq:${stateKey}`;
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

  getTransferentUnit(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.goodsInvService.getCatUnitMeasureView(params).subscribe({
      next: resp => {
        console.log(resp);
        this.selectTansferUnitMeasure = new DefaultSelect(
          resp.data,
          resp.count
        );
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
          this.domicileForm.controls['statusKey'].setValue(Number(data.id));
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

  displayTypeTapInformation(typeRelevantId: number) {
    switch (typeRelevantId) {
      case 1:
        this.getGoodEstateTab();
        this.getGoodEstate();
        this.immovablesAssets = true;
        this.carsAssets = false;
        this.boatAssets = false;
        this.aircraftAssets = false;
        this.jewelerAssets = false;
        this.otherAssets = false;
        break;
      case 2:
        this.carsAssets = true;
        this.immovablesAssets = false;
        this.boatAssets = false;
        this.aircraftAssets = false;
        this.jewelerAssets = false;
        this.otherAssets = false;
        break;
      case 3:
        this.boatAssets = true;
        this.immovablesAssets = false;
        this.carsAssets = false;
        this.aircraftAssets = false;
        this.jewelerAssets = false;
        this.otherAssets = false;
        break;
      case 4:
        this.aircraftAssets = true;
        this.immovablesAssets = false;
        this.carsAssets = false;
        this.boatAssets = false;
        this.jewelerAssets = false;
        this.otherAssets = false;
        break;
      case 5:
        this.jewelerAssets = true;
        this.immovablesAssets = false;
        this.carsAssets = false;
        this.boatAssets = false;
        this.aircraftAssets = false;
        this.otherAssets = false;
        break;
      case 8:
        this.otherAssets = true;
        this.immovablesAssets = false;
        this.carsAssets = false;
        this.boatAssets = false;
        this.aircraftAssets = false;
        this.jewelerAssets = false;
        break;
      default:
        this.immovablesAssets = false;
        this.carsAssets = false;
        this.boatAssets = false;
        this.aircraftAssets = false;
        this.jewelerAssets = false;
        this.otherAssets = false;
        break;
    }
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
      console.log(domicilio);

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

  setGoodDomicilieSelected(domicilie: IDomicilies) {
    this.detailAssets.controls['addressId'].setValue(Number(domicilie.id));
    this.getStateOfRepublic(new ListParams(), domicilie.statusKey);
    this.domicileForm.patchValue(domicilie);

    this.domicileForm.controls['municipalityKey'].setValue(
      domicilie.municipalityKey
    );
  }
}
