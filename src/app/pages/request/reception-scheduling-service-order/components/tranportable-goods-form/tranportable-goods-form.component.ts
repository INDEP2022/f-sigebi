import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICE_ORDER_COLUMNS } from '../../columns/service-order-columns';

@Component({
  selector: 'app-tranportable-goods-form',
  templateUrl: './tranportable-goods-form.component.html',
  styles: [],
})
export class TranportableGoodsFormComponent extends BasePage implements OnInit {
  data: any[] = [];
  idProg: number = null;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  private activeRoute = inject(ActivatedRoute);
  private programmingGood = inject(ProgrammingRequestService);

  constructor() {
    super();

    this.settings = {
      ...this.settings,
      columns: SERVICE_ORDER_COLUMNS,
      edit: {
        editButtonContent: '<i class="bx bxs-file-doc"></i> Ver ',
      },
    };

    this.idProg = +this.activeRoute.snapshot.params['id'];

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getProgrammingGood(this.idProg);
    });
    /* this.data = [
      {
        numberGestion: 546456,
        uniqueKey: 32423,
        descriptionGoodTransferent: 'Estampillas',
        transerUnitMeasure: 'Pieza',
        quantity: 1,
        expedientTransferent: '',
        physicalState: 'Bueno',
        stateConservation: 'Bueno',
        address: 'Ciudad de México',
        numberExpedient: 331,
        typeGood: 'Joyas obras',
      },
    ]; */
  }

  ngOnInit(): void {}

  getProgrammingGood(id: number) {
    this.loading = true;
    const params = new ListParams();
    params['filter.programmingId'] = `$eq:${id}`;
    this.programmingGood.getGoodsProgramming(params).subscribe({
      next: resp => {
        console.log(resp);
        resp.data.map((item: any) => {
          item.uniqueKey = item.view.uniqueKey;
          item.goodDescription = item.view.goodDescription;
          item.unitMeasure = item.view.unitMeasure;
          item.quantity = item.view.quantity;
          item.transferenceType = item.view.transferenceType;
          item.physicalState = item.view.physicalState;
          item.conservationState = item.view.conservationState;
          item.address = item.view.address;
        });

        this.data = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
    });
  }

  showDocument() {}
}
