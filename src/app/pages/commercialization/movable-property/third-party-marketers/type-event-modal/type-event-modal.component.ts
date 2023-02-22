import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeEventXtercomer } from 'src/app/core/models/ms-thirdparty/third-party.model';

@Component({
  selector: 'app-type-event-modal',
  templateUrl: './type-event-modal.component.html',
  styles: [
  ]
})
export class TypeEventModalComponent implements OnInit {

  title: string = 'Tipo de eventos';
  edit: boolean = false;

  typeEvent3erForm: ModelForm<ITypeEventXtercomer>;
  typeEvents: ITypeEventXtercomer;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.typeEvent3erForm = this.fb.group({
      thirdPartyId: [null, []],
      typeEventId: [null, []],
    });
    if (this.typeEvents != null){
      this.edit = true;
      this.typeEvent3erForm.patchValue(this.typeEvents);

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
