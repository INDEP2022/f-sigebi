import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-c-c-tp-c-penalty-types-form',
  templateUrl: './c-c-tp-c-penalty-types-form.component.html',
  styles: [],
})
export class CCTpCPenaltyTypesFormComponent extends BasePage implements OnInit {
  // tipo any hasta que existan modelos o interfaces de la respuesta del backend
  penaltyTypeForm: FormGroup = new FormGroup({});
  title: string = 'Tipo Penalización';
  edit: boolean = false;
  penaltyType: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.penaltyTypeForm = this.fb.group({
      id: [null, [Validators.required]],
      description: [null, [Validators.required]],
      days: [null, [Validators.required]],
      process: [null, [Validators.required, Validators.maxLength(1)]],
    });
    if (this.penaltyType != null) {
      this.edit = true;
      console.log(this.penaltyType);
      this.penaltyTypeForm.patchValue(this.penaltyType);
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
