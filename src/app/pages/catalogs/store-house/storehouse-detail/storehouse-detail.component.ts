import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  public states = new DefaultSelect();
  public municipalities = new DefaultSelect();
  public localities = new DefaultSelect();

  @Output() refresh = new EventEmitter<true>();

  public get idStorehouse() {
    return this.storeHouseForm.get('idStorehouse');
  }
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
    this.getLocalities(new ListParams());
  }

  prepareForm() {
    this.storeHouseForm = this.fb.group({
      idStorehouse: [null],
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
      console.log('entrada de localidad', this.storeHouse);
      let municipalit = this.storeHouse.municipality;
      let localit = this.storeHouse.locality;
      console.log('entro 1', this.storeHouse.municipality);
      this.storeHouseForm.patchValue(this.storeHouse);
      const { municipality, locality } = this.storeHouse;
      if (municipalit) {
        this.storeHouseForm.controls['municipality'].setValue(
          municipalit.nameMunicipality
        );
        this.storeHouseForm.controls['municipalityCodeID'].setValue(
          municipalit.idMunicipality
        );
        console.log('entrada de localidad', this.storeHouse.locality);
        this.storeHouseForm.controls['locality'].setValue(localit.nameLocation);
        this.storeHouseForm.controls['localityCodeID'].setValue(localit.id);
        this.municipalities = new DefaultSelect(
          [municipality.nameMunicipality],
          1
        );
        this.localities = new DefaultSelect([locality.nameLocation], 1);
      } else {
        this.getMunicipalitie(localit);
      }
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
    console.log('agrego', this.storeHouseForm.value.idStorehouse);
    this.storeHouseForm.value.idStorehouse = Number(
      this.idStorehouse.value.idStorehouse
    );
    console.log('agrego 2', this.storeHouseForm.value);
    this.storehouseService.create(this.storeHouseForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.loading = true;
    let data = {
      idStorehouse: this.storeHouseForm.controls['idStorehouse'].value,
      manager: this.storeHouseForm.controls['manager'].value,
      description: this.storeHouseForm.controls['description'].value,
      municipalityCode:
        this.storeHouse.municipality.nameMunicipality !=
        this.storeHouseForm.get('municipality').value
          ? this.storeHouseForm.controls['municipality'].value
          : this.storeHouseForm.controls['municipalityCodeID'].value,
      localityCode:
        this.storeHouse.locality.nameLocation !=
        this.storeHouseForm.get('locality').value
          ? this.storeHouseForm.controls['locality'].value
          : this.storeHouseForm.controls['localityCodeID'].value,
      ubication: this.storeHouseForm.controls['ubication'].value,
      idEntity: this.storeHouseForm.controls['idEntity'].value,
    };
    this.storehouseService
      .update(this.storeHouse.idStorehouse, this.storeHouseForm.value)
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

  getMunicipalitie(data: any) {
    this.localities = new DefaultSelect([], 0, true);
    this.storeHouseForm.controls['locality'].setValue(null);
    this.getMunicipalities(new ListParams(), data.state);
  }

  getMunicipalities(params: ListParams, id?: string) {
    this.municipalityService.getAll(params).subscribe(
      data => {
        this.municipalities = new DefaultSelect(data.data, data.count);
      },
      error => (this.states = new DefaultSelect())
    );
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
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }
}
