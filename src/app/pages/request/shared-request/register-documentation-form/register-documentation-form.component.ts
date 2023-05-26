import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-register-documentation-form',
  templateUrl: './register-documentation-form.component.html',
  styleUrls: ['./register-documentation-form.component.scss'],
})
export class RegisterDocumentationFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  fileTypes: any[] = [];
  infoOrigins: any[] = [];
  maxDate: Date = new Date();
  @Input() requestId: number;
  @Input() subject: string;
  registerForm: FormGroup = new FormGroup({});
  @Output() onRegister = new EventEmitter<any>();

  priorityCheck: boolean = false;
  bsPriorityDate: any;
  bsReceptionValue = new Date();
  bsPaperValue: any;

  selectTypeExpedient = new DefaultSelect<any>();
  selectOriginInfo = new DefaultSelect<any>();

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

  ngOnChanges(changes: SimpleChanges): void {
    this.getRequestInfo();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getTypeExpedient();
    this.getRequestInfo();
  }

  prepareForm() {
    this.registerForm = this.fb.group({
      id: [null],
      urgentPriority: ['N'],
      priorityDate: [null],
      indicatedTaxpayer: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeRecord: [null],
      originInfo: [null],
      receptionDate: [null, [Validators.required]],
      paperNumber: [null, [Validators.required]],
      transferenceFile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paperDate: [null, [Validators.required]],
      authorityOrdering: [null, Validators.pattern(STRING_PATTERN)],
      affair: [this.subject],
      receiptRoute: [null],
      typeOfTransfer: [null],
      nameOfOwner: [null, [Validators.pattern(STRING_PATTERN)]],
      holderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      phoneOfOwner: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ],
      emailOfOwner: [null, [Validators.pattern(EMAIL_PATTERN)]],
      trialType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      trial: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getTypeExpedient(param?: ListParams) {
    // Llamar servicios para llenar los select
    this.selectTypeExpedient = new DefaultSelect();
    //this.fileTypes = this.fileTypeTestData;
    //this.infoOrigins = this.infoOriginTestData;
  }

  getOriginInfo(param?: ListParams) {
    this.selectOriginInfo = new DefaultSelect();
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion adicional de la solicitud
    if (this.requestId !== undefined) {
      console.log('requestId', this.requestId);
      /*const request = {
        receptionDate: '17/04/2018',
        contributor: 'Carlos G',
        memorandumNo: 54543,
        memorandumDate: '11/04/2018',
        receptionMethod: 'FÍSICA',
        transferType: 'MANUAL',
      };*/
      //this.registerForm.patchValue(request);
      //console.log(this.registerForm.value);
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

  changePriority(event: any) {
    let checked = event.currentTarget.checked;
    checked = checked === true ? 'Y' : 'N';
    this.registerForm.controls['urgentPriority'].setValue(checked);
    if (checked === false) {
      this.registerForm.controls['priorityDate'].setValue(null);
      //this.bsPriorityDate = null;
    }
  }

  changeDateEvent(event: any) {
    this.bsPaperValue = event;
    if (this.bsPaperValue) {
      const date = this.bsPaperValue.toISOString();
      this.registerForm.controls['paperDate'].setValue(date);
    } else {
      this.registerForm.controls['paperDate'].setValue(null);
    }
  }

  changePriorityDateEvent(event: any) {
    this.bsPriorityDate = event;

    if (this.bsPriorityDate) {
      const date = this.bsPriorityDate.toISOString();
      this.registerForm.controls['priorityDate'].setValue(date);
    } else {
      this.registerForm.controls['priorityDate'].setValue(null);
    }
  }
}
