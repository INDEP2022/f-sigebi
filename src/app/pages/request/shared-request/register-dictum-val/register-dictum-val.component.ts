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
  @Output() onSave = new EventEmitter<any>();
  @Output() onAppoiment = new EventEmitter<any>();

  @Input() requestId = null;

  @Input() steap1: boolean = false;
  @Input() steap2: boolean = false;
  @Input() steap3: boolean = false;
  @Input() isEdit: boolean = false;

  @Input() visible: boolean = false;

  respDoc: Object = null;
  respDate: Object = null;

  private requestService = inject(RequestService);
  private compenstionService = inject(CompensationService);
  private entryOrderService = inject(orderentryService);

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.getRequestInfo();
    this.getAllOrderEntry();
    this.getAllCompensation();
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

    if (this.steap1) {
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
        amountToPay: [null],
        payOrderNo: [null],
        opinionNumber: [
          Validators.required,
          [Validators.pattern(NUMBERS_PATTERN)],
        ],
        veredict: [Validators.required, [Validators.pattern(NUMBERS_PATTERN)]],
        nullityTrial: [
          Validators.required,
          [Validators.pattern(NUMBERS_PATTERN)],
        ],
        modificationUser: [null, [Validators.pattern(STRING_PATTERN)]],
        opinionDate: [null],
        adminResolutionNo: [null],
        taxpayerDomicile: [null, [Validators.pattern(STRING_PATTERN)]],
        fiscalDomicile: [null, [Validators.pattern(STRING_PATTERN)]],
        legalRepresentative: [null, [Validators.pattern(STRING_PATTERN)]],
        satCopy: [null],
      });

      if (!this.isEdit) {
        this.dictumForm.disable();
      }

      //this.dictumForm.get('payOrderNo').disable();
      //this.dictumForm.get('amountToPay').disable();
    }
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
            this.dictumForm.patchValue({
              adminResolutionNo: parseInt(resp.unitadministrative + ''),
              orderDate: this.datePipe.transform(resp.orderDate, 'dd/MM/yyyy'),
              concept: resp.concept,
              amountToPay: resp.amount,
              referenceNo: resp.numberreference,
              bank: resp.accountBank,
              payOrderNo: resp.id,
            });
          }
        },
        error: error => {},
      });
  }

  getAllCompensation() {
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
          this.respDoc = resp;

          this.selectChanges();
          if (!isNullOrEmpty(resp)) {
            this.dictumForm.patchValue({
              appoitmentDate: this.datePipe.transform(
                resp.appoitmentDate,
                'dd/MM/yyyy, h:mm:ss a'
              ),
              appoitmentPlace: resp.appoitmentPlace,
              opinionNumber: resp.opinionNumber,
              veredict: resp.veredict,
              nullityTrial: resp.nullityTrial,
              opinionDate: this.datePipe.transform(
                resp.opinionDate,
                'dd/MM/yyyy'
              ),
              legalRepresentative: resp.legalRepresentative,
              adminResolutionNo: resp.adminResolutionNo,
              taxpayerDomicile: resp.taxpayerDomicile,
              fiscalDomicile: resp.fiscalDomicile,
              satCopy: this.val(resp.satCopy),
            });
          }
        },
        error: error => {},
      });
  }

  val(check) {
    if (check == 1) {
      return true;
    } else {
      return false;
    }
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
        error: error => {},
      });
  }

  createCompensation(compens: Object) {
    this.compenstionService.createcompensation(compens).subscribe({
      next: resp => {
        if (this.steap3) {
          this.respDate = resp;
        }

        this.respDoc = resp;

        this.selectChanges();
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
        if (this.steap3) {
          this.respDate = resp;
        }
        this.respDoc = resp;

        this.selectChanges();
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
    if (this.steap1) {
      object['appoitmentDate'] = null;
    }

    if (this.steap2) {
      const isChecked = this.dictumForm.get('satCopy').value;
      object['satCopy'] = isChecked ? 1 : 0;
    }

    this.onSave.emit(true);

    if (isNullOrEmpty(this.respDoc || this.respDate)) {
      this.createCompensation(object);
      this.getAllCompensation();
    } else {
      this.updatedCompensation(object);
      this.getAllOrderEntry();
    }
  }

  selectChanges() {
    if (this.steap1) {
      console.log('steap1');
      this.onSave.emit({
        isValid: !isNullOrEmpty(this.respDoc),
        object: this.respDoc,
      });
    }
    if (this.steap3) {
      console.log('steap3');
      this.onAppoiment.emit({
        isValid: !isNullOrEmpty(this.respDate),
        object: this.respDate,
      });
    }
  }
}
