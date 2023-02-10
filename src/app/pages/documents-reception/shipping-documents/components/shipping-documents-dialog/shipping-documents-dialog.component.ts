import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { map, switchMap } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { CopiesByTradeService } from 'src/app/core/services/ms-office-management/copies-by-trade.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SHIPPING_DOCUMENTS_FORM } from '../../utils/shipping-documents-forms';

@Component({
  selector: 'app-shipping-documents-dialog',
  templateUrl: './shipping-documents-dialog.component.html',
  styles: [],
})
export class ShippingDocumentsDialogComponent
  extends BasePage
  implements OnInit
{
  params = new FilterParams();
  jobNumber = new FormControl<number | string>(45907);
  queryMode: boolean = null;
  form = this.fb.group(SHIPPING_DOCUMENTS_FORM);

  constructor(
    private modalRef: BsModalRef,
    private jobsService: JobsService,
    private copiesByTradeService: CopiesByTradeService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {}

  close(job?: any) {
    this.modalRef.content.callback(job);
    this.modalRef.hide();
  }

  getJob() {
    this.loading = true;
    this.jobsService
      .getById(this.jobNumber.value)
      .pipe(switchMap(job => this.getCopies(job)))
      .subscribe({
        next: data => {
          this.loading = false;
          this.close(data);
        },
        error: error => {
          this.loading = false;
          this.handleError(error);
        },
      });
  }

  getCopies(job: any) {
    this.params.addFilter('jobNumber', job.id);
    return this.copiesByTradeService
      .getFilter(this.params.getParams())
      .pipe(map(copiesList => ({ job, copies: copiesList.data })));
  }

  handleError(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.onLoadToast('error', 'Error', 'No existe el envio');
    }
  }

  cancel() {
    this.modalRef.hide();
    this.router.navigate(['/']);
  }
}
