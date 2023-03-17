import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AppraisesService } from '../../../../../app/core/services/ms-appraises/appraises.service';
import { APPRAISAL_COLUMNS } from './appraisal-monitor-columns';

@Component({
  selector: 'app-appraisal-monitor',
  templateUrl: './appraisal-monitor.component.html',
  styles: [],
})
export class AppraisalMonitorComponent extends BasePage implements OnInit {
  appraisals: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private appraisalService: AppraisesService
  ) {
    super();
    this.settings.columns = APPRAISAL_COLUMNS;
    this.settings.actions = false;
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
    var info: any[] = [];
    this.loading = true;
    this.appraisalService.getAll(this.params.getValue()).subscribe({
      next: data => {
        data.data.forEach((element: any) => {
          element['requestDate'] = element.requestXAppraisal.requestDate;
          element['sourceUser'] = element.requestXAppraisal.sourceUser;
          element['targetUser'] = element.requestXAppraisal.targetUser;
          element['observations'] = element.requestXAppraisal.observations;
          info.push(element);
        });
        this.appraisals = info;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
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
