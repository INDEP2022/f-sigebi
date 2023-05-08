import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IRequest } from '../../../../../../core/models/requests/request.model';
import { AffairService } from '../../../../../../core/services/catalogs/affair.service';

@Component({
  selector: 'app-request-record-tab',
  templateUrl: './request-record-tab.component.html',
  styles: [],
})
export class RequestRecordTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() pgr: boolean;
  @Input() requestForm: ModelForm<IRequest>;
  requiredFieldText: 'Campo requerido';
  submitted = false;
  bsReceptionValue = new Date();
  bsPaperValue: any;
  bsPriorityDate: any;
  bsligDate: any;
  bsverifiyDate: any;
  selectTypeExpedient = new DefaultSelect<any>();
  selectOriginInfo = new DefaultSelect<any>();
  selectMinPub = new DefaultSelect<any>();
  affairName: string = '';
  datePaper: any;
  transf: boolean = false;
  priority: boolean = false;
  priorityString: string = 'N';
  transferenceNumber: number = 0;
  typeOfTransfer: string;
  formLoading: boolean = false;
  transfe: string = '';
  paperDateLabel: any = '';
  rem: string = 'del Remitente';
  maxDate = new Date();
  constructor(
    public fb: FormBuilder,
    private affairService: AffairService,
    private genericsService: GenericService,
    private requestService: RequestService,
    private minPub: MinPubService,
    private transferenteService: TransferenteService
  ) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    /*this.requestForm.valueChanges.subscribe({
      next: resp => {},
    });*/
  }

  ngOnInit(): void {
    this.getOriginInfo(new ListParams());
    this.getTypeExpedient(new ListParams());
    this.getPublicMinister(new ListParams());
    //estable el campo para preguntar en la vista si es del tipo 1 o 3
    if (this.requestForm.controls['transferenceId'].value != null) {
      this.transferenceNumber = Number(
        this.requestForm.controls['transferenceId'].value
      );
      // this.getTrans(this.transferenceNumber);
    }
    if (this.requestForm.controls['typeOfTransfer'].value != null) {
      this.typeOfTransfer = this.requestForm.controls['typeOfTransfer'].value;
      this.getTrans(this.typeOfTransfer);
    }
    //this.prepareForm();
    if (this.requestForm.controls['paperDate'].value != null) {
      const paperDate = this.requestForm.controls['paperDate'].value;
      this.bsPaperValue = new Date(paperDate);
    }

    // if (this.requestForm.controls['receptionDate'].value != null) {
    //    this.bsPaperValue = new Date();
    // }

    //establecer el asunto
    if (this.requestForm.controls['affair'].value != null) {
      this.getAffair(this.requestForm.controls['affair'].value);
    }

    //establece el campo fecha de oficio
    if (this.requestForm.controls['urgentPriority'].value) {
      //establece el campo urgente
      this.priorityString = this.requestForm.controls['urgentPriority'].value;

      this.priority =
        this.requestForm.controls['urgentPriority'].value === 'Y'
          ? true
          : false;
      //this.requestForm.controls['urgentPriority'].setValue(this.priority);
    }

    if (this.requestForm.controls['urgentPriority'].value === 'Y') {
      const priDate = this.requestForm.controls['priorityDate'].value;
      this.bsPriorityDate = new Date(priDate);
    }

    if (this.requestForm.controls['affair'].value != null) {
      this.getAffair(this.requestForm.controls['affair'].value);
    }
  }
  prepareForm() {
    //formulario de solicitudes
    this.requestForm = this.fb.group({
      applicationDate: [null],
      recordId: [null],
      paperNumber: [null, [Validators.maxLength(30)]],
      regionalDelegationId: [null],
      keyStateOfRepublic: [null],
      transferenceId: [null],
      stationId: [null],
      authorityId: [null],
      //typeUser: [''],
      //receiUser: [''],
      id: [null],
      urgentPriority: ['N'],
      priorityDate: [null],
      originInfo: [null],
      receptionDate: [null],
      paperDate: [null, [Validators.required]], //requerido
      typeRecord: [null],
      publicMinistry: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      nameOfOwner: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //nombre remitente
      holderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //cargo remitente
      phoneOfOwner: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ], //telefono remitente
      emailOfOwner: [
        null,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(100)],
      ], //email remitente
      court: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      crime: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      receiptRoute: [null],
      destinationManagement: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      indicatedTaxpayer: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(200)],
      ],
      affair: [null],
      transferEntNotes: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      transferenceFile: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      previousInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      trialType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      circumstantialRecord: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      lawsuit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      tocaPenal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      protectNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      typeOfTransfer: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.requestForm.get('receptionDate').disable();
  }

  getPublicMinister(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.minPub.getAll(params).subscribe({
      next: resp => {
        this.selectMinPub = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getTypeExpedient(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    params['filter.name'] = '$eq:Tipo Expediente';
    params.limit = 20;
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectTypeExpedient = new DefaultSelect(data.data, data.count);
    });
  }

  getOriginInfo(params?: ListParams) {
    params['sortBy'] = 'description:ASC';
    params['filter.name'] = '$eq:Procedencia';
    params.limit = 20;
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectOriginInfo = new DefaultSelect(data.data, data.count);
    });
  }

  getAffair(id: number) {
    let params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.nbOrigen'] = `$eq:SAMI`;
    this.affairService.getAll(params).subscribe({
      next: ({ data }) => {
        this.affairName = data[0].description;
      },
      error: error => {
        this.affairName = '';
      },
    });
  }

  getTrans(transference: string) {
    if (transference === 'MANUAL' || transference === 'SAT_SAE') {
      this.transfe = this.rem;
    } else {
      this.transfe = 'MP';
    }
  }

  changeDateEvent(event: Date) {
    this.bsPaperValue = event;
    if (this.bsPaperValue) {
      const d1 = this.bsPaperValue.toISOString();
      this.requestForm.controls['paperDate'].setValue(d1);
    } else {
      this.requestForm.controls['paperDate'].setValue(null);
    }
  }
  changeVerEvent(event: Date) {
    this.bsverifiyDate = event;

    if (this.bsverifiyDate) {
      const date = this.bsverifiyDate.toISOString();
      this.requestForm.controls['verificationDateCump'].setValue(date);
    } else {
      this.requestForm.controls['verificationDateCump'].setValue(null);
    }
  }

  changeLigEvent(event: Date) {
    this.bsligDate = event ? event : this.bsligDate;

    if (this.bsligDate) {
      //TODO: VERIFICAR LA FECHA
      let date = new Date(this.bsligDate);
      var dateIso = date.toISOString();
      const lig = this.bsligDate.toISOString();
      this.requestForm.controls['fileLeagueDate'].setValue(lig);
    }
  }
  changePriorityDateEvent(event: Date) {
    this.bsPriorityDate = event;

    if (this.bsPriorityDate) {
      const date = this.bsPriorityDate.toISOString();
      this.requestForm.controls['priorityDate'].setValue(date);
    } else {
      this.requestForm.controls['priorityDate'].setValue(null);
    }
  }

  changePriority(event: any) {
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.priorityString = value;
    this.requestForm.controls['urgentPriority'].setValue(value);
    if (checked === false) {
      this.requestForm.controls['priorityDate'].setValue(null);
      this.bsPriorityDate = null;
    }
  }

  async confirm() {
    if (
      this.typeOfTransfer === 'PGR_SAE' ||
      this.typeOfTransfer === 'FGR_SAE'
    ) {
      if (
        this.requestForm.get('paperDate').value === null ||
        this.requestForm.get('paperDate').value === '' ||
        this.requestForm.get('previousInquiry').value === null ||
        this.requestForm.get('previousInquiry').value === '' ||
        this.requestForm.get('circumstantialRecord').value === null ||
        this.requestForm.get('circumstantialRecord').value === ''
      ) {
        this.message(
          'info',
          'Campos requeridos',
          'Recuerde llenar los campos obligatorios'
        );
        this.requestForm.markAllAsTouched();
        return;
      }
    } else {
      if (
        this.requestForm.get('paperDate').value === null ||
        this.requestForm.get('paperDate').value === ''
      ) {
        this.message(
          'info',
          'Campos requeridos',
          'Recuerde llenar los campos obligatorios'
        );
        this.requestForm.markAllAsTouched();
        return;
      }
    }
    this.loading = true;
    this.submitted = true;
    const request = this.requestForm.getRawValue() as IRequest;
    Object.keys(request).forEach((key: any) => {
      if (
        typeof (request as any)[key] === 'string' &&
        (request as any)[key]?.trim() === ''
      ) {
        (request as any)[key] = null;
      }
    });
    request.transferEntNotes = request.transferEntNotes
      ? request.transferEntNotes
      : null;
    //request.court = request.court ? request.court : null;
    this.formLoading = true;
    const requestResult = await this.updateRequest(request);
    if (requestResult === true) {
      this.message(
        'success',
        'Guardado',
        'Se guardó la solicitud correctamente'
      );
    } else {
      this.message('error', 'Error', 'No se guardó la solicitud');
    }
  }

  updateRequest(request: any) {
    return new Promise((resolve, reject) => {
      this.requestService.update(request.id, request).subscribe({
        next: (resp: any) => {
          if (resp.statusCode == 200) {
            resolve(true);
          }

          if (resp.statusCode != 200) {
            resolve(false);
            this.message('error', 'Error', `No se guardó la solicitud.`);
          }
          this.formLoading = false;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.formLoading = false;
          this.message(
            'error',
            'Error',
            `No se guardó la solicitud. ${error.error.message}`
          );
          reject(false);
        },
      });
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  requiredFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.requestForm.updateValueAndValidity();
  }
}
