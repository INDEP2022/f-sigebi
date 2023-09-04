import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrderEntryEndpoints } from 'src/app/common/constants/endpoints/ms-orderentry-endpoint';
import { IProgrammingDeliveryGood } from 'src/app/core/models/good-programming/programming-delivery-good.model';
import { IGoodOrderEntry } from 'src/app/core/models/ms-order-entry/good-order-entry.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared';
import {
  DOUBLE_POSITIVE_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

const data = [
  { id: 1, name: 'UNIDAD ADMINISTRATIVA 1' },
  { id: 2, name: 'UNIDAD ADMINISTRATIVA 2' },
];

@Component({
  selector: 'app-entry-order-modal',
  templateUrl: './entry-order-modal.component.html',
  styles: [],
})
export class EntryOrderModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  selectAdminUnit = new DefaultSelect();
  goods: any = [];

  auth: any = null;

  private fb = inject(FormBuilder);
  private bsModalService = inject(BsModalRef);
  private entryOrderService = inject(orderentryService);
  private programmingGoodService = inject(ProgrammingGoodService);
  private authService = inject(AuthService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      institutionBanking: [null, [Validators.pattern(STRING_PATTERN)]],
      concept: [null, [Validators.pattern(STRING_PATTERN)]],
      shapePay: ['DEPOSITO', [Validators.pattern(STRING_PATTERN)]],
      amount: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      numberreference: [null, [Validators.pattern(PHONE_PATTERN)]],
      thirdesp: [null, [Validators.pattern(STRING_PATTERN)]],
      unitadministrative: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.selectAdminUnit = new DefaultSelect(data, 2);
    this.auth = this.authService.decodeToken();
    console.log(this.auth);
  }

  confirm() {
    /**
     * Falta implementar el guardado
     */
    window.alert('Aun no se guarda la orde de ingreso');
    let orderEntry = this.form.getRawValue();

    //itera programming delivery good
    this.goods.map(async (item: IProgrammingDeliveryGood) => {
      orderEntry.delegationRegionalId = item.delReg;
      const orderCreated: any = await this.createEntryOrder(orderEntry);

      const body: any = {
        id: item.id,
        entryOrderDedId: orderCreated.id,
      };
      //const goodUpdated = await this.updatedProgDeliveryGood(body);

      const body2: any = {
        transactionId: item.id,
        userCreation: this.auth.userCreation,
        userModification: this.auth.userCreation,
        creationDate: moment(new Date()).format('YYYY/MM/DD'),
        modificationDate: moment(new Date()).format('YYYY/MM/DD'),
      };
      //const createOrdGood = await this.createGoodOrderEntry(body);
    });
  }

  close() {
    this.bsModalService.hide();
  }

  createEntryOrder(body: OrderEntryEndpoints) {
    return new Promise((resolve, reject) => {
      this.entryOrderService.createOrderEntry(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error);
          reject(error);
          this.onLoadToast('error', 'No se pudo crear la orden de ingreso');
        },
      });
    });
  }

  updatedProgDeliveryGood(body: IProgrammingDeliveryGood) {
    return new Promise((resolve, reject) => {
      this.programmingGoodService
        .updateProgrammingDeliveryGood(body.id, body)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            console.log(error);
            reject(error);
            this.onLoadToast('error', 'No se pudo actualizar la programación');
          },
        });
    });
  }

  createGoodOrderEntry(orderGood: IGoodOrderEntry) {
    return new Promise((resolve, reject) => {
      this.entryOrderService.createGoodOrderEntry(orderGood).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error);
          reject(error);
          this.onLoadToast('error', 'No se pudo actualizar la order de bien');
        },
      });
    });
  }
}
