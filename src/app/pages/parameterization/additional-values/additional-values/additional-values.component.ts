import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AdditionalValuesModalComponent } from '../additional-values-modal/additional-values-modal.component';
import { ADDITIONALVALUES_COLUMNS } from './additional-values-columns';

@Component({
  selector: 'app-additional-values',
  templateUrl: './additional-values.component.html',
  styles: [],
})
export class AdditionalValuesComponent extends BasePage implements OnInit {
  additionalValuesForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ADDITIONALVALUES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.additionalValuesForm = this.fb.group({
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
    });
  }
  openValues(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AdditionalValuesModalComponent, config);
  }
}
