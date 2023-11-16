import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-numerary-errors',
  templateUrl: './numerary-errors.component.html',
  styleUrls: [],
})
export class NumeraryErrorsComponent extends BasePage implements OnInit {
  data: any[];

  constructor(private modalRef: BsModalRef) {
    super();
  }

  settings2: any = {
    ...this.settings,
    actions: false,
    columns: {
      good_id: {
        title: 'No. Bien',
        sort: false,
        type: 'text',
      },
      message: {
        title: 'Error',
        sort: false,
        type: 'text',
      },
    },
  };

  ngOnInit(): void {
    console.log(this.data);
  }

  close() {
    this.modalRef.hide();
  }
}
