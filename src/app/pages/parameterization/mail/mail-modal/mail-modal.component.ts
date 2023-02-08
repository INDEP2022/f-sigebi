import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUserAccessAreas } from 'src/app/core/models/catalogs/users-access-areas-model';

@Component({
  selector: 'app-mail-modal',
  templateUrl: './mail-modal.component.html',
  styles: [],
})
export class MailModalComponent implements OnInit {
  form: ModelForm<IUserAccessAreas>;
  userAccessAreas: IUserAccessAreas;

  title: string = 'Mtto. Correo';
  edit: boolean = false;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      usuario: [null, []],
      nombre: [null, []],
      descripcion: [null, []],
      no_registro: [null, []],
      rfc: [null, []],
      curp: [null, []],
      calle: [null, []],
      no_interior: [null, []],
      colonia: [null, []],
      codigo_postal: [null, []],
      telefono: [null, []],
      profesion: [null, []],
      cve_cargo: [null, []],
      fec_ingreso_primera_vez: [null, []],
    });
    if (this.userAccessAreas != null) {
      this.edit = true;
      console.log(this.userAccessAreas);
      this.form.patchValue(this.userAccessAreas);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
