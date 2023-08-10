import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IStorehouse } from 'src/app/core/models/catalogs/storehouse.model';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { StorehouseService } from '../../../../core/services/catalogs/storehouse.service';

@Component({
  selector: 'app-storehouse-detail',
  templateUrl: './storehouse-detail.component.html',
  styles: [],
})
export class StorehouseDetailComponent extends BasePage implements OnInit {
  storeHouseForm: ModelForm<IStorehouse>;
  storeHouse: any;
  title: string = 'Bodega';
  edit: boolean = false;
  states = new DefaultSelect();
  municipalities = new DefaultSelect();
  localities = new DefaultSelect();
  stateKey: string = '';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private storehouseService: StorehouseService,
    private stateService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getMunicipalities(new ListParams());
    //this.getLocalities(new ListParams());
    /*this.getMunicipalities(new ListParams());
    this.getLocalities(new ListParams());*/
  }

  prepareForm() {
    this.storeHouseForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      manager: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(80),
        ],
      ],
      description: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(80),
        ],
      ],
      municipalityCodeID: [null],
      municipality: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      localityCodeID: [null],
      locality: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      ubication: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(80),
        ],
      ],
      idEntity: [
        null,
        [Validators.maxLength(60), Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.storeHouse != null) {
      console.log(this.storeHouse);
      this.edit = true;
      this.storeHouseForm.patchValue(this.storeHouse);
      //this.storeHouseForm.controls['municipality'].setValue(this.storeHouse.municipality);
      //this.storeHouseForm.controls['locality'].setValue(this.storeHouse.locality);
      this.getUpdateMunicipalities(
        new ListParams(),
        this.storeHouse.municipality
      );
      this.storeHouseForm.controls['id'].disable();
      this.getUpdateLocalities(new ListParams(), this.storeHouse.locality);

      //this.getMunicipalities(new ListParams());
      //this.getLocalities(new ListParams());
    }
    this.getMunicipalities(new ListParams());
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    if (
      this.storeHouseForm.controls['manager'].value.trim() === '' ||
      this.storeHouseForm.controls['description'].value.trim() === '' ||
      this.storeHouseForm.controls['ubication'].value.trim() === '' ||
      (this.storeHouseForm.controls['manager'].value.trim() == '' &&
        this.storeHouseForm.controls['description'].value.trim() == '' &&
        this.storeHouseForm.controls['ubication'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    } else {
      this.loading = true;
      this.storehouseService
        .create(this.storeHouseForm.getRawValue())
        .subscribe({
          next: data => {
            this.handleSuccess();
          },
          error: error => {
            this.loading = false;
            this.alert('warning', 'El No. Bodega ya fue registrado', ``);
            return;
          },
        });
    }
  }

  update() {
    if (
      this.storeHouseForm.controls['manager'].value.trim() === '' ||
      this.storeHouseForm.controls['description'].value.trim() === '' ||
      this.storeHouseForm.controls['ubication'].value.trim() === '' ||
      (this.storeHouseForm.controls['manager'].value.trim() == '' &&
        this.storeHouseForm.controls['description'].value.trim() == '' &&
        this.storeHouseForm.controls['ubication'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    } else {
      this.loading = true;
      this.storehouseService
        .newUpdate(this.storeHouseForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  /*
  getMunicipalitie(data: any) {
    this.localities = new DefaultSelect([], 0, true);
    this.storeHouseForm.controls['locality'].setValue(null);
    this.getMunicipalities(new ListParams(), data.state);
  }*/
  getUpdateMunicipalities(params: ListParams, value: string) {
    console.log(this.storeHouseForm.controls['municipality'].value);
    params['filter.nameMunicipality'] = `$ilike:${value}`;
    this.municipalityService.getAll(params).subscribe({
      next: data => {
        this.municipalities = new DefaultSelect(data.data, data.count);
        this.getLocalitie(data.data[0]);
      },
      error: error => {
        this.municipalities = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getMunicipalities(params: ListParams) {
    console.log(this.storeHouseForm.controls['municipality'].value);
    params['filter.description'] = `$ilike:${this.stateKey}`;
    this.municipalityService.getAll(params).subscribe({
      next: data => {
        this.municipalities = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.municipalities = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getLocalitie(data: IMunicipality) {
    this.stateKey = data.idMunicipality;
    console.log(this.stateKey);
    if (this.stateKey != null) {
      this.getLocalities(new ListParams());
    }
  }

  getUpdateLocalities(params: ListParams, value: string) {
    params['filter.nameLocation'] = `$ilike:${value}`;
    this.localityService.getAll(params).subscribe({
      next: data => {
        this.localities = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.localities = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getLocalities(params: ListParams) {
    params['filter.municipalityId'] = this.stateKey;
    this.localityService.getAll(params).subscribe({
      next: data => {
        this.localities = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.localities = new DefaultSelect();
        this.loading = false;
      },
    });
  }
}
