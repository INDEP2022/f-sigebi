import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, NAME_PATTERN } from 'src/app/core/shared/patterns';
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
  chargesUsers = new DefaultSelect<IGeneric>();
  constructor(
    private modalService: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getChargesUsers(new ListParams());
  }
  prepareForm() {
    this.userForm = this.fb.group({
      user: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      userCharge: [null, [Validators.required]],
      keyId: [null],
    });

    if (this.userData != null) {
      this.edit = true;
      this.userForm.patchValue(this.userData);
    }
  }

  getChargesUsers(params?: ListParams) {
    params['filter.name'] = 'Cargos Usuarios';
    return this.genericService.getAll(params).subscribe(data => {
      this.chargesUsers = new DefaultSelect(data.data, data.count);
    });
  }

  chargeSelect(item: IGeneric) {
    this.userForm.get('keyId').setValue(item.keyId);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.alertQuestion(
      'warning',
      'Advertencía',
      '¿Deseas crear el usuario a la programación?',
      'Guardar'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.onLoadToast('success', 'Usuario creado correctamente', '');
        const create: boolean = true;
        this.modalService.content.callback(this.userForm.value, create);
        this.close();
      } else {
        this.close();
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
        this.modalService.content.callback(this.userForm.value);
        this.close();
      }
    });
  }

  close() {
    this.loading = false;
    this.modalService.hide();
  }
}
