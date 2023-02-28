import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IThirdParty } from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { THIRD_PARTY } from './caculate-comission-columns';

@Component({
  selector: 'app-calculate-commission',
  templateUrl: './calculate-commission.component.html',
  styles: [],
})
export class CalculateCommissionComponent extends BasePage implements OnInit {
  data: any;

  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  settings2;

  constructor(
    private modalService: BsModalService,
    private thirdPartyService: ThirdPartyService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...THIRD_PARTY },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...THIRD_PARTY },
    };
  }

  thirdPartysList: IThirdParty[] = [];

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getThirdParty());
  }

  getThirdParty() {
    this.loading = true;

    this.thirdPartyService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.thirdPartysList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
}
