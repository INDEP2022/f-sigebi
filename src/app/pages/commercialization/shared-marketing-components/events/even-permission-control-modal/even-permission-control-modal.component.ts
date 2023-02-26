import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerUsuaTxEvent } from 'src/app/core/models/ms-event/comer-usuatxevent-model';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-even-permission-control-modal',
  templateUrl: './even-permission-control-modal.component.html',
  styles: [
  ]
})
export class EvenPermissionControlModalComponent extends BasePage implements OnInit {

  title: string = 'CONTROL DE PERMISOS A EVENTOS';
  edit: boolean = false;

  comerUserForm: ModelForm<IComerUsuaTxEvent>;
  comerUser: IComerUsuaTxEvent;

  today: Date;

  constructor(private modalRef: BsModalRef, private fb:FormBuilder, private comerUsuauTxEventService:ComerUsuauTxEventService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.comerUserForm = this.fb.group({
      idEvent: [null, [Validators.required]],
      username:  [null, [Validators.required]],
      date:  [null, [Validators.required]]
    });
    if(this.comerUser != null){
      this.edit = true;
      this.comerUserForm.patchValue(this.comerUser);
    } else {
      this.edit = false;
      this.comerUserForm.controls['idEvent'].setValue(this.comerUser.idEvent);
    }
  }

   close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.comerUsuauTxEventService.create(this.comerUserForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.comerUsuauTxEventService
      .update(this.comerUserForm.value)
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

}
