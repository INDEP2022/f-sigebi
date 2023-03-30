import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-documentation-form',
  templateUrl: './register-documentation-form.component.html',
  styleUrls: ['./register-documentation-form.component.scss'],
})
export class RegisterDocumentationFormComponent
  extends BasePage
  implements OnInit
{
  fileTypes: any[] = [];
  infoOrigins: any[] = [];
  maxDate: Date = new Date();
  @Input() requestId: number;
  @Input() subject: string;
  registerForm: FormGroup = new FormGroup({});
  @Output() onRegister = new EventEmitter<any>();

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
      contributor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fileType: [null],
      infoOrigin: [null],
      receptionDate: [null, [Validators.required]],
      memorandumNo: [null, [Validators.required]],
      transferFile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      memorandumDate: [null, [Validators.required]],
      subject: [this.subject],
      receptionMethod: [null],
      transferType: [null],
      senderName: [null, [Validators.pattern(STRING_PATTERN)]],
      senderPosition: [null, [Validators.pattern(STRING_PATTERN)]],
      senderPhone: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ],
      senderEmail: [null, [Validators.pattern(EMAIL_PATTERN)]],
      judgementType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      judgement: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
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

  cancelRequest() {
    this.alertQuestion(
      'question',
      '¿Desea cancelar el registro de la solicitud actual?',
      '',
      'Cancelar Solicitud'
    ).then(question => {
      if (question.isConfirmed) {
        this.registerForm.reset();
        this.getRequestInfo();
        this.registerForm.markAsUntouched();
      }
    });
  }

  register() {
    // Llamar servicio para registrar solcitud
    this.onRegister.emit(this.registerForm.value);
    this.alert('success', 'Solicitud registrada con éxito', '');
  }
}
