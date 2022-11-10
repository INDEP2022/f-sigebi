import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ExchangeTypesDetailComponent } from '../exchange-types-detail/exchange-types-detail.component';
import { EXCHANGE_TYPES_COLUMNS } from './exchange-types-columns';

@Component({
  selector: 'app-exchange-types',
  templateUrl: './exchange-types.component.html',
  styles: [],
})
export class ExchangeTypesComponent extends BasePage implements OnInit {
  exchangeTypes: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = EXCHANGE_TYPES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}

  getCurrencies() {
    this.loading = true;
    // this.service.getAll(this.params.getValue()).subscribe(
    //   response => {
    //     this.exchangeTypes = response.data;
    //     this.totalItems = response.count;
    //     this.loading = false;
    //   },
    //   error => (this.loading = false)
    // );
  }

  openModal(context?: Partial<ExchangeTypesDetailComponent>) {
    const modalRef = this.modalService.show(ExchangeTypesDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getCurrencies();
    });
  }
}
