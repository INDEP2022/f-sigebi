import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { BasePage } from 'src/app/core/shared/base-page';

interface ExampleData {
  number: number;
  name: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-modal-justifier',
  template: `
    <app-card [header]="true" [footer]="true">
      <div class="ch-content" header>
        <h5 class="title">Tipo de justificación</h5>
      </div>
      <div body>
        <div class="row">
          <ng2-smart-table
            [attr.class]="'table-bordered'"
            [settings]="settings"
            [source]="data"
            (userRowSelect)="select($event)">
          </ng2-smart-table>
          <app-pagination
            [params]="params"
            [totalItems]="totalItems"></app-pagination>
        </div>
      </div>
      <div footer>
        <div class="row">
          <div class="d-flex justify-content-center">
            <div class="m-3">
              <button class="btn btn-primary btn-sm active" (click)="return()">
                regresar
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styles: [],
})
export class ModalJustifier extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;
  constructor(private bsModalRef: BsModalRef) {
    super();
    this.settings.columns = {
      description: {
        title: 'Descripcion',
        sort: false,
      },
    };
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.loandData();
  }

  loandData() {
    this.data = [
      {
        description: 'Esta es la descripcion del estatus 1',
      },
      {
        description: 'Esta es la descripcion del estatus 2',
      },
      {
        description: 'Esta es la descripcion del estatus 3',
      },
    ];
  }
  return() {
    this.bsModalRef.hide();
  }

  select(event: any) {
    this.refresh.emit(event.data.description);
    this.return();
  }
}
