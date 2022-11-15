import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
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
  typeWarehouse = new DefaultSelect();

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  //Verificar typeTercero//
  prepareForm() {
    this.warehouseForm = this.fb.group({
      nameWarehouse: [null],
      responsibleUser: [null],
      numberRegister: [null],
      typeTercero: [null],
      regionalDelegation: ['OCCIDENTE'],
      managedBy: [null],
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
      siabWarehouse: [null],
      startOperation: [null],
      endOperation: [null],
      latitude: [null],
      longitude: [null],
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

  getStateSelect(state: ListParams) {}

  getMunicipalitySelect(municipally: ListParams) {}

  getCitySelect(city: ListParams) {}

  getColonySelect(colony: ListParams) {}

  getCpSelect(cp: ListParams) {}

  getStreetSelect(cp: ListParams) {}

  getTypeWarehouseSelect(typeWarehouse: ListParams) {}

  close() {
    this.modalService.hide();
  }
}
