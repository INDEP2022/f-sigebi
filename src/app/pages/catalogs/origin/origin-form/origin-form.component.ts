import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IOrigin } from 'src/app/core/models/catalogs/origin.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { OriginService } from 'src/app/core/services/catalogs/origin.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';

@Component({
  selector: 'app-origin-form',
  templateUrl: './origin-form.component.html',
  styles: [],
})
export class OriginFormComponent extends BasePage implements OnInit {
  form: ModelForm<IOrigin>;
  title: string = 'Procedencia';
  edit: boolean = false;
  public cities = new DefaultSelect();
  origin: IOrigin;
  origins = new DefaultSelect<IOrigin>();

  transferentSelect = new DefaultSelect();

  @Output() refresh = new EventEmitter<true>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private originService: OriginService,
    private cityService: CityService,
    private transferenteService: TransferenteService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCities(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        null,
        [
          Validators.maxLength(15),
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      idTransferer: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      keyTransferer: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      type: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      address: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(255),
        ],
      ],
      city: [null, [Validators.required]],
      idCity: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      keyEntityFederative: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(15),
        ],
      ],
    });
    if (this.origin != null) {
      this.edit = true;
      let city = this.origin.city;
      this.form.patchValue(this.origin);
      this.form.controls['keyTransferer'].disable();
      this.form.controls['idTransferer'].disable();
      this.form.controls['idCity'].disable();
      this.form.controls['id'].disable();

      //this.form.controls['cityCode'].setValue(city.nameCity);
      //this.form.controls['cityCodeID'].setValue(city.idCity);
      //const { cityCode } = this.origin;
      //this.cities = new DefaultSelect([cityCode.nameCity], 1);
    }
    this.form.controls['keyTransferer'].disable();
    this.form.controls['idCity'].disable();
    setTimeout(() => {
      this.getTransfer(new ListParams());
      this.getCities(new ListParams());
    }, 1000);
  }

  getTransfer(params: ListParams) {
    this.transferenteService.getAll(params).subscribe({
      next: data => {
        console.log(data.data);
        this.transferentSelect = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.transferentSelect = new DefaultSelect([], 0);
        console.log('error', err);
      },
    });
  }

  changeSelect(event: any) {
    console.log(event.keyTransferent);
    this.form.controls['keyTransferer'].setValue(event.keyTransferent);
  }

  getData(params: ListParams) {
    this.originService.getAll(params).subscribe(data => {
      this.origins = new DefaultSelect(data.data, data.count);
    });
  }

  getCities(params: ListParams, id?: string) {
    if (id) {
      params['filter.state'] = `$eq:${id}`;
    }
    this.cityService.getAllCitys(params).subscribe(data => {
      this.cities = new DefaultSelect(data.data, data.count);
    });
    console.log(this.cityService);
  }

  getCitie(data: any) {
    console.log(data);
    this.cities = new DefaultSelect([], 0, true);
    this.form.controls['cityCode'].setValue(null);
    this.getCities(new ListParams(), data.id);
  }

  changeCity(event: any) {
    console.log(event.nameCity);
    this.form.controls['idCity'].setValue(event.idCity);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.form.controls['description'].value.trim() === '' ||
      this.form.controls['type'].value.trim() === '' ||
      this.form.controls['address'].value.trim() === '' ||
      this.form.controls['keyEntityFederative'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    /*let body = {
      id
      idTransferer
      keyTransferer
      description
      type
      address
      city
      idCity
      keyEntityFederative
    }*/
    this.loading = true;
    this.originService.create(this.form.getRawValue()).subscribe({
      next: data => {
        this.handleSuccess(), console.log(data);
      },
      error: error => ((this.loading = false), console.log(error)),
    });
  }

  update() {
    this.loading = true;
    this.originService.update1(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => ((this.loading = false), console.log(error)),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
