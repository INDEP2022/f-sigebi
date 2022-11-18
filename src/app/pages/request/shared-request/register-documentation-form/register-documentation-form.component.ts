import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-register-documentation-form',
  templateUrl: './register-documentation-form.component.html',
  styles: [],
})
export class RegisterDocumentationFormComponent
  extends BasePage
  implements OnInit
{
  fileTypes: any[] = [];
  infoOrigins: any[] = [];
  maxDate: Date = new Date();
  @Input() requestId: number;
  registerForm: FormGroup = new FormGroup({});

  fileTypeTestData: any = [
    {
      id: 1,
      description: 'TIPO 1',
    },
    {
      id: 2,
      description: 'TIPO 2',
    },
    {
      id: 3,
      description: 'TIPO 3',
    },
  ];

  infoOriginTestData: any = [
    {
      id: 1,
      description: 'ORIGEN 1',
    },
    {
      id: 2,
      description: 'ORIGEN 2',
    },
    {
      id: 3,
      description: 'ORIGEN 3',
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getSelectElements();
    this.getRequestInfo();
  }

  prepareForm() {
    this.registerForm = this.fb.group({
      priority: [null],
      infoOrigin: [null],
      fileType: [null],
      memorandumNo: [null, [Validators.required]],
      memorandumDate: [null, [Validators.required]],
      subject: [null],
      transferFile: [null, [Validators.required]],
      felony: [null],
      receptionMethod: [null],
      transferType: [null],
      senderName: [null],
      senderPosition: [null],
      senderPhone: [null],
      senderEmail: [null],
      contributor: [null, [Validators.required]],
      judgementType: [null, [Validators.required]],
      judgement: [null],
      observations: [null],
    });
  }

  getSelectElements() {
    // Llamar servicios para llenar los select
    this.fileTypes = this.fileTypeTestData;
    this.infoOrigins = this.infoOriginTestData;
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion adicional de la solicitud
    if (this.requestId !== undefined) {
      const request = {
        receptionDate: '17/04/2018',
        subject: 'NUMERARIO DECOMISADO DEVUELTO',
        contributor: 'Carlos G',
        memorandumNo: 54543,
        memorandumDate: '11/04/2018',
        receptionMethod: 'FÍSICA',
        transferType: 'MANUAL',
      };
      this.registerForm.patchValue(request);
      console.log(this.registerForm.value);
    }
  }
}
