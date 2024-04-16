import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURP_PATTERN,
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IComerProvider } from '../../../../../core/models/ms-provider/provider-model';
import { ComerProvidersService } from '../../../../../core/services/ms-provider/comer-providers.service';

@Component({
  selector: 'app-provider-catalogs-modal',
  templateUrl: './provider-catalogs-modal.component.html',
  styles: [],
})
export class ProviderCatalogsModalComponent extends BasePage implements OnInit {
  title: string = 'Proveedor';
  provider: IComerProvider;
  edit: boolean = false;
  cityItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  countryItems = new DefaultSelect();
  providerForm: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private providerService: ComerProvidersService,
    private stateService: StateOfRepublicService,
    private citiesService: CityService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getStates(new ListParams());
    this.prepareForm();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      providerId: [null],
      rfc: [
        null,
        [
          Validators.required,
          Validators.pattern(RFC_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      curp: [
        null,
        [
          Validators.required,
          Validators.pattern(CURP_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      nameReason: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      street: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      colony: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      delegation: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      stateDesc: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      cityDesc: [
        null,
        [Validators.maxLength(50), Validators.pattern(STRING_PATTERN)],
      ],
      clkCountry: [null, Validators.pattern(STRING_PATTERN)],
      desCountry: [null],
      clkmun: [null, [Validators.required, Validators.maxLength(3)]],
      clkedo: [null, [Validators.required, Validators.maxLength(2)]],
      cp: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(6)],
      ],
      phone: [null, Validators.pattern(PHONE_PATTERN)],
      fax: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(20)],
      ],
      webMail: [null, Validators.pattern(EMAIL_PATTERN)],
      typePerson: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      preponderantAct: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      contractNo: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      userCreation: [],
    });
    console.log(this.provider);
    if (this.provider) {
      this.providerForm.patchValue(this.provider);
      this.getStatesId(new ListParams(), this.provider.clkedo);
      const params = new ListParams();
      params['filter.state'] = `$eq:${this.provider.clkedo}`;
      this.getCities(params);
      this.getCitiesId(
        new ListParams(),
        this.provider.clkedo,
        this.provider.clkmun
      );
    } else {
      this.getCities(new ListParams());
      this.providerForm.get('clkmun').reset();
      this.providerForm.get('clkmun').disable();
      this.providerForm.get('cityDesc').reset();
    }
    this.providerForm.controls['desCountry'].setValue('México');
    this.providerForm.controls['clkCountry'].setValue(138);
  }

  getDescCityAndState() {
    const { clkedo } = this.providerForm.value;
    this.providerForm.get('stateDesc').patchValue(clkedo.descCondition);

    const { clkmun } = this.providerForm.value;
    this.providerForm.get('cityDesc').patchValue(clkmun.nameCity);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.getDescCityAndState();
    this.edit ? this.update() : this.create();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.onConfirm.emit(true);
    this.modalRef.hide();
  }

  create(): void {
    this.loading = true;
    const provider = { ...this.providerForm.value };
    provider.userCreation = this.authService.decodeToken().preferred_username;
    provider.clkedo = this.providerForm.value.clkedo.id;
    provider.clkmun = this.providerForm.value.clkmun.idCity;
    delete provider.desCountry;
    this.providerService.create(provider).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.showError(error);
        this.loading = false;
      },
    });
  }

  update(): void {
    this.loading = true;
    const provider = { ...this.providerForm.value };
    delete provider.desCountry;
    provider.clkedo = this.providerForm.value.clkedo.id;
    provider.clkmun = this.providerForm.value.clkmun.idCity;
    this.providerService.update(this.provider.providerId, provider).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.showError(error);
        this.loading = false;
      },
    });
  }

  showError(error?: any) {
    this.onLoadToast(
      'error',
      'No se pudo crear el registro',
      error.error.message
    );
  }

  getCities(params?: ListParams) {
    if (this.stateSelected)
      params['filter.state'] = `$eq:${this.stateSelected.id}`;
    this.citiesService.getAll(params).subscribe({
      next: resp => {
        this.cityItems = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.cityItems = new DefaultSelect([], 0);
      },
    });
  }

  getStates(params?: ListParams) {
    this.stateService.getAll(params).subscribe({
      next: resp => {
        this.stateItems = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.stateItems = new DefaultSelect([], 0);
      },
    });
  }
  stateSelected: any;
  selectState(event: any) {
    this.stateSelected = event;
    console.log(event);
    if (event) {
      this.getCities(new ListParams());
      this.providerForm.get('clkmun').reset();
      this.providerForm.get('clkmun').enable();
    } else {
      this.providerForm.get('clkmun').reset();
      this.providerForm.get('clkmun').disable();
      this.providerForm.get('cityDesc').reset();
    }
  }

  getStatesId(params?: ListParams, idState?: any) {
    params['filter.id'] = `$eq:${idState}`;
    this.stateService.getAll(params).subscribe({
      next: resp => {
        this.providerForm.get('clkedo').setValue(resp.data[0]);
        this.stateSelected = resp.data[0];
      },
      error: err => {
        this.providerForm.get('clkedo').reset();
      },
    });
  }
  async getCitiesId(params?: ListParams, idState?: any, id?: any) {
    params['filter.state'] = `$eq:${idState}`;
    params['filter.idCity'] = `$eq:${id}`;
    console.log(params);
    this.citiesService.getAll(params).subscribe({
      next: resp => {
        this.providerForm.get('clkmun').setValue(resp.data[0]);
      },
      error: err => {
        this.providerForm.get('clkmun').reset();
      },
    });
  }

  async rpad(str: any, length: number, padString: any) {
    while (str.length < length) {
      str = str + padString;
    }
    return str;
  }
}
