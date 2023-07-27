import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IReceiptItem } from '../../receipt-generation-sami/receipt-table-goods/ireceipt';
import {
  RECEIPTGENERATION_COLUMNS,
  WISTNESS_COLUMNS,
} from './receipt-generation-columns';

@Component({
  selector: 'app-receipt-generation',
  templateUrl: './receipt-generation.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }
    `,
  ],
})
export class ReceiptGenerationComponent extends BasePage implements OnInit {
  receiptGenerationForm: FormGroup;
  receiptGenerationFirmForm: FormGroup;
  receiptForm: FormGroup;
  settings2 = { ...this.settings, actions: false };
  goodsList = new DefaultSelect();
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  programmingForm: FormGroup;
  fileProgrammingForm: FormGroup;
  folio: string;
  count = 0;

  constructor(
    private fb: FormBuilder,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: RECEIPTGENERATION_COLUMNS,
    };
    this.settings2.columns = WISTNESS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.programmingForm = this.fb.group({
      programmingId: [null, Validators.required],
      managementId: [null],
    });
    this.fileProgrammingForm = this.fb.group({
      file: [null, Validators.required],
    });
    this.receiptGenerationForm = this.fb.group({
      updateInformation: [null, Validators.required],
      receipt: [null, Validators.required],
      guard: [null, Validators.required],
      store: [null, Validators.required],
      reprogramming: [null, Validators.required],
      cancellation: [null, Validators.required],
    });
    this.receiptGenerationFirmForm = this.fb.group({
      management: [null, Validators.required],
      uniqueKey: [null, Validators.required],
      proceedings: [null, Validators.required],
      descriptionTransferee: [null, Validators.required],
      descriptionIn: [null, Validators.required],
      transferAmount: [null, Validators.required],
      amountIn: [null, Validators.required],
      transferUnitMeasure: [null, Validators.required],
      unitMeasureIn: [null, Validators.required],
      transferringPhysicalState: [null, Validators.required],
      physicalStateIn: [null, Validators.required],
      transferringStateConservation: [null, Validators.required],
      stateConservationIn: [null, Validators.required],
      fateBinds: [null, Validators.required],
      destinyIn: [null, Validators.required],
      transferDestination: [null, Validators.required],
      cancellation: [null, Validators.required],
      reprogramming: [null, Validators.required],
    });
    this.receiptForm = this.fb.group({
      nameDelivery: [null, Validators.required],
      deliveryType: [null, Validators.required],
      chargeDelivers: [null, Validators.required],
      plateNumber: [null, Validators.required],
      seal: [null, Validators.required],
      nameReceives: [null, Validators.required],
      observations: [null, Validators.required],
      firmElectronic: [null, Validators.required],
    });
    this.programmingForm.controls['managementId'].disable();
  }
  chargeFile(event: any) {}
  searchPrograming() {
    this.loader.load = true;
    this.programmingGoodReceipt(new ListParams());
  }
  programmingGoodReceipt(params: ListParams) {
    if (this.programmingForm.controls['programmingId'].value) {
      params['filter.folio'] =
        this.programmingForm.controls['programmingId'].value.trim();
      this.folio = this.programmingForm.controls['programmingId'].value.trim();
    } else {
      this.alert(
        'warning',
        'Generación de Recibos',
        'Ingresa una Programación'
      );
      return;
    }
    this.programmingGoodReceiptService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.goodsList = new DefaultSelect(resp.data, resp.count);
        this.count = resp.count ?? 0;
        this.programmingForm.controls['managementId'].enable();
        this.loader.load = false;
      },
      error: eror => {
        this.loader.load = false;
        this.count = 0;
        this.goodsList = new DefaultSelect([], 0, true);
        this.alert(
          'warning',
          'Generación de Recibos',
          'Esta Programación no tienes Bienes'
        );
      },
    });
  }
  searchManagement(data: IReceiptItem) {}
}
