import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { GetpickFormComponent } from '../components/getpick-form/getpick-form.component';
import { countTotalsManifes } from '../countTotal';

@Component({
  selector: 'app-fiel-set-unstated',
  templateUrl: './fiel-set-unstated.component.html',
  styles: [],
})
export class FielSetUnstatedComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: IListResponse<IGoodType>;

  @Input() set content(data: IListResponse<IGoodType>) {
    if (!data.data) return;
    data.data = countTotalsManifes(data.data);
    this.data = data;
  }
  get content(): IListResponse<IGoodType> {
    return this.data;
  }

  @Output() public loadData: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: {
        maxAsseguranceTime: {
          title: 'Aseguramiento',
          sort: false,
        },
        maxFractionTime: {
          title: 'Fracción',
          sort: false,
        },
        maxExtensionTime: {
          title: 'Prorroga',
          sort: false,
        },
        maxStatementTime: {
          title: 'Declaración',
          sort: false,
        },
        total: {
          title: 'Totales',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  openForm(goodType?: IGoodType) {
    let config: ModalOptions = {
      initialState: {
        goodType,
        callback: (next: boolean) => {
          if (next) this.loadData.next(true);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GetpickFormComponent, config);
  }
}
