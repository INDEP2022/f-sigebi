import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TmpManagementProcedureService } from 'src/app/core/services/ms-procedure-management/tmp-management-procedure.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-turn-paperwork',
  templateUrl: './turn-paperwork.component.html',
  styles: [],
})
export class TurnPaperworkComponent extends BasePage implements OnInit {
  paperwork: any = null;
  form = this.fb.group({
    user: new FormControl<string>(null, Validators.required),
  });
  user: any = null;
  users = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalRef: BsModalRef,
    private tmpManagementProcedureService: TmpManagementProcedureService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.paperwork);
  }

  getUsers(params: ListParams) {
    this.usersService.getAllSegUsers(params).subscribe({
      next: response =>
        (this.users = new DefaultSelect(response.data, response.count)),
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener los usuarios'
        );
      },
    });
  }

  onUserChange(user: any) {
    if (!user) {
      this.user = null;
    } else {
      this.user = user;
    }
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    if (!this.form.valid) {
      this.onLoadToast('error', 'Error', 'El formulario es inválido');
      this.form.markAllAsTouched();
      return;
    }
    const id = this.form.controls.user.value;
    const { name } = this.user;
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      `¿Desea turnar los trámites seleccionados al usuario: ${name}?`
    );
    if (result.isConfirmed) {
      await this.askForFolio();
    }
  }

  async askForFolio() {
    const result = await this.alertQuestion(
      'question',
      'Advertencia',
      '¿Desea generar folio de recepción a los trámites seleccionados?'
    );
    if (result.isConfirmed) {
      this.generateReceptionFolio();
    } else {
    }
  }

  generateReceptionFolio() {
    let flyer: string | number = null;
    const { processStatus, flierNumber } = this.paperwork;
    console.log({ processStatus });
    if (processStatus == 'DJI' || processStatus == 'DJP') {
      flyer = flierNumber;
    }

    if (flyer) {
    }
  }
}
