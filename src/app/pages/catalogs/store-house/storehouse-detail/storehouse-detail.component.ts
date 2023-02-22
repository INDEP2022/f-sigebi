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

  public get id() {
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
  }

  prepareForm() {
    this.storeHouseForm = this.fb.group({
      idStorehouse: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      manager: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.maxLength(255),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      description: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.maxLength(255),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      municipality: [
        null,
        Validators.compose([Validators.pattern(''), Validators.maxLength(255)]),
      ],
      locality: [
        null,
        Validators.compose([Validators.pattern(''), Validators.maxLength(255)]),
      ],
      ubication: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.maxLength(255),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      idEntity: [null, Validators.compose([Validators.maxLength(255)])],
    });
    if (this.storeHouse != null) {
      this.edit = true;
      console.log(this.storeHouse);
      this.storeHouseForm.patchValue(this.storeHouse);
      // console.log(this.warehouse);
      // const { descCondition, nameCity, description, localityName } =
      //   this.warehouse;
      // this.warehouseForm.patchValue(this.warehouse);
      // this.idWarehouse.disable();
      // //TODO: Revisar con backend que regrese el objeto de bodega completo para poder pintar la informacion en los select
      // this.states = new DefaultSelect([descCondition], 1);
      // this.cities = new DefaultSelect([nameCity], 1);
      // this.municipalities = new DefaultSelect([description], 1);
      // this.localities = new DefaultSelect([localityName], 1);
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
    this.storehouseService.create(this.storeHouseForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.loading = true;
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

  getStates(params: ListParams) {
    this.stateService.getAll(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  getMunicipalities(params: ListParams) {
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  getLocalities(params: ListParams) {
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }
}
