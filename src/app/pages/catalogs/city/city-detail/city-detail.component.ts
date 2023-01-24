import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CityService } from '../../../../core/services/catalogs/city.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styles: [],
})
export class CityDetailComponent extends BasePage implements OnInit {
  cityForm: ModelForm<ICity>;
  city: ICity;
  title: string = 'Catálogos de Ciudades';
  edit: boolean = false;

  @Output() refresh = new EventEmitter<true>();

  public get state() {
    return this.cityForm.get('state');
  }

  public get noRegister() {
    return this.cityForm.get('noRegister');
  }

  public get id() {
    return this.cityForm.get('idSafe');
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.cityForm = this.fb.group({
      idCity: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
      nameCity: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      state: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      noDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
      noSubDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
      legendOffice: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noRegister: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
    });

    if (this.city != null) {
      this.edit = true;
      console.log(this.city);
      this.cityForm.patchValue(this.city);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.cityService.create(this.cityForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.loading = true;
    this.cityService.update(this.city.idCity, this.cityForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
