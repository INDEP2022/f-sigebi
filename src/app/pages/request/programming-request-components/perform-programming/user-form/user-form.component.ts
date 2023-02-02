import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './user-form.component.html',
  styles: [],
})
export class UserFormComponent extends BasePage implements OnInit {
  userData: any;
  edit: boolean = false;
  userForm: FormGroup = new FormGroup({});
  chargeUser = new DefaultSelect();
  constructor(private modalService: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.userForm = this.fb.group({
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      chargeUser: [null, [Validators.required]],
    });

    if (this.userData != null) {
      this.edit = true;
      this.userForm.patchValue(this.userData);
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas crear el usuario?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.loading = true;
        this.onLoadToast('success', 'Usuario creado correctamente', '');
      }
    });
  }

  update() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Deseas editar el usuario?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.loading = true;
        this.onLoadToast('success', 'Usuario editado correctamente', '');
      }
    });
  }

  close() {
    this.modalService.hide();
  }

  getFractionSelect(event: ListParams) {}
}
