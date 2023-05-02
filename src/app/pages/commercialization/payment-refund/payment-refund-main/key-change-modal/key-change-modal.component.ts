import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-key-change-modal',
  templateUrl: './key-change-modal.component.html',
  styles: [],
})
export class KeyChangeModalComponent extends BasePage implements OnInit {
  title: string = 'Cambio de Clave Interbancaria';
  keyForm: FormGroup = new FormGroup({});
  @Output() onKeyChange = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.keyForm = this.fb.group({
      key: [null, [Validators.required]],
      observations: [null, Validators.pattern(STRING_PATTERN)],
      userAuthorize: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      authPass: [null, [Validators.required]],
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
    // Llamar servicio para cambiar clave
    console.log(this.keyForm.value);
    this.loading = false;
    this.onKeyChange.emit(true);
    this.modalRef.hide();
  }
}
