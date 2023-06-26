import { Component, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCPMtaCMaximumTimesForAbandonmentComponent } from './modal-c-p-mta-c-maximum-times-for-abandonment/modal-c-p-mta-c-maximum-times-for-abandonment';

@Component({
  selector: 'app-c-p-mta-c-maximum-times-for-abandonment',
  templateUrl: './c-p-mta-c-maximum-times-for-abandonment.component.html',
  styles: [],
})
export class CPMtaCMaximumTimesForAbandonmentComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;

  contentData: IListResponse<IGoodType> = {} as IListResponse<IGoodType>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any = [];
  dataTable: LocalDataSource = new LocalDataSource();
  constructor(
    private modalService: BsModalService,
    private goodTypeServ: GoodTypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: null,
      columns: {
        id: {
          title: 'Tipo de Bien',
          sort: false,
        },
        nameGoodType: {
          title: 'Descripción',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllGoodTypes());
  }

  openForm(goodType?: IGoodType) {
    this.openModal({ goodType });
  }
  openModal(context?: Partial<ModalCPMtaCMaximumTimesForAbandonmentComponent>) {
    const modalRef = this.modalService.show(
      ModalCPMtaCMaximumTimesForAbandonmentComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getAllGoodTypes();
      }
    });
  }

  getAllGoodTypes() {
    this.goodTypeServ.getAll(this.params.getValue()).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              nameGoodType: item.nameGoodType,
              id: item.id,
            });
            this.dataTable.load(resp.data);
            this.dataTable.refresh();
            this.contentData = resp;
            this.totalItems = resp.count || 0;

            console.log(resp);
          });
        }
      },
      error: err =>
        this.onLoadToast('error', 'Error', 'Revise su conexión de internet'),
    });
  }
}
