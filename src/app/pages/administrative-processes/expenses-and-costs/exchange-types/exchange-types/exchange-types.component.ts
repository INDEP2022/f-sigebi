import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Ityperate } from 'src/app/core/models/ms-type-rate/typerate.model';
import { TyperateService } from 'src/app/core/services/ms-typerate/typerate.service';
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
  constructor(
    private modalService: BsModalService,
    private typerateService: TyperateService
  ) {
    super();
    this.settings.columns = EXCHANGE_TYPES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTyperate());
  }

  getTyperate() {
    this.loading = true;
    this.typerateService.getAll(this.params.getValue()).subscribe(
      response => {
        this.exchangeTypes = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openModal(context?: Partial<ExchangeTypesDetailComponent>) {
    const modalRef = this.modalService.show(ExchangeTypesDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    // modalRef.content.onSelect.subscribe(next => {
    //   if (next) {
    //     var currency = {
    //       id: next.currency,
    //       validityId: "2003-01-01T00:00:00.000Z",
    //       purchaseValue: '',
    //       saleValue: "12",
    //       costValue: "10.33770",
    //       registerNumber: "23722"
    //     }
    //     this.createCurrency(currency);
    //   }
    // });
  }

  // data(event: any) {
  //   console.log(event.data);
  // }
  createCurrency(currency: any) {
    this.typerateService.create(currency).subscribe(
      next => {
        this.getTyperate();
        console.log(next);
      },
      error => (this.loading = false)
    );
  }

  openForm(typerate?: Ityperate) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      typerate,
      callback: (next: boolean) => {
        if (next) this.getTyperate();
      },
    };
    this.modalService.show(ExchangeTypesDetailComponent, modalConfig);
  }
}
