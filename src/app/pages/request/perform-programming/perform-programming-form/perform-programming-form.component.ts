import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IState } from 'src/app/core/models/catalogs/city.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ISubcategory } from 'src/app/core/models/catalogs/sub-category.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { WarehouseFormComponent } from '../../warehouse/warehouse-form/warehouse-form.component';


@Component({
  selector: 'app-perform-programming-form',
  templateUrl: './perform-programming-form.component.html',
  styles: [
  ]
})
export class PerformProgrammingFormComponent extends BasePage implements OnInit {

  performForm: FormGroup = new FormGroup({});
  users = new DefaultSelect<IUser>();
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  states = new DefaultSelect<IState>();
  transferences = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authority = new DefaultSelect<IAuthority>();
  typeRelevant = new DefaultSelect();
  warehouse = new DefaultSelect();
  
  constructor(
    private fb:FormBuilder,
    private modalService: BsModalService) { 
      super();
    }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.performForm = this.fb.group({
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null],
      startDate: [null],
      endDate: [null],
      observation: [null],
      regionalDelegation:[null],
      state: [null],
      transference: [null],
      station: [null],
      authority: [null],
      typeRelevant: [null],
      warehouse: [null],
      userId: [null],
    })
  }

  newUser(){
    const newUser = this.modalService.show(UserFormComponent,{
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  newWarehouse(){
    const newWarehouse = this.modalService.show(WarehouseFormComponent,{
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    })
  }

  estateSearch(){
    const estateSearch = this.modalService.show(EstateSearchFormComponent,{
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getUsersSelect(user: ListParams){

  }

  getRegionalDelegationSelect(regionalDelegation: ListParams){
    
  }

  getStateSelect(state: ListParams){
    
  }

  getTransferenceSelect(transference: ListParams){
    
  }

  getStationSelect(station: ListParams){

  }

  getAuthoritySelect(authority: ListParams){

  }

  getTypeRelevantSelect(typeRelevant: ListParams){

  }

  getWarehouseSelect(warehouse: ListParams){

  }
}
