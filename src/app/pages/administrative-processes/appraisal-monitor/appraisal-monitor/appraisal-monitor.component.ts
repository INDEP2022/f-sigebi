import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { APPRAISAL_COLUMNS } from './appraisal-monitor-columns';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-appraisal-monitor',
  templateUrl: './appraisal-monitor.component.html',
  styles: [],
})
export class AppraisalMonitorComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  appraisals: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder // private appraisalService: AppraisalService
  ) {
    super();
    this.settings.columns = APPRAISAL_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAppraisals());

    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      pastDays: [],
    });
  }

  getAppraisals() {
    // this.loading = true;
    // this.bankService.getAll(this.params.getValue()).subscribe(
    //   response => {
    //     this.lawyers = response.data;
    //     this.totalItems = response.count;
    //     this.loading = false;
    //   },
    //   error => (this.loading = false)
    // );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<any>) {
    // const modalRef = this.modalService.show(BanksDetailComponent, {
    //   initialState: context,
    //   class: 'modal-lg modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // });
    // modalRef.content.refresh.subscribe(next => {
    //   if (next) this.getBanks();
    // });
  }
}
