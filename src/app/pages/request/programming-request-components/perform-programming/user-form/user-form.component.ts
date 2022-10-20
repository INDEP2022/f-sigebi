import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';


@Component({
  selector: 'app-new-user-form',
  templateUrl: './user-form.component.html',
  styles: [
  ]
})
export class UserFormComponent  implements OnInit {

  userForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  chargeUser = new DefaultSelect();
  constructor(
    private modalService: BsModalRef,
    private fb:FormBuilder) { 
      
    }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm(){
    this.userForm = this.fb.group({
      name: [null,[Validators.required]],
      email: [null, [Validators.required]],
      chargeUser: [null, [Validators.required]]
    })
  }
  confirm(){

  }
  
  close(){
    this.modalService.hide();
  }

  getFractionSelect(event: ListParams){

  }
}
