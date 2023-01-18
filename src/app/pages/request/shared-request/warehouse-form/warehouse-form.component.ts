import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styles: [],
})
export class WarehouseFormComponent extends BasePage implements OnInit {
  warehouseForm: FormGroup = new FormGroup({});
  responsiblesUsers = new DefaultSelect();
  typeTercero = new DefaultSelect();
  states = new DefaultSelect<IStateOfRepublic>();
  municipalities = new DefaultSelect<IMunicipality>();
  cities = new DefaultSelect<ICity>();
  colonies = new DefaultSelect<ILocality>();
  cp = new DefaultSelect();
  street = new DefaultSelect();
  typeWarehouse = new DefaultSelect<ITypeWarehouse>();
  stateKey: string = '';

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private stateOfRepublicService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private typeWarehouseService: TypeWarehouseService,
    private cityService: CityService,
    private localityService: LocalityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  //Verificar typeTercero//
  prepareForm() {
    this.warehouseForm = this.fb.group({
      nameWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      responsibleUser: [null],
      numberRegister: [null],
      typeTercero: [null],
      regionalDelegation: ['OCCIDENTE', [Validators.pattern(STRING_PATTERN)]],
      managedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      municipality: [null],
      city: [null],
      colony: [null],
      cp: [null],
      street: [null],
      numberOutside: [null],
      typeWarehouse: [null],
      numberManagement: [null],
      locator: [null],
      contractNumber: [null],
      siabWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      startOperation: [null],
      endOperation: [null],
      latitude: [null, [Validators.pattern(STRING_PATTERN)]],
      longitude: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro de crar almacén?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Almacén creado correctamente', '');
        this.close();
        this.router.navigate([
          '/pages/request/perform-programming/1/warehouse/1',
        ]);
      }
    });
  }

  getResponsibleUserSelect(responsibleUser: ListParams) {}

  getTypeTerceroSelect(typeTercero: ListParams) {}

  //Revisar error //
  getStateSelect(params?: ListParams) {
    if (params.text == null) params.text = '';
    this.stateOfRepublicService.getAll(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  stateSelect(item: IStateOfRepublic) {
    this.stateKey = item.id;
    this.getCitySelect(new ListParams());
    this.getMunicipalitiesSelect(new ListParams());
    this.getColonySelect(new ListParams());
  }

  getCitySelect(params?: ListParams) {
    params['stateKey'] = this.stateKey;
    if (params.text == null) params.text = '';
    this.cityService.getAll(params).subscribe(data => {
      this.cities = new DefaultSelect(data.data, data.count);
    });
  }

  getMunicipalitiesSelect(params?: ListParams) {
    params['stateKey'] = this.stateKey;
    if (params.text == null) params.text = '';
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  getColonySelect(params?: ListParams) {
    params['stateKey'] = this.stateKey;
    if (params.text == null) params.text = '';

    console.log('params', params);
    this.localityService.getAll(params).subscribe(data => {
      console.log('Localidades', data);
      this.colonies = new DefaultSelect(data.data, data.count);
    });
  }

  getCpSelect(cp: ListParams) {}

  getTypeWarehouseSelect(params: ListParams) {
    this.typeWarehouseService.getAll(params).subscribe(data => {
      this.typeWarehouse = new DefaultSelect(data.data, data.count);
    });
  }

  close() {
    this.modalService.hide();
  }
}
