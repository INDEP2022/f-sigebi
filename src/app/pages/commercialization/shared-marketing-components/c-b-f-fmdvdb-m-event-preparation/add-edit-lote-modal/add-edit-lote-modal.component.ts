import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-lote-modal',
  templateUrl: './add-edit-lote-modal.component.html',
  styles: [
  ]
})
export class AddEditLoteModalComponent extends BasePage implements OnInit {
  
  form: FormGroup = new FormGroup ({});
  allotment: any;
  title: string = 'Lote';
  edit: boolean = false;

  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group({
      lote: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      valorbase: [null, [Validators.required]],
      idcliente: [null, [Validators.required]],
      rfc: [null, [Validators.required]]
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
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
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

}
