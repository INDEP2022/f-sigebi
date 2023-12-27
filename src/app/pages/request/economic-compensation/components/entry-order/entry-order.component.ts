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
import { IOrderEntry } from 'src/app/core/models/ms-order-entry/order-entry.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { isNullOrEmpty } from '../../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-entry-order',
  templateUrl: './entry-order.component.html',
  styles: [],
})
export class EntryOrderComponent extends BasePage implements OnInit {
  entryOrderForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<any>();

  @Input() requestId: number;
  maxDate: Date = new Date();

  respDoc: Object = null;

  data = [
    { id: 1, name: 'UNIDAD ADMINISTRATIVA 1' },
    { id: 2, name: 'UNIDAD ADMINISTRATIVA 2' },
  ];

  selectAdminUnit = new DefaultSelect();

  private entryOrderService = inject(orderentryService);
  private requestService = inject(RequestService);
  private genericsService = inject(GenericService);
  private affairService = inject(AffairService);

  transference: number = null;
  processDetonate: string = '';
  delegationId: string = '';
  typeExpedient: string = '';
  affair: string = '';
  originInfo: string = '';
  indicatedTaxpayer: string = '';
  id: number = null;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.selectAdminUnit = new DefaultSelect(this.data, 2);
    this.prepareForm();

    this.getAllOrderEntry();
    this.getRequestInfo();
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
          this.respDoc = resp;

          this.selectChanges();

          if (!isNullOrEmpty(resp)) {
            this.respDoc = resp;
            this.id = resp.id;

            this.entryOrderForm.patchValue({
              administrativeUnit: parseInt(resp.unitadministrative + ''),
              orderDate: this.datePipe.transform(resp.orderDate, 'dd/MM/yyyy'),
              concept: resp.concept,
              paymentMethod: resp.shapePay,
              amount: resp.amount,
              referenceNo: resp.numberreference,
              bank: resp.accountBank,
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
          this.transference = +resp.transferenceId;
          this.delegationId = resp.regionalDelegationId.toString();
          this.getAffair(resp.affair);
          this.indicatedTaxpayer = resp.indicatedTaxpayer;
        },
      });
  }

  getAffair(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.affair = data.description;
        this.processDetonate = data.processDetonate;
      },
    });
  }

  prepareForm() {
    this.entryOrderForm = this.fb.group({
      administrativeUnit: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      orderDate: [null, [Validators.required]],
      concept: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paymentMethod: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      referenceNo: [null, [Validators.required]],
      bank: [null, [Validators.required]],
    });
  }

  createOrderEntry(orderGood: Object) {
    this.entryOrderService.createOrderEntry(orderGood).subscribe({
      next: resp => {
        this.respDoc = resp;
        this.selectChanges();
        this.getRequestInfo();
        this.onLoadToast('success', 'Orden de bien creada con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo actualizar la order ingreso');
      },
    });
  }

  updateOrderEntry(orderGood: IOrderEntry) {
    this.entryOrderService.updateOrderEntry(orderGood).subscribe({
      next: resp => {
        this.respDoc = resp;
        this.selectChanges();
        this.onLoadToast('success', 'Orden de bien actualizada con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo actualizar la order ingreso');
      },
    });
  }

  save() {
    if (isNullOrEmpty(this.respDoc)) {
      this.createOrderEntry({
        unitadministrative: this.entryOrderForm.value.administrativeUnit,
        shapePay: this.entryOrderForm.value.paymentMethod,
        concept: this.entryOrderForm.value.concept,
        amount: this.entryOrderForm.value.amount,
        numberreference: this.entryOrderForm.value.referenceNo,
        origin: this.originInfo,
        identifier: this.requestId,
        orderDate: this.entryOrderForm.value.orderDate,
        delegationRegionalId: this.delegationId,
        accountBank: this.entryOrderForm.value.bank,
        transfereeId: this.transference,
      });
    } else {
      this.updateOrderEntry({
        id: this.id,
        unitadministrative: this.entryOrderForm.value.administrativeUnit,
        shapePay: this.entryOrderForm.value.paymentMethod,
        concept: this.entryOrderForm.value.concept,
        amount: this.entryOrderForm.value.amount,
        numberreference: this.entryOrderForm.value.referenceNo,
        orderDate: this.entryOrderForm.value.orderDate,
        accountBank: this.entryOrderForm.value.bank,
      });
    }
  }

  selectChanges() {
    this.onSave.emit({
      isValid: !isNullOrEmpty(this.respDoc),
      object: this.respDoc,
    });
  }
}
