import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-documents-reception-flyer-select',
  templateUrl: './documents-reception-flyer-select.component.html',
  styles: [],
})
export class DocumentsReceptionFlyerSelectComponent
  extends BasePage
  implements OnInit
{
  flyerForm = this.fb.group({
    flyerNumber: new FormControl<INotification>(null, [Validators.required]),
  });
  // flyers = new DefaultSelect<{ id: number }>(
  //   FLYERS_EXAMPLE,
  //   FLYERS_EXAMPLE.length
  // );
  flyers = new DefaultSelect<INotification>();
  callback?: (next: INotification) => void;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalRef: BsModalRef,
    private notifService: NotificationService
  ) {
    super();
  }

  get flyerNumber() {
    return this.flyerForm.controls['flyerNumber'];
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    const flyerNumber = this.flyerForm.controls.flyerNumber.value;
    this.modalRef.content.callback(flyerNumber);
    this.modalRef.hide();
  }

  getNotifications(lparams: ListParams) {
    this.loading = true;
    const params = new FilterParams();
    params.page = lparams.inicio;
    params.limit = 10;
    if (lparams.text.length > 0) params.addFilter('wheelNumber', lparams.text);
    this.notifService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        this.flyers = new DefaultSelect(data.data, data.count);
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.flyers = new DefaultSelect();
        this.loading = false;
      },
    });
  }
}

const FLYERS_EXAMPLE = [
  {
    id: 123456,
  },
  {
    id: 789455,
  },
  {
    id: 855123,
  },
  {
    id: 854123,
  },
  {
    id: 320145,
  },
];
