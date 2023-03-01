import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ProceedingsModalComponent } from '../proceedings-modal/proceedings-modal.component';
import { GOODS_COLUMNS, PROCEEDINGS_COLUMNS } from './columns';

@Component({
  selector: 'app-destruction-authorization',
  templateUrl: './destruction-authorization.component.html',
  styles: [],
})
export class DestructionAuthorizationComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  proceedingsList: IProccedingsDeliveryReception[] = [];
  proceedings: IProccedingsDeliveryReception;

  goodPDS: IGood[] = [];

  settings2;

  constructor(
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private modalService: BsModalService,
    private goodService: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...PROCEEDINGS_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };
  }

  data: any;

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllProceeding());
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByStatusPDS());
  }

  getAllProceeding() {
    this.loading = true;
    this.proceedingsDeliveryReceptionService
      .getAll3(this.params.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.proceedingsList = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
  }

  openForm(proceeding?: IProccedingsDeliveryReception) {
    let config: ModalOptions = {
      initialState: {
        proceeding,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProceedingsModalComponent, config);
  }

  //Traer bienes con estado PDS
  getGoodByStatusPDS() {
    this.loading = true;
    this.goodService.getGoodByStatusPDS(this.params2.getValue()).subscribe({
      next: response => {
        this.goodPDS = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
