import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-registration-of-interest-modal',
  templateUrl: './registration-of-interest-modal.component.html',
  styles: [],
})
export class RegistrationOfInterestModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Registro de Intereses';
  provider: any;
  edit: boolean = false;
  providerForm: FormGroup = new FormGroup({});

  @Output() onConfirm = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }
  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      id: [null],
      tille: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      mesTille: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      mes: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      anioTille: [null, [Validators.required]],
      FECHA_DE_REGISTROO: [new Date()],
      TIIE_PROMEDIO: [null],
      user: [null],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
    } else {
      this.edit = false;
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();

    let params = {
      id: this.providerForm.controls['id'].value,
      tiieDays: this.providerForm.controls['tille'].value,
      tiieMonth: this.providerForm.controls['mesTille'].value,
      tiieYear: this.providerForm.controls['anioTille'].value,
      tiieAverage: this.providerForm.controls['TIIE_PROMEDIO'].value,
      registryDate: this.providerForm.controls['FECHA_DE_REGISTROO'].value,
      user: this.providerForm.controls['user'].value,
    };

    //this.showSearch = true;
    console.log(params);
    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);

    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?P_IDENTIFICADOR=${params}`; //window.URL.createObjectURL(blob);
    // const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    // window.open(pdfurl, 'FCOMERCATINTERES.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Registro exitoso', '');
    }, 2000);

    this.loading = false;
    this.close();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onConfirm.emit(this.providerForm.value);
    this.modalRef.hide();
  }
}
