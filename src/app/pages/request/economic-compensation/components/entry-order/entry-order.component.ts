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
  toggleInformation = true;

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

          let object = this.entryOrderForm.getRawValue();

          if (!isNullOrEmpty(resp)) {
            this.respDoc = resp;
            this.id = resp.id;
            console.log(resp.id);

            resp.unitadministrative = parseInt(resp.unitadministrative + '');
            resp.orderDate = this.datePipe.transform(
              resp.orderDate,
              'dd/MM/yyyy'
            );

            this.entryOrderForm.patchValue(resp);
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
      unitadministrative: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      orderDate: [null, [Validators.required]],
      concept: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      shapePay: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      numberreference: [null, [Validators.required]],
      accountBank: [null, [Validators.required]],
    });
  }

  createOrderEntry(orderGood: Object) {
    this.entryOrderService.createOrderEntry(orderGood).subscribe({
      next: resp => {
        this.respDoc = resp;
        this.selectChanges();
        this.getRequestInfo();
        this.getAllOrderEntry();
        this.onLoadToast('success', 'Orden de ingreso creada con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo actualizar la orden ingreso');
      },
    });
  }

  updateOrderEntry(orderGood: IOrderEntry) {
    this.entryOrderService.updateOrderEntry(orderGood).subscribe({
      next: resp => {
        this.respDoc = resp;
        this.getAllOrderEntry();
        this.selectChanges();
        this.onLoadToast('success', 'Orden de ingreso actualizada con éxito');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo actualizar la orden ingreso');
      },
    });
  }

  save() {
    let object = this.entryOrderForm.getRawValue();
    if (isNullOrEmpty(this.respDoc)) {
      object['identifier'] = this.requestId;
      object['origin'] = this.originInfo;
      object['delegationRegionalId'] = this.delegationId;
      object['transfereeId'] = this.transference;

      this.createOrderEntry(object);
    } else {
      let orderDate = new Date(object['orderDate']);
      object['orderDate'] = orderDate;
      object['id'] = this.id;
      this.updateOrderEntry(object);
    }
  }

  selectChanges() {
    this.onSave.emit({
      isValid: !isNullOrEmpty(this.respDoc),
      object: this.respDoc,
    });
  }
}
