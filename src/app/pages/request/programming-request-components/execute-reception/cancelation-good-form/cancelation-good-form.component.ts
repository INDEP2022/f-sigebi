import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-cancelation-good-form',
  templateUrl: './cancelation-good-form.component.html',
  styles: [],
})
export class CancelationGoodFormComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({});
  cancelations = new DefaultSelect<IGeneric>();
  constructor(
    private modalRef: BsModalRef,
    private genericService: GenericService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCancelInfo(new ListParams());
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      cancelation: [null, [Validators.required]],
    });
  }

  getCancelInfo(params: ListParams) {
    params['filter.name'] = 'Cancelacion';
    this.genericService.getAll(params).subscribe({
      next: response => {
        console.log('cancelación', response);
        this.cancelations = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
