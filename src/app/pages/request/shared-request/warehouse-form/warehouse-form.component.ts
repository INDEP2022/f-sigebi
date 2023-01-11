import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
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
  states = new DefaultSelect();
  municipalities = new DefaultSelect();
  cities = new DefaultSelect();
  colonies = new DefaultSelect();
  cp = new DefaultSelect();
  street = new DefaultSelect();
  typeWarehouse = new DefaultSelect<ITypeWarehouse>();

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private stateService: StateOfRepublicService,
    private typeWarehouseService: TypeWarehouseService,
    private cityService: CityService
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
  getStateSelect(params: ListParams) {
    this.stateService.getAll(params).subscribe(data => {
      console.log('Estado de la republica', data);
    });
  }

  getMunicipalitySelect(municipally: ListParams) {}

  getCitySelect(params: ListParams) {
    this.cityService.getAll(params).subscribe(data => {
      console.log('Ciudad seleccionada', data);
    });
  }

  getColonySelect(colony: ListParams) {}

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
