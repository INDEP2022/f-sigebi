import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { secondFormatDateToDateAny } from 'src/app/shared/utils/date';
import { IContract } from '../../../models/payment';
import { ExpenseCaptureDataService } from '../../../services/expense-capture-data.service';
import { ExpensePaymentService } from '../../../services/expense-payment.service';
import { COLUMNS } from './contract-columns';
import { ContractsModalComponent } from './contracts-modal/contracts-modal.component';

@Component({
  selector: 'app-data-receipt',
  templateUrl: './data-receipt.component.html',
  styleUrls: ['./data-receipt.component.scss'],
})
export class DataReceiptComponent implements OnInit {
  @Input() set expense(value: IComerExpense) {
    if (value) {
      console.log(value);
      this.invoiceRecNumber.setValue(value.invoiceRecNumber);
      this.numReceipts.setValue(value.numReceipts);
      this.invoiceRecDate.setValue(
        secondFormatDateToDateAny(value.invoiceRecDate)
      );
      this.payDay.setValue(secondFormatDateToDateAny(value.payDay));
      this.captureDate.setValue(secondFormatDateToDateAny(value.captureDate));
      this.fecha_contrarecibo.setValue(
        secondFormatDateToDateAny(value.fecha_contrarecibo)
      );
      this.attachedDocumentation.setValue(value.attachedDocumentation);
      this.monthExpense.setValue(value.monthExpense ? true : false);
      this.monthExpense2.setValue(value.monthExpense2 ? true : false);
      this.monthExpense3.setValue(value.monthExpense3 ? true : false);
      this.monthExpense4.setValue(value.monthExpense4 ? true : false);
      this.monthExpense5.setValue(value.monthExpense5 ? true : false);
      this.monthExpense6.setValue(value.monthExpense6 ? true : false);
      this.monthExpense7.setValue(value.monthExpense7 ? true : false);
      this.monthExpense8.setValue(value.monthExpense8 ? true : false);
      this.monthExpense9.setValue(value.monthExpense9 ? true : false);
      this.monthExpense10.setValue(value.monthExpense10 ? true : false);
      this.monthExpense11.setValue(value.monthExpense11 ? true : false);
      this.monthExpense12.setValue(value.monthExpense12 ? true : false);
      this.exchangeRate.setValue(+value.exchangeRate);
      this.formPayment.setValue(value.formPayment);
      this.comproafmandsae.setValue(value.comproafmandsae);
      this.capturedUser.setValue(value.capturedUser);
      this.authorizedUser.setValue(value.authorizedUser);
      this.requestedUser.setValue(value.requestedUser);
      this.nomEmplcapture.setValue(value.nomEmplcapture);
      this.nomEmplAuthorizes.setValue(value.nomEmplAuthorizes);
      this.nomEmplRequest.setValue(value.nomEmplRequest);
      this.typepe.setValue(value.typepe);
      this.tiptram.setValue(value.tiptram);

      this.adj.setValue(value.adj);
      if (value.contractNumber) {
        this.contractNumber.setValue(value.contractNumber);
        this.paymentService
          .validateContract(value.contractNumber)
          .pipe(take(1))
          .subscribe({
            next: response => {
              if (response.data && response.data.length > 0) {
                this.form
                  .get('contractDescription')
                  .setValue(response.data[0].desContract);
                this.form
                  .get('descontract')
                  .setValue(response.data[0].desContract);
                this.form.get('clkpv').setValue(response.data[0].clkpv);
                this.form.get('padj').setValue(response.data[0].padj);
                this.form.get('psadj').setValue(response.data[0].psadj);
                this.form.get('pssadj').setValue(response.data[0].pssadj);
                this.form.get('adj').setValue(response.data[0].adj);
              }
            },
          });
      }
    }
  }
  listPayments = ['TRANSFERENCIA', 'CHEQUE', 'INTERCAMBIO'];
  columns = { ...COLUMNS };
  listComproaf = [
    { id: '1', value: 'INDEP' },
    { id: '2', value: 'MANDATO' },
  ];
  constructor(
    private dataService: ExpenseCaptureDataService,
    public paymentService: ExpensePaymentService,
    private modalService: BsModalService
  ) {
    // SearchFilter.NOT;
  }

  get pathEmpleados() {
    return 'interfacesirsae/api/v1/sirsae/obt-employees';
  }

  get pathTypeOp() {
    return 'interfaceesirsae/api/v1/application/getTypeOperation?sortBy=key:ASC';
  }

  get pathDocument() {
    return 'interfaceesirsae/api/v1/application/getTipoDocumento?sortBy=documentType:ASC&filter.indR=$not:9&filter.KeytypeGuia=$not:$in:2,9';
  }

  get pathCaptura() {
    return (
      'comerconcepts/api/v1/parameters-mod/get-all?filter.parameter=$eq:USUCAPTURA&filter.address=$eq:' +
      this.address
    );
  }

  get pathAutoriza() {
    return (
      'comerconcepts/api/v1/parameters-mod/get-all?filter.parameter=$eq:USUAUTORIZA&filter.address=$eq:' +
      this.address
    );
  }

  get pathSolicita() {
    return (
      'comerconcepts/api/v1/parameters-mod/get-all?filter.parameter=$eq:USUSOLICITA&filter.address=$eq:' +
      this.address
    );
  }

  get form() {
    return this.dataService.form;
  }

  get invoiceRecNumber() {
    return this.form.get('invoiceRecNumber');
  }

  get numReceipts() {
    return this.form.get('numReceipts');
  }

  get invoiceRecDate() {
    return this.form.get('invoiceRecDate');
  }

  get payDay() {
    return this.form.get('payDay');
  }

  get captureDate() {
    return this.form.get('captureDate');
  }

  get fecha_contrarecibo() {
    return this.form.get('fecha_contrarecibo');
  }

  get attachedDocumentation() {
    return this.form.get('attachedDocumentation');
  }

  get monthExpense() {
    return this.form.get('monthExpense');
  }

  get monthExpense2() {
    return this.form.get('monthExpense2');
  }

  get monthExpense3() {
    return this.form.get('monthExpense3');
  }

  get monthExpense4() {
    return this.form.get('monthExpense4');
  }

  get monthExpense5() {
    return this.form.get('monthExpense5');
  }

  get monthExpense6() {
    return this.form.get('monthExpense6');
  }

  get monthExpense7() {
    return this.form.get('monthExpense7');
  }

  get monthExpense8() {
    return this.form.get('monthExpense8');
  }

  get monthExpense9() {
    return this.form.get('monthExpense9');
  }

  get monthExpense10() {
    return this.form.get('monthExpense10');
  }

  get monthExpense11() {
    return this.form.get('monthExpense11');
  }

  get monthExpense12() {
    return this.form.get('monthExpense12');
  }

  get exchangeRate() {
    return this.form.get('exchangeRate');
  }

  get formPayment() {
    return this.form.get('formPayment');
  }

  get comproafmandsae() {
    return this.form.get('comproafmandsae');
  }

  get capturedUser() {
    return this.form.get('capturedUser');
  }

  get nomEmplcapture() {
    return this.form.get('nomEmplcapture');
  }

  get authorizedUser() {
    return this.form.get('authorizedUser');
  }

  get nomEmplAuthorizes() {
    return this.form.get('nomEmplAuthorizes');
  }

  get requestedUser() {
    return this.form.get('requestedUser');
  }

  get nomEmplRequest() {
    return this.form.get('nomEmplRequest');
  }

  get conceptNumber() {
    return this.form ? this.form.get('conceptNumber') : null;
  }

  get conceptNumberValue() {
    return this.conceptNumber ? this.conceptNumber.value : null;
  }

  get typepe() {
    return this.form.get('typepe');
  }

  get tiptram() {
    return this.form.get('tiptram');
  }

  get contractNumber() {
    return this.form.get('contractNumber');
  }

  get address() {
    return this.dataService.address;
  }

  get padj() {
    return this.form ? this.form.get('padj') : null;
  }

  get padjValue() {
    return this.padj ? this.padj.value : null;
  }

  get psadj() {
    return this.form ? this.form.get('psadj') : null;
  }

  get psadjValue() {
    return this.psadj ? this.psadj.value : null;
  }

  get pssadj() {
    return this.form.get('pssadj');
  }

  get adj() {
    return this.form.get('adj');
  }

  get showTipoOp() {
    return this.dataService.showTipoOp;
  }

  get showTipoTram() {
    return this.dataService.showTipoTram;
  }

  get showContract() {
    return this.dataService.showContract;
  }

  get showTipAdj() {
    return this.dataService.showTipAdj;
  }

  get showAdj() {
    return this.dataService.showTipAdj;
  }

  get pathPadj() {
    return 'directaward/api/v1/tmp-tip-adj/get-all-tmp-tip-adj-where-1';
  }

  get pathPsadj() {
    return (
      'directaward/api/v1/tmp-tip-adj/get-all-tmp-tip-adj-where-2' +
      (this.padjValue ? '/' + this.padjValue : '')
    );
  }

  get pathPssadj() {
    return (
      'directaward/api/v1/tmp-tip-adj/get-all-tmp-tip-adj-where-3' +
      (this.psadjValue ? '/' + this.psadjValue : '')
    );
  }

  ngOnInit() {}

  openContracts() {
    let config: ModalOptions = {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        callback: (obj: { selected: IContract }) => {
          let { selected } = obj;
          if (selected) {
            this.contractNumber.setValue(selected.contractNumber);
            this.form.get('contractDescription').setValue(selected.desContract);
            this.form.get('descontract').setValue(selected.desContract);
            this.form.get('clkpv').setValue(selected.clkpv);
            this.form.get('padj').setValue(selected.padj);
            this.form.get('psadj').setValue(selected.psadj);
            this.form.get('pssadj').setValue(selected.pssadj);
            this.form.get('adj').setValue(selected.adj);
          }
        },
      },
    };
    this.modalService.show(ContractsModalComponent, config);
  }
}
