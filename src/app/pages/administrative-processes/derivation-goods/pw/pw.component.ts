import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pw',
  templateUrl: './pw.component.html',
  styles: [],
})
export class PwComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;
  //Search conversion
  conversiones = new DefaultSelect();
  conversionData: any;
  // Variable para la contraseña
  private _password: string;
  conversionId: any;
  cveActaConv: any;
  get idConversion() {
    return this.form.get('idConversion');
  }
  get password() {
    return this.form.get('password');
  }

  constructor(
    private fb: FormBuilder,
    private serviceConversion: ConvertiongoodService,
    private modalService: BsModalRef,
    private router: Router,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }
  onBeforeUnload(): void {
    // Lógica para eliminar el elemento del almacenamiento local
    localStorage.removeItem('conversion');
  }
  private buildForm() {
    this.form = this.fb.group({
      idConversion: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    const conversion = localStorage.getItem('conversion');
    if (conversion != null) {
      this.loader.load = true;
      this.conversionData = JSON.parse(conversion);
      this.idConversion.setValue(this.conversionData);
      this.password.setValue(this.conversionData.pwAccess);
      console.log(this.conversionData);
      setTimeout(() => {
        this.sigin();
      }, 1000);
    }
  }

  serachIdConversion(e?: any) {
    this.serviceConversion.getById(e.text).subscribe(
      res => {
        console.log(res);
        this.conversionData = res;
        this.conversiones = new DefaultSelect([res]);
      },
      err => {
        this.alert(
          'warning',
          'No Existen Registros con el Valor Ingresado',
          ''
        );
        this.conversiones = new DefaultSelect();
      }
    );
  }

  sigin() {
    if (this.idConversion.value != null) {
      this._password = this.idConversion.value.pwAccess;
      if (this.password != null) {
        if (this.password.value != this._password) {
          this.alert(
            'warning',
            'Contraseña Incorrecta',
            'Por Favor Verificar y Volver a Intentar'
          );
        } else {
          if (this.conversionData.goodFatherNumber != null) {
            console.log(this.conversionData);
            this.modalService.content.callback(this.conversionData);
            this.modalService.hide();
            this.loader.load = false;
          } else {
            this.alert(
              'warning',
              'Conversiones',
              'La Conversion debe tener un Bien Padre'
            );
          }
        }
      } else {
        this.alert('warning', 'Debe Introducir la Contraseña', '');
      }
    } else {
      this.alert('warning', 'Debe Introducir un Id Conversión', '');
    }
  }

  close() {
    this.modalRef.hide();
  }
}
