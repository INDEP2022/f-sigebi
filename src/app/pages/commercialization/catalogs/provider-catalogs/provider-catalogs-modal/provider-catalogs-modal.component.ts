import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
    private citiesService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCities({ page: 1, text: '', limit: 1000 });
    this.getStates({ page: 1, text: '', limit: 100 });
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
    });

    this.providerForm.patchValue(this.provider);
    this.providerForm.controls['desCountry'].setValue('MÉXICO');
    this.providerForm.controls['clkCountry'].setValue(138);
  }

  getDescCityAndState() {
    const idState = this.providerForm.get('clkedo').value;
    const state = this.stateItems.data.filter(state => state.id === idState)[0];
    this.providerForm.get('stateDesc').patchValue(state.descCondition);

    const idCity = this.providerForm.get('clkmun').value;
    const city = this.cityItems.data.filter(city => city.idCity === idCity)[0];
    this.providerForm.get('cityDesc').patchValue(city.nameCity);
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
    this.providerService.update(this.provider.providerId, provider).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.showError(error);
        this.loading = false;
      },
    });
  }

  showError(error?: any) {
    this.onLoadToast('error', error.error.message, '');
  }

  getCities(params?: ListParams) {
    this.citiesService.getAll(params).subscribe({
      next: resp => {
        this.cityItems = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStates(params?: ListParams) {
    this.stateService.getAll(params).subscribe({
      next: resp => {
        this.stateItems = new DefaultSelect(resp.data, resp.count);
      },
    });
  }
}
