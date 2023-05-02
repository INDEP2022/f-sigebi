import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { ManifestFormComponent } from '../components/manifest-form/manifest-form.component';
import { countTotalsGet } from '../countTotal';

@Component({
  selector: 'app-fiel-set-uncollected',
  templateUrl: './fiel-set-uncollected.component.html',
  styles: [],
})
export class FielSetUncollectedComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: IListResponse<IGoodType>;

  @Input() set content(data: IListResponse<IGoodType>) {
    if (!data.data) return;
    data.data = countTotalsGet(data.data);
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
        maxLimitTime1: {
          title: 'Resolución',
          sort: false,
        },
        maxLimitTime2: {
          title: 'Plazo',
          sort: false,
        },
        maxLimitTime3: {
          title: 'Declaración',
          sort: false,
        },
        total2: {
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
    this.modalService.show(ManifestFormComponent, config);
  }
}
