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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodAddress } from 'src/app/core/models/good/good-address';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import {
  NUMBERS_PATTERN,
  NUMBERS_POINT_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AuthService } from '../../../../../../core/services/authentication/auth.service';
import { GoodDomiciliesService } from '../../../../../../core/services/good/good-domicilies.service';
import { BasePage } from '../../../../../../core/shared/base-page';
import { CopyAddressComponent } from '../records-of-request-child-tabs-components/copy-address/copy-address.component';

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
  @Input() process: string = '';
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
  isAddress: boolean = false;

  stateOfRepublicService = inject(StateOfRepublicService);
  municipalySeraService = inject(MunicipalityService);
  localityService = inject(LocalityService);
  goodsQueryService = inject(GoodsQueryService);
  goodDomicileService = inject(GoodDomiciliesService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  goodsinvService = inject(GoodsInvService);

  constructor(
    private fb: FormBuilder,
    private modelRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    if (this.isNewAddress === false) {
      this.initForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject != undefined) {
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (this.isNewAddress != true) {
      this.container.createEmbeddedView(this.template);
    }
    if (this.process === 'process-approval') {
      this.domicileForm.disable();
    }
    this.formReactiveCalls();
    if (this.requestObject != undefined) {
      this.getDomicileTransferent(this.requestObject.id);
      this.getStateOfRepublic(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      );
    }
  }

  initForm() {
    this.domicileForm = this.fb.group({
      warehouseAlias: [
        'DOMICILIO TRANSFERENTE',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      wayref2Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayref3Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      statusKey: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      municipalityKey: [null],
      localityKey: [null],
      code: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(6)],
      ],
      latitude: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.maxLength(30)],
      ],
      length: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.maxLength(30)],
      ], //por cambiar
      wayName: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      wayOrigin: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      exteriorNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      interiorNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
      wayDestiny: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      wayref1Key: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      wayChaining: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      regionalDelegationId: [null],
      requestId: [null],
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
      // this.getStateOfRepublic(new ListParams());
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
            console.log(this.domicileForm.value);
          },
          error: error => {},
        });
      }
    } else {
      if (this.isNewAddress === true) {
        this.stateOfRepublicService.getAll(params).subscribe({
          next: data => {
            this.selectState = new DefaultSelect(data.data, data.count);
          },
          error: error => {},
        });
      }
    }
  }

  //obtener los municipios
  getMunicipaly(params: ListParams, stateKey?: number) {
    params['filter.stateKey'] = `$eq:${this.keyStateOfRepublic}`;
    params['filter.nameMunicipality'] = `$ilike:${params.text}`;
    // params.limit = 9;
    this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
      next: resp => {
        console.log(this.municipalityId);
        if (this.municipalityId !== 0) {
          const newParams = {
            ...params,
            'filter.municipalityKey': `$eq:${this.municipalityId}`,
          };
          this.goodsinvService.getAllMunipalitiesByFilter(newParams).subscribe({
            next: response => {
              console.log(response);
              this.selectMunicipe = new DefaultSelect(
                response.data
                  ? response.data[0]
                    ? [
                        response.data[0],
                        ...resp.data.filter(
                          (item: any) =>
                            item.municipalityKey !== this.municipalityId
                        ),
                      ]
                    : resp.data
                  : resp.data,
                resp.count
              );
            },
            error: err => {
              this.selectMunicipe = new DefaultSelect(resp.data);
            },
          });
        }
        //
        if (this.isAddress === true) {
          this.domicileForm.controls['municipalityKey'].setValue(
            this.municipalityId
          );
        }
      },
    });
    console.log(this.municipalityId);
    // const newParams = { ...params, 'filter.municipalityKey': `$eq:${this.municipalityId}` }
    // this.goodsinvService.getAllMunipalitiesByFilter(newParams).subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
    //       next: resp => {
    //         this.selectMunicipe = new DefaultSelect(resp.data, resp.count);
    //         if (this.isAddress === true) {
    //           this.domicileForm.controls['municipalityKey'].setValue(
    //             this.municipalityId
    //           );
    //         }
    //       },
    //     });
    //   }
    // })
  }

  //obtener la colonia
  getLocality(params: ListParams, municipalityId?: number) {
    params['sortBy'] = 'township:ASC';
    params['filter.municipalityKey'] = `$eq:${Number(this.municipalityId)}`;
    params['filter.stateKey'] = `$eq:${Number(this.keyStateOfRepublic)}`;
    params['filter.township'] = `$ilike:${params.text}`;
    // params.limit = 100;

    this.goodsinvService.getAllTownshipByFilter(params).subscribe({
      next: resp => {
        console.log(this.localityId);
        if (this.localityId !== 0) {
          const newParams = {
            ...params,
            'filter.townshipKey': `$eq:${this.localityId}`,
          };
          this.goodsinvService.getAllTownshipByFilter(newParams).subscribe({
            next: response => {
              console.log(response);
              this.selectLocality = new DefaultSelect(
                response.data
                  ? response.data[0]
                    ? [
                        response.data[0],
                        ...resp.data.filter(
                          (item: any) => item.townshipKey !== this.localityId
                        ),
                      ]
                    : resp.data
                  : resp.data,
                resp.count
              );
            },
            error: err => {
              this.selectLocality = new DefaultSelect(resp.data);
            },
          });
        }
        if (this.isAddress === true) {
          this.domicileForm.controls['localityKey'].setValue(
            Number(this.localityId)
          );
        }
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

  getDomicileTransferent(id: number) {
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${id}`;
    params['filter.warehouseAlias'] = `$eq:DOMICILIO TRANSFERENTE`;
    this.goodDomicileService.getAll(params).subscribe({
      next: (resp: any) => {
        this.isAddress = true;
        this.domicileForm.patchValue(resp.data[0]);
        this.domicileForm.controls['warehouseAlias'].setValue(
          resp.data[0].warehouseAlias['id']
        );
        this.municipalityId = resp.data[0].municipalityKey;
        this.getLocality(new ListParams(), resp.data[0].municipalityKey);
        this.localityId = resp.data[0].localityKey;
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
    if (this.isNewAddress === false) {
      domicile.requestId = this.requestObject.id;
      domicile.regionalDelegationId = this.requestObject.regionalDelegationId;
    }

    this.goodDomicileService.create(domicile).subscribe(
      (data: any) => {
        if (data.id != null) {
          this.message(
            'success',
            'Guadado',
            'El domicio se guardó correctamente'
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
        this.onLoadToast('error', 'Alias Almacen', `${error.error.message}`);
        this.message('error', 'Error', error.getMessage());
      }
    );
  }

  formReactiveCalls() {
    this.domicileForm.controls['statusKey'].valueChanges.subscribe(
      (data: any) => {
        console.log('changed');
        this.keyStateOfRepublic = Number(data);
        this.getMunicipaly(new ListParams(), data);
      }
    );

    this.domicileForm.controls['municipalityKey'].valueChanges.subscribe(
      (data: any) => {
        this.municipalityId = data;

        if (this.isAddress === false) {
          this.getLocality(new ListParams(), data);
        }
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
        this.localityId = data;
        this.getCP(new ListParams());
      }
    );
  }

  copyAddress() {
    let idDelegation = this.domicileForm.get('regionalDelegationId').value;
    let config = {
      ...MODAL_CONFIG,
      class: 'modalSizeXL modal-dialog-centered',
    };
    config.initialState = {
      idDelegation,
      callback: (data: any) => {
        if (data) {
          this.setInformation(data);
        }
      },
    };

    const searchUser = this.modalService.show(CopyAddressComponent, config);
  }

  setInformation(data: IGoodAddress) {
    this.domicileForm.get('warehouseAlias').setValue(data?.warehouseAliasName);
    this.domicileForm.get('statusKey').setValue(data?.statusKey);
    this.domicileForm.get('municipalityKey').setValue(data?.municipalityKey);
    this.domicileForm.get('localityKey').setValue(Number(data?.localityKey));
    this.domicileForm.get('code').setValue(data?.code);
    this.domicileForm.get('latitude').setValue(data?.latitude);
    this.domicileForm.get('length').setValue(data?.latitude);
    this.domicileForm.get('wayName').setValue(data?.wayName);
    this.domicileForm.get('wayOrigin').setValue(data?.wayOrigin);
    this.domicileForm.get('wayref1Key').setValue(data?.wayref1Key);
    this.domicileForm.get('wayref2Key').setValue(data?.wayref2Key);
    this.domicileForm.get('wayref3Key').setValue(data?.wayref3Key);
    this.domicileForm.get('exteriorNumber').setValue(data?.exteriorNumber);
    this.domicileForm.get('interiorNumber').setValue(data?.interiorNumber);
    this.domicileForm.get('wayDestiny').setValue(data?.wayDestiny);
    this.domicileForm.get('description').setValue(data?.description);
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
