import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { CheckDetailComponent } from '../check-detail/check-detail.component';
import { PaymentRequestItemsComponent } from '../payment-request-items/payment-request-items.component';
//Models
import { ICheck } from 'src/app/core/models/administrative-processes/siab-sami-interaction/check.model';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//Provisional Data

@Component({
  selector: 'app-payment-request',
  templateUrl: './payment-request.component.html',
  styles: [],
})
export class PaymentRequestComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  check: ICheck;

  data: LocalDataSource = new LocalDataSource();
  dataPartidas: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  //Range Picker
  dateSelected?: (Date | undefined)[];
  selectedClass: any[] = [];
  maxDate = new Date(new Date().getFullYear(), 11);
  minDate = new Date(new Date().getFullYear(), 0);

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: false, delete: true, edit: true },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();

    this.form.get('requestDocs').valueChanges.subscribe(value => {
      if (value === 'rbt_post') {
        this.form.controls['taxReceipts'].setValidators([Validators.required]);
        this.form.controls['taxReceipts'].updateValueAndValidity();
      }

      this.form.controls['taxReceipts'].clearValidators();
      this.form.controls['taxReceipts'].setValue(null);
      this.form.controls['taxReceipts'].updateValueAndValidity();
    });
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      requestDate: [null, [Validators.required]],
      folioNumber: [null, [Validators.required]],
      paymentNumber: [null, [Validators.required]],
      procedureNumber: [null, [Validators.required]],
      concept: [null, [Validators.required]],
      requestArea: [null, [Validators.required]],
      address: [null, [Validators.required]],
      taxpayer: [null, [Validators.required]],
      amountRequested: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      contractNumber: [null, [Validators.required]],
      status: [null, [Validators.required]],
      operationType: [null, [Validators.required]],
      description: [null, [Validators.required]],
      adjudgmentType: [null, [Validators.required]],
      capturingUser: [null, [Validators.required]],
      authorizingUser: [null, [Validators.required]],
      requestingUser: [null, [Validators.required]],
      requestMonths: [null, [Validators.required]],
      paymentType: [null, [Validators.required]],
      specialInstructions: [null, [Validators.required]],
      requestDocs: [null, [Validators.required]],
      taxReceipts: [null],
      docsDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      contractRecNumber: [null, [Validators.required]],
      contractRecDate: [null, [Validators.required]],
      voucherNumber: [null, [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openModal(context?: Partial<PaymentRequestItemsComponent>): void {
    const modalRef = this.modalService.show(PaymentRequestItemsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      if (data)
        if (!this.dataPartidas.find(dp => dp.cabms == data.cabms)) {
          this.dataPartidas.push(data);
          this.data.load(this.dataPartidas);
        } else {
          this.onLoadToast('info', 'Info', 'CABMS ya existe');
        }
    });
  }

  removeItem(cabms: string): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar esta partida?'
    ).then(question => {
      if (question.isConfirmed) {
        const index = this.dataPartidas.indexOf((dp: any) => dp.cabms == cabms);
        this.dataPartidas.splice(index, 1);
        this.data.load(this.dataPartidas);
      }
    });
  }

  updateItem(partida?: any): void {
    this.openModal({ edit: true, partida });
  }

  openModalCheck(context?: Partial<CheckDetailComponent>): void {
    const modalRef = this.modalService.show(CheckDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      if (data) this.check = data;
      this.onLoadToast('info', 'Info', 'Cheque agregado');
    });
  }

  removeCheck(): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este cheque?'
    ).then(question => {
      if (question.isConfirmed) {
        this.check = null;
      }
    });
  }

  updateCheck(check: ICheck): void {
    this.openModalCheck({ edit: true, check });
  }

  /*getDateItem(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }*/

  /*onValueChange(event:any) {
    console.log(event)
    if (event === undefined) { 
      const date = this.getDateItem(event);
      
      const index = this.dateSelected.findIndex(item => {
        const testDate = this.getDateItem(item);
        return testDate === date;
      });

      console.log('Date', date, index);

      if (index < 0) {
        this.dateSelected.push(event);
      }
      else {
        this.dateSelected.splice(index, 1);
      }
    }

    
    if (this.dateSelected.length > 0) {
      this.selectedClass = this.dateSelected.map(date => {
        return {
          date, 
          classes: ['custom-selected-date']
        }
      })
    }
  }*/
}
