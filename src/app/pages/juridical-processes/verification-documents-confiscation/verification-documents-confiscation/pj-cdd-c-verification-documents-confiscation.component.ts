/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-cdd-c-verification-documents-confiscation',
  templateUrl: './pj-cdd-c-verification-documents-confiscation.component.html',
  styleUrls: ['./pj-cdd-c-verification-documents-confiscation.component.scss'],
})
export class PJCDDVerificationDocumentsConfiscationComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  expedientesForm: FormGroup;
  bienesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  prepareForm() {
    this.expedientesForm = this.fb.group({
      articuloValidado: ['', [Validators.maxLength(1)]], // 1 char
      fechaDictamina: ['', [Validators.maxLength(10)]], // 10 date
      fechaMinisterial: ['', [Validators.maxLength(10)]], // 10 date
      actaMinisterial: ['', [Validators.maxLength(30)]], // 30 char
      noExpediente: ['', [Validators.required, Validators.maxLength(11)]], // 11 required number
      fechaDecomisoDictaminacion: ['', [Validators.maxLength(30)]], // 30 char
      causaPenal: ['', [Validators.maxLength(40)]], //40 char
      averiguacionPrevia: ['', [Validators.maxLength(40)]], // 40 char
    });
    this.bienesForm = this.fb.group({
      fechaDictaminacion: ['', [Validators.maxLength(10)]], // 10 date
      noExpediente: ['', [Validators.maxLength(10)]], // 10 number
      noBien: ['', [Validators.maxLength(11)]], //11 number
      estatus: ['', [Validators.maxLength(3)]], //3 char
      estatusDescripcion: ['', [Validators.maxLength(100)]], // 100 char
      descripcion: ['', [Validators.maxLength(600)]], // 600 char
      situacionBien: ['', [Validators.maxLength(30)]], //30 char
      observaciones: ['', [Validators.maxLength(1000)]], // 1000 char
      proceso: ['', [Validators.maxLength(30)]], // 30 char
      autoridadOrdenaDictamen: ['', [Validators.maxLength(200)]], // 200 char
      aprobarDictamen: ['', [Validators.maxLength(30)]], // 30 char
      disponible: ['', [Validators.maxLength(2)]], // 2 char
      noRegistro: ['', [Validators.maxLength(40)]], // 40 char
    });
  }
}
