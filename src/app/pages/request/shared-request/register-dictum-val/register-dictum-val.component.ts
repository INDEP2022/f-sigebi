import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CompensationService } from 'src/app/core/services/compensation-option/compensation.option';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-register-dictum-val',
  templateUrl: './register-dictum-val.component.html',
  styles: [],
})
export class RegisterDictumValComponent extends BasePage implements OnInit {
  maxDate: Date = new Date();

  dictumForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<boolean>();

  @Input() requestId = null;

  @Input() steap1: boolean = false;
  @Input() steap2: boolean = false;
  @Input() steap3: boolean = false;
  @Input() isEdit: boolean = false;

  respDoc: Object = null;

  private requestService = inject(RequestService);
  private compenstionService = inject(CompensationService);
  private entryOrderService = inject(orderentryService);

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.getRequestInfo();
    this.getAllCompensation();
    this.getAllOrderEntry();

    this.prepareForm();
  }

  prepareForm() {
    if (this.steap3) {
      this.dictumForm = this.fb.group({
        appoitmentDate: [null, [Validators.required]],
        appoitmentPlace: [
          null,
          [Validators.required, Validators.pattern(STRING_PATTERN)],
        ],
      });
    }

    if (this.steap1 || this.steap2) {
      this.dictumForm = this.fb.group({
        opinionNumber: [
          null,
          [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
        ],
        veredict: [
          null,
          [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
        ],
        nullityTrial: [
          null,
          [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
        ],
      });

      if (!this.isEdit) {
        this.dictumForm.disable();
      }
    }

    if (this.steap2) {
      this.dictumForm = this.fb.group({
        opinionNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
        veredict: [null, [Validators.pattern(NUMBERS_PATTERN)]],
        nullityTrial: [null, [Validators.pattern(NUMBERS_PATTERN)]],
        modificationUser: [null, [Validators.pattern(STRING_PATTERN)]],
        amountToPay: [null],
        opinionDate: [null],
        adminResolutionNo: [null],
        payOrderNo: [null],
        taxpayerDomicile: [null, [Validators.pattern(STRING_PATTERN)]],
        fiscalDomicile: [null, [Validators.pattern(STRING_PATTERN)]],
        legalRepresentative: [null, [Validators.pattern(STRING_PATTERN)]],
        satCopy: [null],
      });

      if (!this.isEdit) {
        this.dictumForm.disable();
      }
    }

    //Configurar cada paso con los campos que se van a mostrar
    /*this.dictumForm = this.fb.group({
      datetime: [null, [this.steap3 ? Validators.required : null]],
      place: [null, [this.steap3 ? Validators.required : null]],

      opinionNumber: [null, [this.steap1 ? Validators.required : null]],
      veredict: [null, [this.steap1 ? Validators.required : null]],
      nullityTrial: [null, [this.steap1 ? Validators.required : null]],

      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      paymentAmount: [null],
      dictumDate: [null],

      adminiResolutionNo: [null],
      paymentOrderNo: [null],
      address1: [null, [Validators.pattern(STRING_PATTERN)]],
      address2: [null, [Validators.pattern(STRING_PATTERN)]],
      legalRepresentative: [null, [Validators.pattern(STRING_PATTERN)]],
      requiredSatCopy: [null],
    });*/
  }

  getAllOrderEntry() {
    // Llamar servicio para obtener informacion de la documentacion de la orden
    const params = new ListParams();
    params['filter.identifier'] = `$eq:${this.requestId}`;
    this.entryOrderService
      .getAllOrderEntry(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          if (!isNullOrEmpty(resp)) {
            this.onSave.emit(true);
            this.dictumForm.patchValue({
              administrativeUnit: parseInt(resp.unitadministrative + ''),
              orderDate: this.datePipe.transform(resp.orderDate, 'dd-MM-yyyy'),
              concept: resp.concept,
              amountToPay: resp.amount,
              referenceNo: resp.numberreference,
              bank: resp.accountBank,
              payOrderNo: resp.id,
            });
          }
        },
      });
  }

  getAllCompensation() {
    // Llamar servicio para obtener informacion de la documentacion de la orden
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${this.requestId}`;
    this.compenstionService
      .getAllcompensation(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          let object = this.dictumForm.getRawValue();

          if (!isNullOrEmpty(resp)) {
            this.dictumForm.patchValue({
              opinionNumber: resp.opinionNumber,
              veredict: resp.veredict,
              nullityTrial: resp.nullityTrial,
            });
          }
        },
      });
  }

  getRequestInfo() {
    // Llamar servicio para obtener informacion de la documentacion de la solicitud
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.requestId}`;
    this.requestService
      .getAll(params)
      .pipe(
        map(x => {
          return x.data[0];
        })
      )
      .subscribe({
        next: resp => {
          if (!isNullOrEmpty(resp)) {
            this.dictumForm.patchValue({
              modificationUser: resp.indicatedTaxpayer,
            });
          }
        },
      });
  }

  createCompensation(compens: Object) {
    this.compenstionService.createcompensation(compens).subscribe({
      next: resp => {
        this.onSave.emit(true);
        this.getRequestInfo();
        this.onLoadToast('success', 'Datos de dictamen guardados con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo guardar los datos del dictamen');
      },
    });
  }

  updatedCompensation(compens: Object) {
    this.compenstionService.updatecompensation(compens).subscribe({
      next: resp => {
        this.onSave.emit(true);
        this.getRequestInfo();
        this.onLoadToast('success', 'Datos de dictamen actualizados con éxito');
      },
      error: error => {
        this.onLoadToast(
          'error',
          'No se pudo actualizar los datos del dictamen'
        );
      },
    });
  }
  save() {
    let date = new Date();
    let object = this.dictumForm.getRawValue();

    object['requestId'] = this.requestId;
    object['orderDate'] = date.toISOString();
    object['appoitmentDate'] = date.toISOString();

    this.onSave.emit(true);

    if (isNullOrEmpty(this.respDoc)) {
      this.createCompensation(object);
    } else {
      this.getAllOrderEntry();
      this.updatedCompensation(object);
    }
  }
}
