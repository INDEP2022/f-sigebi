import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPMAppraisalInstitutionsModalComponent } from '../c-p-m-appraisal-institutions-modal/c-p-m-appraisal-institutions-modal.component';
import { APPRAISALINSTITUTIONS_COLUMNS } from './c-p-m-appraisal-institutions-columns';

@Component({
  selector: 'app-c-p-m-appraisal-institutions',
  templateUrl: './c-p-m-appraisal-institutions.component.html',
  styles: [
  ]
})
export class CPMAppraisalInstitutionsComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: APPRAISALINSTITUTIONS_COLUMNS,
    };
  }

  ngOnInit(): void {

  }
  openValues(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => { },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CPMAppraisalInstitutionsModalComponent, config);
  }
}
