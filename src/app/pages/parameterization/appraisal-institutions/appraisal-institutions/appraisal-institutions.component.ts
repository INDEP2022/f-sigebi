import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAppraisers } from 'src/app/core/models/catalogs/appraisers.model';
import { AppraisersService } from 'src/app/core/services/catalogs/appraisers.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AppraisalInstitutionsModalComponent } from '../appraisal-institutions-modal/appraisal-institutions-modal.component';
import { APPRAISALINSTITUTIONS_COLUMNS } from './appraisal-institutions-columns';

@Component({
  selector: 'app-appraisal-institutions',
  templateUrl: './appraisal-institutions.component.html',
  styles: [],
})
export class AppraisalInstitutionsComponent extends BasePage implements OnInit {
  appraisersList: IAppraisers[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private appraisersService: AppraisersService
  ) {
    super();
    this.settings.columns = APPRAISALINSTITUTIONS_COLUMNS;
  }
  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;
    this.appraisersService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.appraisersList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  openForm(appraisers?: IAppraisers) {
    let config: ModalOptions = {
      initialState: {
        appraisers,
        callback: (next: boolean) => {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getValuesAll());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AppraisalInstitutionsModalComponent, config);
  }
}
