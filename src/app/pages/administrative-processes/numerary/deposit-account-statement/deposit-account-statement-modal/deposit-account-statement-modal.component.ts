import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDetailInterestReturn } from 'src/app/core/models/ms-deposit/detail-interest-return';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DetailInterestReturnService } from 'src/app/core/services/ms-deposit/detail-interest-return.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DEPOSIT_ACCOUNT_STATEMENT_COLUMNS } from './deposit-account-statement-columns';

@Component({
  selector: 'app-deposit-account-statement-modal',
  templateUrl: './deposit-account-statement-modal.component.html',
  styles: [],
})
export class DepositAccountStatementModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Detalle del calculo';
  form: FormGroup;
  data: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  detail: IDetailInterestReturn[] = [];
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private detailInterestReturnService: DetailInterestReturnService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DEPOSIT_ACCOUNT_STATEMENT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      realInterests: [null, Validators.required],
      estimatedInterest: [null, Validators.required],
      creditedInterest: [null, Validators.required],
    });
    this.form.controls['realInterests'].setValue(this.data[0].real ?? 0);
    this.form.controls['estimatedInterest'].setValue(
      this.data[0].restimado ?? 0
    );
    let subTotal: number =
      (this.data[0].real ?? 0) + (this.data[0].restimado ?? 0);
    this.form.controls['creditedInterest'].setValue(subTotal);
    console.log(this.data);
    this.getDetail(new ListParams());
  }

  getDetail(params: ListParams) {
    //const params = new ListParams();
    this.loading = true;
    params['filter.returnNumber'] = `$eq:${this.data}`;
    this.detailInterestReturnService.getAll(params).subscribe({
      next: resp => {
        if (resp) {
          this.detail = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        }
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  report() {
    let params = {
      PN_DEVOLUCION: this.data,
    };
    this.siabService
      .fetchReport('RGERADBEDOCTAXIND', params)
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
}
