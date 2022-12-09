import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { BasePage } from '../../../../../core/shared/base-page';

@Component({
  selector: 'app-reports-modal',
  templateUrl: './reports-modal.component.html',
  styles: [],
})
export class CBROimCReportsModalComponent extends BasePage implements OnInit {
  title: string = 'Cambio de Título de Documento';
  titleForm: FormGroup = new FormGroup({});
  @Output() onEdit = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.titleForm = this.fb.group({
      title: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    // Llamar servicio para verificar la clave del usuario que autoriza
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para editar titulo
    console.log(this.titleForm.value);
    this.loading = false;
    this.onEdit.emit(true);
    this.modalRef.hide();
  }
}
