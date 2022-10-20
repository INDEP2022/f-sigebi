import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-estate-search-form',
  templateUrl: './estate-search-form.component.html',
  styles: [
  ]
})
export class EstateSearchFormComponent implements OnInit {
  
  estateForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  akaWarehouse = new DefaultSelect();
  states = new DefaultSelect();
  municipalities = new DefaultSelect();
  colonies = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.estateForm = this.fb.group({
      akaWarehouse: [null],
      state: [null],
      municipality: [null],
      colony: [null],
      cp: [null],
    })
  }

  confirm(){

  }

  close(){
    this.modalService.hide();
  }

  getAkaWarehouseSelect(akaWarehouse: ListParams){

  }

  getStateSelect(state: ListParams){

  }

  getMunicipalitySelect(municipality: ListParams){

  }

  getColonySelect(colony: ListParams){

  }
}
