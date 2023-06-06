import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-rescheduling-form',
  templateUrl: './rescheduling-form.component.html',
  styles: [],
})
export class ReschedulingFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  reasonData = new DefaultSelect();

  reprogrammings = new DefaultSelect<IGeneric>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getReportData(new ListParams());
  }

  getReportData(params: ListParams) {
    params['filter.name'] = 'Reprogramacion';
    this.genericService.getAll(params).subscribe({
      next: response => {
        console.log('cancelación', response);
        this.reprogrammings = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      reason: [null],
    });
  }
  close() {
    this.modalRef.hide();
  }

  getReasonSelect(reason: ListParams) {}
  confirm() {}
}
