import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { LoanDocumentSelectModalComponent } from '../loan-document-select-modal/loan-document-select-modal.component';
import { LOAN_DOCUMENT_COLUMNS } from './loan-monitor-columns';

@Component({
  selector: 'app-loan-document',
  templateUrl: './loan-document.component.html',
  styles: [],
})
export class LoanDocumentComponent extends BasePage implements OnInit {
  user1 = new DefaultSelect();
  form: FormGroup;
  data1: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: LOAN_DOCUMENT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      loanTo: [null, Validators.required],
      loanFor: [null, Validators.required],
      area: [null, Validators.required],
      AssignedTo: [null, Validators.required],
      NoLoans: [null, Validators.required],
      loanDate: [null, Validators.required],
      document: [null, Validators.required],
      adscritTo: [null, Validators.required],
      observations: [null, Validators.required],
    });
  }

  getAllSegUser1(params: ListParams) {
    console.log('params: ', params);

    delete params['filter.name.$ilike:'];

    let name = params['search'];
    this.usersService.getAllSegUsers3(params, name).subscribe({
      next: resp => {
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  openSelect(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean, formatKey?: any, id?: any) => {
          console.log('callback ', id, ' ', formatKey);

          if (id != null) {
            console.log('si hay id');
            this.prepareForm();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(LoanDocumentSelectModalComponent, config);
  }
}
