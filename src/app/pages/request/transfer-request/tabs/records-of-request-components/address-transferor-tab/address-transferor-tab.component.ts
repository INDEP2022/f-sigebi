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
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
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
  combineMunicipalityId = true;
  keyStateOfRepublic: number = 0;
  localityId: number = 0;
  combineLocalityId = true;
  code: string = '0';
  combineCode = true;
  public event: EventEmitter<any> = new EventEmitter();
  countMunicipaly: number;

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
  haveData: boolean = false;

  stateOfRepublicService = inject(StateOfRepublicService);
  municipalySeraService = inject(MunicipalityService);
  localityService = inject(LocalityService);
  goodsQueryService = inject(GoodsQueryService);
  goodDomicileService = inject(GoodDomiciliesService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  goodsinvService = inject(GoodsInvService);
  aliasStoreService = inject(StoreAliasStockService);

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
      this.haveData = true;
      this.getDomicileTransferent(this.requestObject.id);
      this.getStateOfRepublic(
        new ListParams(),
        this.requestObject.keyStateOfRepublic
      );
    }

    this.domicileForm.get('municipalityKey').valueChanges.subscribe(res => {
      if (res === null) {
      }
    });
  }

  initForm() {
    this.domicileForm = this.fb.group({
      id: [null],
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
            // console.log(this.domicileForm.value);
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
    if (this.keyStateOfRepublic === null) {
      // console.log(this.domicileForm.value);
      return;
    }
    // debugger;
    if (this.countMunicipaly !== undefined) {
      params.limit = this.countMunicipaly;
    }
    params['sortBy'] = 'municipality:ASC';
    params['filter.stateKey'] = `$eq:${this.keyStateOfRepublic}`;
    params['filter.municipality'] = `$ilike:${params.text}`;
    if (this.haveData === true) {
      params.limit = 50;
    }
    this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
      next: resp => {
        this.selectMunicipe = new DefaultSelect(resp.data, resp.count);

        /*    if (this.municipalityId !== 0 && this.municipalityId !== null) {
          if (this.combineMunicipalityId) {
            const newParams = {
              ...params,
              'filter.municipalityKey': `$eq:${this.municipalityId}`,
            };
            this.goodsinvService
              .getAllMunipalitiesByFilter(newParams)
              .subscribe({
                next: response => {
                  // console.log(response);
                  const newData = resp.data.filter(
                    (item: any) =>
                      item.municipalityKey + '' !== this.municipalityId + ''
                  );
                  if (response.data && response.data[0]) {
                    newData.unshift(response.data[0]);
                  }
                  this.selectMunicipe = new DefaultSelect(newData, resp.count);
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
                (item: any) => item.municipalityKey !== this.municipalityId
              ),
              resp.count
            );
          }
        } else {
          this.selectMunicipe = new DefaultSelect(resp.data);
        }
        //
        if (this.isAddress === true) {
          this.domicileForm.controls['municipalityKey'].setValue(
            this.municipalityId
          );
        } */
      },
    });
  }

  getCountMunicipaly(params: ListParams) {
    this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
      next: resp => {
        this.countMunicipaly = resp.count;
      },
      error: err => {
        this.countMunicipaly = undefined;
      },
    });
  }

  nullMunicipaly() {
    if (this.domicileForm.get('municipalityKey').value === null) {
      this.getMunicipaly(
        new ListParams(),
        this.domicileForm.get('statusKey').value
      );
    }
  }

  //obtener la colonia
  getLocality(params: ListParams, municipalityId?: number) {
    // debugger;
    if (this.municipalityId === null || this.keyStateOfRepublic === null) {
      // console.log(this.domicileForm.value);

      return;
    }
    params['sortBy'] = 'township:ASC';
    params['filter.municipalityKey'] = `$eq:${Number(this.municipalityId)}`;
    params['filter.stateKey'] = `$eq:${Number(this.keyStateOfRepublic)}`;
    params['filter.township'] = `$ilike:${params.text}`;
    this.goodsinvService.getAllTownshipByFilter(params).subscribe({
      next: resp => {
        // debugger;
        if (this.localityId !== 0 && this.localityId !== null) {
          if (this.combineLocalityId) {
            const newParams = {
              ...params,
              'filter.townshipKey': `$eq:${this.localityId}`,
            };
            this.goodsinvService.getAllTownshipByFilter(newParams).subscribe({
              next: response => {
                console.log(response);
                // debugger;
                const newData = resp.data.filter(
                  (item: any) => item.townshipKey + '' !== this.localityId + ''
                );
                if (response.data && response.data[0]) {
                  newData.unshift(response.data[0]);
                }
                this.selectLocality = new DefaultSelect(newData, resp.count);
                this.combineLocalityId = false;
              },
              error: err => {
                this.selectLocality = new DefaultSelect(resp.data, resp.count);
              },
            });
          } else {
            this.selectLocality = new DefaultSelect(
              resp.data.filter(
                (item: any) => item.townshipKey + '' !== this.localityId + ''
              ),
              resp.count
            );
          }
        } else {
          this.selectLocality = new DefaultSelect(resp.data, resp.count);
        }
        // console.log(this.localityId);
        if (this.isAddress === true && this.localityId) {
          this.domicileForm.controls['localityKey'].setValue(
            Number(this.localityId)
          );
        }
      },
    });
  }

  //obtener el codigo zip
  getCP(params: ListParams, localityId?: number, municipalityId?: number) {
    // params.limit = 20;
    if (
      this.localityId === null ||
      this.municipalityId === null ||
      this.keyStateOfRepublic === null
    ) {
      return;
    }
    params['filter.townshipKey'] = `$eq:${this.localityId}`; //localidad
    params['filter.municipalityKey'] = `$eq:${this.municipalityId}`; //municipio
    params['filter.stateKey'] = `$eq:${this.keyStateOfRepublic}`; //estado de la republica
    this.goodsinvService.getAllCodePostalByFilter(params).subscribe({
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
            /* this.goodsinvService.getAllCodePostalByFilter(newParams).subscribe({
              next: response => {
                const newData = resp.data.filter(
                  (item: any) => item.postalCode + '' !== this.code + ''
                );
                if (response.data && response.data[0]) {
                  newData.unshift(response.data[0]);
                }
                this.selectCP = new DefaultSelect(newData, resp.count);
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

  getDomicileTransferent(id: number) {
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${id}`;
    params['filter.warehouseAlias'] = `$eq:DOMICILIO TRANSFERENTE`;
    this.goodDomicileService.getAll(params).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.isAddress = true;
        this.domicileForm.patchValue(resp.data[0]);
        this.domicileForm.controls['warehouseAlias'].setValue(
          resp.data[0].warehouseAlias['id']
        );
        this.municipalityId = resp.data[0].municipalityKey;
        // this.cp
        this.getLocality(new ListParams(), resp.data[0].municipalityKey);
        this.localityId = resp.data[0].localityKey;
        this.code = resp.data[0].code;
      },
    });
  }

  async saveAddres() {
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

    //crea un alias en el almacen
    let alias = null;
    if (this.isNewAddress === true) {
      let aliasStore: any = {};
      aliasStore.aliasStock = domicile.warehouseAlias;
      aliasStore.userCreation = username;
      aliasStore.dateCreation = new Date().toISOString();
      aliasStore.version = '1.0';
      alias = await this.createAliasStock(aliasStore);
    }

    if (!domicile.id) {
      this.createAddress(domicile);
    } else {
      this.updateAddress(domicile);
    }
  }

  createAddress(domicile: any) {
    this.goodDomicileService.create(domicile).subscribe(
      (data: any) => {
        if (data.id != null) {
          this.domicileForm.controls['id'].setValue(data.id);
          this.message(
            'success',
            'Guadado',
            'El domicilio se guardó correctamente'
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

  updateAddress(domicile: any) {
    this.goodDomicileService.update(domicile.id, domicile).subscribe(
      (data: any) => {
        if (data.id != null) {
          this.message(
            'success',
            'Guadado',
            'El domicilio se actualizó correctamente'
          );

          if (this.isNewAddress === true) {
            this.modelRef.content.callback(true);
            this.close();
          }
        } else {
          this.message(
            'error',
            'Error al actualizár',
            'no se puedo actualizár el domicilio'
          );
          return;
        }
      },
      error => {
        //this.onLoadToast('error', 'Alias Almacen', `${error.error.message}`);
        this.message('error', 'Error', error.getMessage());
      }
    );
  }

  createAliasStock(aliasStock: any) {
    return new Promise((resolve, reject) => {
      this.aliasStoreService.create(aliasStock).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          resolve(false);
          console.log(error);
          this.onLoadToast('error', 'Alias Almacen', `${error.error.message}`);
        },
      });
    });
  }

  formReactiveCalls() {
    this.getCountMunicipaly(new ListParams());
    this.domicileForm.controls['statusKey'].valueChanges.subscribe(
      (data: any) => {
        this.keyStateOfRepublic = Number(data);
        this.selectMunicipe = new DefaultSelect([]);
        this.domicileForm.get('municipalityKey').setValue(null);
        this.getMunicipaly(new ListParams(), data);
      }
    );

    this.domicileForm.controls['municipalityKey'].valueChanges.subscribe(
      (data: any) => {
        // debugger;
        // console.log(data);
        if (data === null) {
          this.combineMunicipalityId = true;
        }
        this.municipalityId = data;
        this.selectLocality = new DefaultSelect([]);
        this.domicileForm.get('localityKey').setValue(null);
        // if (this.isAddress === false) {
        this.getLocality(new ListParams(), data);
        // }
      }
    );
    this.domicileForm.controls['localityKey'].valueChanges.subscribe(
      (data: any) => {
        if (data === null) {
          this.combineLocalityId = true;
          this.domicileForm.get('code').setValue(null);
        }
        this.localityId = data;
        /* this.selectCP = new DefaultSelect([]); */
        /* this.domicileForm.get('code').setValue(null); */
        // console.log(this.localityId);
        this.getCP(new ListParams());
      }
    );
    this.domicileForm.controls['code'].valueChanges.subscribe((data: any) => {
      if (data === null) {
        this.combineCode = true;
      }
      this.code = data;
    });
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
          console.log('dom', data);
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
    console.log('aqui setea');
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
