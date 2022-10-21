import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-pj-d-generationofficialfiles',
  templateUrl: './pj-d-generationofficialfiles.component.html',
  styleUrls: ['./pj-d-generationofficialfiles.component.scss'],
})
export class PJDGenerationOfficialFilesComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noVolante: ['', [Validators.required]], //*
      noExpediente: '',
      noOficio: '',
      tipoOficio: '',
      status: '',
      cveOficio: '', // Campo extenso
      oficioPor: '',
      remitente: '',
      destinatario: '',
      nomPerExt: '', // Campo extenso
    });
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }
}
