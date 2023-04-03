import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  municipalityId: number = 0;
  keyStateOfRepublic: number = 0;
  localityId: number = 0;
  public event: EventEmitter<any> = new EventEmitter();

  selectState = new DefaultSelect<any>();
  selectMunicipe = new DefaultSelect<any>();
  selectLocality = new DefaultSelect<any>();
  selectCP = new DefaultSelect<any>();

  regDelegationId: string = '';
  requestId: string = '';
  isNewAddress: boolean = false;
  isreadOnly: boolean = true;

  stateKey: string = '';

  stateOfRepublicService = inject(StateOfRepublicService);
  municipalySeraService = inject(MunicipalityService);
  localityService = inject(LocalityService);
  goodsQueryService = inject(GoodsQueryService);
  goodDomicileService = inject(GoodDomiciliesService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  goodsinvService = inject(GoodsInvService);

  constructor(private fb: FormBuilder, private modelRef: BsModalRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject != undefined) {
      this.domicileForm.controls['requestId'].setValue(this.requestObject.id);
      this.domicileForm.controls['regionalDelegationId'].setValue(
        this.requestObject.regionalDelegationId
      );
      this.getStateOfRepublic(
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
    console.log('address');
  }

  initForm() {
    this.domicileForm = this.fb.group({
      warehouseAlias: ['DOMICILIO TRANSFERENTE'],
      wayref2Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayref3Key: [
        null,
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
        null,
        [(Validators.pattern(STRING_PATTERN), Validators.maxLength(6))],
      ],
      latitude: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      length: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ], //por cambiar
      wayName: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayOrigin: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      exteriorNumber: [
        null,
        [(Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10))],
      ],
      interiorNumber: [
        null,
        [(Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10))],
      ],
      wayDestiny: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayref1Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayChaining: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      regionalDelegationId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      requestId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      creationDate: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      userCreation: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });

    if (this.isNewAddress === true) {
      this.isreadOnly = false;
      //actualizar los campos
      this.domicileForm.controls['requestId'].setValue(this.requestId);
      this.domicileForm.controls['regionalDelegationId'].setValue(
        this.regDelegationId
      );
      this.domicileForm.controls['warehouseAlias'].setValue('');
      this.getStateOfRepublic(new ListParams());
    }
  }

  //obtener el estado de la republic por defecto
  getStateOfRepublic(params: ListParams, keyState?: number) {
    if (keyState != null) {
      if (this.isNewAddress === false) {
        this.stateOfRepublicService.getById(keyState).subscribe({
          next: data => {
            this.keyStateOfRepublic = Number(data.id);
            this.selectState = new DefaultSelect([data], 1);
            this.domicileForm.controls['statusKey'].setValue(keyState);
          },
          error: error => {
            console.log(error);
          },
        });
      }
    } else {
      if (this.isNewAddress === true) {
        this.stateOfRepublicService.getAll(params).subscribe({
          next: data => {
            this.selectState = new DefaultSelect(data.data, data.count);
          },
          error: error => {
            console.log(error);
          },
        });
      }
    }
  }

  //obtener los municipios
  getMunicipaly(params: ListParams, stateKey?: number) {
    params['filter.stateKey'] = `$eq:${this.keyStateOfRepublic}`;
    params['filter.nameMunicipality'] = `$ilike:${params.text}`;

    this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
      next: resp => {
        this.selectMunicipe = new DefaultSelect(resp.data, resp.count);
      },
    });
    /* this.municipalySeraService.getAll(params).subscribe({
      next: data => {
        this.selectMunicipe = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
      },
    }); */
  }

  //obtener la colonia
  getLocality(params: ListParams, municipalityId?: number) {
    //params.limit = 20;
    params['filter.municipalityKey'] = `$eq:${Number(this.municipalityId)}`;
    params['filter.stateKey'] = `$eq:${Number(this.keyStateOfRepublic)}`;
    params['filter.township'] = `$ilike:${params.text}`;

    this.goodsinvService.getAllTownshipByFilter(params).subscribe({
      next: resp => {
        this.selectLocality = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  //obtener el codigo zip
  getCP(params: ListParams, localityId?: number, municipalityId?: number) {
    params.limit = 20;
    params['filter.townshipKey'] = `$eq:${this.localityId}`; //localidad
    params['filter.municipalityKey'] = `$eq:${this.municipalityId}`; //municipio
    params['filter.stateKey'] = `$eq:${this.keyStateOfRepublic}`; //estado de la republica
    this.goodsinvService.getAllCodePostalByFilter(params).subscribe({
      next: resp => {
        this.selectCP = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  saveAddres() {
    //guardar el formulario para que se carge en el modal anterior
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

          if (this.isNewAddress === true) {
            this.modelRef.content.callback(true);
            this.close();
          }
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
    this.domicileForm.controls['statusKey'].valueChanges.subscribe(
      (data: any) => {
        this.keyStateOfRepublic = Number(data);
        this.getMunicipaly(new ListParams(), data);
      }
    );

    this.domicileForm.controls['municipalityKey'].valueChanges.subscribe(
      (data: any) => {
        this.municipalityId = data;
        this.getLocality(new ListParams(), data);
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
        this.localityId = data;
        this.getCP(new ListParams());
      }
    );
  }

  close() {
    this.modelRef.hide();
  }

  /*returnResponse() {
    this.event.emit();
  }*/

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
