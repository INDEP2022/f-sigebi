import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStorehouse } from 'src/app/core/models/catalogs/storehouse.model';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { StorehouseService } from '../../../../core/services/catalogs/storehouse.service';

@Component({
  selector: 'app-storehouse-detail',
  templateUrl: './storehouse-detail.component.html',
  styles: [],
})
export class StorehouseDetailComponent extends BasePage implements OnInit {
  storeHouseForm: ModelForm<IStorehouse>;
  storeHouse: IStorehouse;
  title: string = 'Catálogos de Bodegas';
  edit: boolean = false;
  states = new DefaultSelect();
  municipalities = new DefaultSelect();
  localities = new DefaultSelect();

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
    /*this.getMunicipalities(new ListParams());
    this.getLocalities(new ListParams());*/
  }

  private prepareForm() {
    this.storeHouseForm = this.fb.group({
      id: [null],
      manager: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      description: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
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
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      idEntity: [null],
    });

    if (this.storeHouse != null) {
      this.edit = true;
      this.storeHouseForm.patchValue(this.storeHouse);
    }
    this.getMunicipalities(new ListParams());
    this.getLocalities(new ListParams());
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.storehouseService.create(this.storeHouseForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.storehouseService
      .update(this.storeHouse.id, this.storeHouseForm.getRawValue())
      .subscribe({
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

  /*
  getMunicipalitie(data: any) {
    this.localities = new DefaultSelect([], 0, true);
    this.storeHouseForm.controls['locality'].setValue(null);
    this.getMunicipalities(new ListParams(), data.state);
  }*/

  getMunicipalities(params: ListParams, id?: string) {
    this.municipalityService.getAll(params).subscribe({
      next: data => {
        this.municipalities = new DefaultSelect(data.data, data.count);
      },
      error: error => (this.municipalities = new DefaultSelect()),
    });
  }

  getLocalitie(data: any) {
    console.log('localitieee', data.stateKey);
    this.storeHouseForm.controls['locality'].setValue(null);
    this.getLocalities(new ListParams(), data.stateKey);
  }

  getLocalities(params: ListParams, id?: string) {
    if (id) {
      params['filter.municipalityId'] = `$eq:${id}`;
    }
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
