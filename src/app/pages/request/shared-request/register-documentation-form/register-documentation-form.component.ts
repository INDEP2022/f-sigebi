import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUM_POSITIVE,
  POSITVE_NUMBERS_PATTERN,
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
  @Input() process?: string = '';
  registerForm: FormGroup = new FormGroup({});
  @Output() onRegister = new EventEmitter<any>();

  priorityCheck: boolean = false;
  bsPriorityDate: any;
  bsReceptionValue: any;
  bsPaperValue: any;
  affair: string = '';
  transference: number = null;
  typeTransference: string = '';
  processDetonate: string = '';

  selectTypeExpedient = new DefaultSelect<any>();
  selectOriginInfo = new DefaultSelect<any>();
  selectMinPub = new DefaultSelect<any>();

  displayNotifyMails: boolean = false;

  /* injections */
  private readonly requestService = inject(RequestService);
  private readonly affairService = inject(AffairService);
  private readonly genericsService = inject(GenericService);
  private readonly minPub = inject(MinPubService);
  /*  */

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.getRequestInfo();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getTypeExpedient(new ListParams());
    this.getOriginInfo(new ListParams());
    this.getRequestInfo();
    this.displayNotifyMailsInput();
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
      receptionDate: [null],
      paperNumber: [null, [Validators.required]],
      transferenceFile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paperDate: [null, [Validators.required]],
      authorityOrdering: [null, [Validators.pattern(STRING_PATTERN)]],
      affair: [null],
      receiptRoute: [null],
      typeOfTransfer: [null],
      nameOfOwner: [null, [Validators.pattern(STRING_PATTERN)]],
      holderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      phoneOfOwner: [
        null,
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(13)],
      ],
      emailOfOwner: [null, [Validators.pattern(EMAIL_PATTERN)]],
      trialType: [null, [Validators.pattern(STRING_PATTERN)]],
      trial: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      circumstantialRecord: [null, [Validators.pattern(STRING_PATTERN)]],
      transferenceId: [null, [Validators.pattern(STRING_PATTERN)]],
      previousInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      lawsuit: [null, [Validators.pattern(STRING_PATTERN)]],
      protectNumber: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      tocaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
      publicMinistry: [null, [Validators.pattern(STRING_PATTERN)]],
      court: [null, [Validators.pattern(STRING_PATTERN)]],
      crime: [null, [Validators.pattern(STRING_PATTERN)]],
      destinationManagement: [null, [Validators.pattern(STRING_PATTERN)]],
      domainExtinction: [null, [Validators.pattern(STRING_PATTERN)]],
      transferEntNotes: [null, [Validators.pattern(STRING_PATTERN)]],
      emailNotification: [null],
    });
  }

  getTypeExpedient(params: ListParams, id?: number | string) {
    params['sortBy'] = 'description:ASC';
    params['filter.name'] = '$eq:Tipo Expediente';
    params.limit = 20;
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectTypeExpedient = new DefaultSelect(data.data, data.count);
      if (id) {
        this.registerForm.controls['typeRecord'].setValue(id);
      }
    });
  }

  getOriginInfo(params?: ListParams, id?: number | string) {
    params['sortBy'] = 'description:ASC';
    params['filter.name'] = '$eq:Procedencia';
    params.limit = 20;
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectOriginInfo = new DefaultSelect(data.data, data.count);
      if (id) {
        this.registerForm.controls['originInfo'].setValue(id);
      }
    });
  }

  getPublicMinister(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.minPub.getAll(params).subscribe({
      next: resp => {
        this.selectMinPub = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  /* METODO QUE LLAMA AL SERVICIO DE SOLICITUDES
  ============================================== */
  getRequestInfo() {
    if (this.requestId) {
      this.requestService.getById(this.requestId).subscribe({
        next: resp => {
          if (resp.urgentPriority) {
            this.priorityCheck = resp.urgentPriority == 'N' ? false : true;
          } else {
            this.priorityCheck = false;
          }

          if (resp.priorityDate) {
            this.bsPriorityDate = this.parseDateNoOffset(resp.priorityDate);
          }

          if (resp.receptionDate) {
            this.bsReceptionValue = this.parseDateNoOffset(resp.receptionDate);
          } else {
            this.bsReceptionValue = new Date();
          }

          if (resp.paperDate) {
            this.bsPaperValue = this.parseDateNoOffset(resp.paperDate);
          }

          this.transference = +resp.transferenceId;
          this.typeTransference = resp.typeOfTransfer;
          this.registerForm.patchValue(resp);
          this.getAffair(resp.affair);
          this.getPublicMinister(new ListParams());
          this.setFieldsRequired();
        },
        error: error => {
          console.log('No se cargaron datos de la solicitud. ', error);
        },
      });
    }
  }

  /* METODO QUE ESTABLECE CAMPOS COMO REQUERIDOS
  ================================================ */
  setFieldsRequired() {
    if (this.transference == 1) {
      this.registerForm.controls['previousInquiry'].setValidators([
        Validators.required,
      ]);
      this.registerForm.controls['circumstantialRecord'].setValidators([
        Validators.required,
      ]);
    } else if (this.transference == 3) {
      this.registerForm.controls['lawsuit'].setValidators([
        Validators.required,
      ]);
      this.registerForm.controls['tocaPenal'].setValidators([
        Validators.required,
      ]);
      this.registerForm.controls['protectNumber'].setValidators([
        Validators.required,
      ]);
    } else if (this.transference == 120) {
      this.registerForm.controls['trialType'].setValidators([
        Validators.required,
      ]);
    }

    if (this.processDetonate == 'AMPARO') {
      this.registerForm.controls['protectNumber'].setValidators([
        Validators.required,
      ]);
    }

    this.registerForm.updateValueAndValidity();
  }

  cancelRequest() {
    this.alertQuestion(
      'question',
      '¿Desea cancelar el registro de la solicitud actual?',
      '',
      'Continuar'
    ).then(question => {
      if (question.isConfirmed) {
        this.registerForm.reset();
        this.getRequestInfo();
        this.registerForm.markAsUntouched();
      }
    });
  }

  register() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea guardar la información de la solicitud?'
    ).then(question => {
      if (question.isConfirmed) {
        const request = this.registerForm.getRawValue();
        if (this.priorityCheck == true && request.priorityDate == null) {
          this.onLoadToast(
            'error',
            'Registro con Prioridad',
            'No se puede enviar la fecha de prioridad vacía'
          );
          return;
        }
        request.receptionDate = this.bsReceptionValue.toISOString();
        request.transferEntNotes =
          request.transferEntNotes == '' ? null : request.transferEntNotes;
        console.log(request);
        this.requestService.update(request.id, request).subscribe({
          next: resp => {
            console.log(resp);
            if (resp.statusCode == 200) {
              this.alert('success', 'Correcto', 'Registro Actualizado');
            }
          },
        });
      }
    });
  }

  changePriority(event: any) {
    let checked = event.currentTarget.checked;
    checked = checked === true ? 'Y' : 'N';
    this.registerForm.controls['urgentPriority'].setValue(checked);
    if (checked === false) {
      this.registerForm.controls['priorityDate'].setValue(null);
      this.bsPriorityDate = null;
    }
  }

  changeReceptionDateEvent(event: any) {
    this.bsReceptionValue = event;

    if (this.bsReceptionValue) {
      const date = this.bsReceptionValue.toISOString();
      this.registerForm.controls['receptionDate'].setValue(date);
    } else {
      this.registerForm.controls['receptionDate'].setValue(null);
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

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  getAffair(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.affair = data.description;
        this.processDetonate = data.processDetonate;
      },
      error: error => {
        console.log('no se encontraron datos en asuntos ', error);
      },
    });
  }

  /* METODO PARA VISUALIZAR EL INPUT NOTIFICACIONES ELECTRONICAS
  =============================================================== */
  displayNotifyMailsInput() {
    if (this.process == 'similar-good-register-documentation') {
      this.displayNotifyMails = true;
    }
  }
}
