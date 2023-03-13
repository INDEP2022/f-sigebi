import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-change',
  templateUrl: './modal-change.component.html',
  styles: [],
})
export class ModalChangeComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table

  data: any = [];
  columns: any;
  constructor(private bsModalRef: BsModalRef, private opcion: ModalOptions) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...this.opcion.initialState },
    };
  }

  ngOnInit(): void {
    this.columns = this.opcion.initialState;
    this.loadDate();
  }

  loadDate() {
    if (this.columns.username) {
      this.data = [
        {
          name: 'US1',
          username: 'Alejandro Martinez',
        },
        {
          name: 'US2',
          username: 'Edwin Armas',
        },
        {
          name: 'US3',
          username: 'Mariana Gomez',
        },
      ];
    } else {
      this.data = [
        {
          status: 'Estatus 1',
          description: 'Descripcion 1',
        },
        {
          status: 'Estatus 2',
          description: 'Descripcion 2',
        },
        {
          status: 'US3',
          description: 'Descripcion 3',
        },
      ];
    }
  }
  select(event: any) {
    console.log(event.data);
    this.onLoadToast('success', 'Seleccionado', '');
    this.return();
  }
  return() {
    this.bsModalRef.hide();
  }
}
