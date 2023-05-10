import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
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
  idProgramming: number;
  constructor(
    private modalService: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService,
    private programmingService: ProgrammingRequestService
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
    });

    if (this.userData != null) {
      this.edit = true;
      if (this.userData.userCharge)
        this.userData.userCharge = this.userData.charge.keyId;
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
    //this.userForm.get('keyId').setValue(item.keyId);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.alertQuestion(
      'warning',
      'Advertencía',
      '¿Desea crear el usuario a la programación?',
      'Guardar'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        let formData: Object = {
          programmingId: Number(this.idProgramming),
          email: this.userForm.get('email').value,
          user: this.userForm.get('user').value,
          userCharge: this.userForm.get('userCharge').value,
        };
        this.programmingService.createUsersProgramming(formData).subscribe({
          next: res => {
            const create: boolean = true;
            this.modalService.content.callback(true, create);
            this.close();
          },
        });
      }
    });
  }

  update() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea editar el usuario?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(this.userForm.value);
        let formData: Object = {
          programmingId: Number(this.idProgramming),
          email: this.userForm.get('email').value,
          user: this.userForm.get('user').value,
          userCharge: this.userForm.get('userCharge').value,
        };
        this.programmingService.updateUserProgramming(formData).subscribe({
          next: res => {
            this.loading = true;
            this.modalService.content.callback(true);
            this.close();
          },
        });
      }
    });
  }

  close() {
    this.loading = false;
    this.modalService.hide();
  }
}
