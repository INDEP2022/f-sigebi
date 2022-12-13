import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ReasonsModelComponent } from '../reasons-model/reasons-model.component';
import { GROUNDSSTATUSMODAL_COLUMNS } from './grounds-status-modal-columns';

@Component({
  selector: 'app-grounds-status-modal',
  templateUrl: './grounds-status-modal.component.html',
  styles: [],
})
export class GroundsStatusModalComponent extends BasePage implements OnInit {
  form: FormGroup;

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GROUNDSSTATUSMODAL_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      whereMot: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }
  openModal2(): void {
    const modalRef = this.modalService.show(ReasonsModelComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  close() {
    this.modalRef.hide();
  }
}
