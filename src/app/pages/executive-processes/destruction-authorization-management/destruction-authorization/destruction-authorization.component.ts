import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ProceedingsModalComponent } from '../proceedings-modal/proceedings-modal.component';
import { PROCEEDINGS_COLUMNS } from './columns';

@Component({
  selector: 'app-destruction-authorization',
  templateUrl: './destruction-authorization.component.html',
  styles: [
  ]
})
export class DestructionAuthorizationComponent extends BasePage implements OnInit {

  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  proceedingsList: IProccedingsDeliveryReception[] = [];
  proceedings: IProccedingsDeliveryReception;

  constructor(private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService, private modalService: BsModalService,) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: {... PROCEEDINGS_COLUMNS}
    };
  }

  data:any;

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllProceeding());
  }

  getAllProceeding() {
    this.loading = true;
    this.proceedingsDeliveryReceptionService.getAll3(this.params.getValue()).subscribe({
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

  openForm(proceeding:IProccedingsDeliveryReception){
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

}
