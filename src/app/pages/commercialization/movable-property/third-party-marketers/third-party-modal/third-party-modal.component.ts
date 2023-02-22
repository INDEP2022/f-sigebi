import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IThirdParty } from 'src/app/core/models/ms-thirdparty/third-party.model';

@Component({
  selector: 'app-third-party-modal',
  templateUrl: './third-party-modal.component.html',
  styles: [
  ]
})
export class ThirdPartyModalComponent implements OnInit {

  title: string = 'Terceros comercializadores';
  edit: boolean = false;

  thirdPartyForm : ModelForm<IThirdParty>;
  thirPartys : IThirdParty;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.thirdPartyForm = this.fb.group({
      id: [null, []],
      nameReason: [null, []],
      calculationRoutine: [null, []],
      userAttempts: [null, []],
      userBlocked: [null, []],
      userBlockedEnd: [null, []],
      userBlockedStart: [null, []],
      userStatus: [null, []],
      userKey:[null, []],
      userPwd: [null, []],
      user:[null, []],
    });
    if (this.thirPartys != null){
      this.edit = true;
      this.thirdPartyForm.patchValue(this.thirPartys);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update(){
    console.log('Actualizar');
  }

  create(){
  console.log('Crear');
  }

}
