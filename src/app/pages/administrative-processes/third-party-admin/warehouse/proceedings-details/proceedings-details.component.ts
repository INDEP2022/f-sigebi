import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-proceedings-details',
  templateUrl: './proceedings-details.component.html',
  styles: [],
})
export class ProceedingsDetailsComponent extends BasePage implements OnInit {
  edit: boolean = false;
  title: string = 'Detalle de Acta';
  config: any = null;
  idActa: string = null;

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    if (this.config !== null) {
      this.idActa = `${this.config.letter}${this.config.number}`;
    }
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
