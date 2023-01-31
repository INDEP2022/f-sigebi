import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AuthService } from '../../../../../../core/services/authentication/auth.service';
import { GoodDomiciliesService } from '../../../../../../core/services/good/good-domicilies.service';
import { BasePage } from '../../../../../../core/shared/base-page';

@Component({
  selector: 'app-address-transferor-tab',
  templateUrl: './address-transferor-tab.component.html',
  styles: [],
})
export class AddressTransferorTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestObject: any;
  @ViewChild('myTemplate', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTemplate', { static: true, read: ViewContainerRef })
  container: ViewContainerRef;
  //addressForm: ModelForm<any>;
  domicileForm: ModelForm<any>;
  stateOfRepublicName: string = '';
  municipalityId: number = 0;

  selectMunicipe = new DefaultSelect<any>();
  selectLocality = new DefaultSelect<any>();
  selectCP = new DefaultSelect<any>();

  isNewAddress: boolean = false;

  stateOfRepublicService = inject(StateOfRepublicService);
  municipalySeraService = inject(MunicipalityService);
  localityService = inject(LocalityService);
  goodsQueryService = inject(GoodsQueryService);
  goodDomicileService = inject(GoodDomiciliesService);
  authService = inject(AuthService);

  constructor(private fb: FormBuilder, private modelRef: BsModalRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject != undefined) {
      this.domicileForm.controls['requestId'].setValue(this.requestObject.id);
      this.domicileForm.controls['regionalDelegationId'].setValue(
        this.requestObject.regionalDelegationId
      );
      this.getStateOfRepublic(this.requestObject.keyStateOfRepublic);
      this.getMunicipaly(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      );
    }
  }

  ngOnInit(): void {
    if (this.isNewAddress != true) {
      this.container.createEmbeddedView(this.template);
    }
    this.initForm();
    this.formReactiveCalls();
  }

  initForm() {
    this.domicileForm = this.fb.group({
      warehouseAlias: ['DOMICILIO TRANSFERENTE'],
      wayref2Key: [null],
      wayref3Key: [null],
      statusKey: [null],
      municipalityKey: [null],
      localityKey: [null],
      code: [null],
      latitude: [null],
      length: [null], //por cambiar
      wayName: [null],
      wayOrigin: [null],
      exteriorNumber: [null],
      interiorNumber: [null],
      wayDestiny: [null],
      wayref1Key: [null],
      wayChaining: [null],
      description: [null],
      regionalDelegationId: [null],
      requestId: [null],
      creationDate: [null],
      userCreation: [null],
    });

    /*this.addressForm = this.fb.group({
      aliasWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      referenceVia2: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      referenceVia3: [null, [Validators.pattern(STRING_PATTERN)]],
      municipe: [null],
      suburb: [null],
      cp: [null],
      longitud: [null, [Validators.pattern(STRING_PATTERN)]],
      latitud: [null, [Validators.pattern(STRING_PATTERN)]],
      nameRoute: [null, [Validators.pattern(STRING_PATTERN)]],
      numExt: [null],
      originRoute: [null, [Validators.pattern(STRING_PATTERN)]],
      numInt: [null],
      routeDestination: [null, [Validators.pattern(STRING_PATTERN)]],
      referenceVia1: [null, [Validators.pattern(STRING_PATTERN)]],
      kilometerRoute: [null],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
    });*/

    if (this.isNewAddress != true) {
      this.domicileForm.controls['warehouseAlias'].disable();
      this.domicileForm.controls['warehouseAlias'].setValue(
        'DOMICILIO TRANSFERENTE'
      );
      //set la ciudad actual
      //this.domicileForm.get('cveState').patchValue('');
      //this.domicileForm.controls['cveState'].disable();
    }
  }

  //obtener el estado de la republic por defecto
  getStateOfRepublic(keyState: number) {
    if (keyState != null) {
      this.domicileForm.controls['statusKey'].setValue(keyState);
      this.stateOfRepublicService.getById(keyState).subscribe({
        next: data => {
          this.stateOfRepublicName = data.descCondition;
        },
        error: error => {
          console.log(error);
        },
      });
    }
  }

  //obtener los municipios
  getMunicipaly(params: ListParams, stateKey?: number) {
    params['stateKey'] = stateKey;
    params['limit'] = 20;
    this.municipalySeraService.getAll(params).subscribe({
      next: data => {
        this.selectMunicipe = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  //obtener la colonia
  getLocality(params: ListParams, municipalityId?: number) {
    params.limit = 20;
    params['municipalityId'] = municipalityId;
    params['stateKey'] = this.requestObject.keyStateOfRepublic;
    this.localityService.getAll(params).subscribe({
      next: data => {
        this.selectLocality = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  //obtener el codigo zip
  getCP(params: ListParams, localityId?: number, municipalityId?: number) {
    params.limit = 20;
    //params['filter.keySettlement'] = `$eq:${localityId}`; //localidad
    params['filter.keyTownship'] = `$eq:${municipalityId}`; //municipio
    params['filter.keyState'] = `$eq:${this.requestObject.keyStateOfRepublic}`; //estado de la republica
    this.goodsQueryService.getZipCode(params).subscribe({
      next: data => {
        debugger;
        this.selectCP = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  saveAddres() {
    //guardar el formulario para que se carge en el modal anterior
    console.log(this.domicileForm.getRawValue());
    this.domicileForm.controls['creationDate'].setValue(
      new Date().toISOString()
    );
    const username = this.authService.decodeToken().preferred_username;
    this.domicileForm.controls['userCreation'].setValue(username);

    const domicile = this.domicileForm.getRawValue();
    this.goodDomicileService.create(domicile).subscribe(
      (data: any) => {
        if (data.id != null) {
          this.message(
            'success',
            'Guadado',
            'El domicio se guardo correctamente'
          );
        } else {
          this.message(
            'error',
            'Error al guardar',
            'no se puedo guardar el domicilio'
          );
          return;
        }
      },
      error => {
        console.log(error);
        this.message('error', 'Error', error.getMessage());
      }
    );
  }

  formReactiveCalls() {
    this.domicileForm.controls['municipalityKey'].valueChanges.subscribe(
      (data: any) => {
        this.municipalityId = data;
        this.getLocality(new ListParams(), data);
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
        this.getCP(new ListParams(), data, this.municipalityId);
      }
    );
  }

  close() {
    this.modelRef.hide();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
