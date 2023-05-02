import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICatMotiveRev } from 'src/app/core/models/catalogs/cat-motive-rev';
import { CatMotiveRevService } from 'src/app/core/services/catalogs/cat-motive-rev.service';
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

  valuesList: ICatMotiveRev[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private catMotiveRevService: CatMotiveRevService
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
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMinPubAll());
  }
  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      whereMot: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }
  getMinPubAll() {
    this.loading = true;
    this.catMotiveRevService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.valuesList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
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
