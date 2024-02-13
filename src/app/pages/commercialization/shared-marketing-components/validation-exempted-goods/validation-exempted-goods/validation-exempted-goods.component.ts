import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NewValidationExemptedGoodModalComponent } from '../new-validation-exempted-goods-modal/new-validation-exempted-goods-modal.component';
import { GOODS_COLUMS } from './validation-exempted-goods-columns';

@Component({
  selector: 'app-validation-exempted-goods',
  templateUrl: './validation-exempted-goods.component.html',
  styleUrls: ['./validation-exempted-goods.component.css'],
})
export class ValidationExemptedGoodsComponent
  extends BasePage
  implements OnInit
{
  goods: LocalDataSource = new LocalDataSource();
  totalItems = 0;
  params = new BehaviorSubject(new FilterParams());

  override settings = {
    ...this.settings,
    actions: {
      columnTitle: 'Eliminar',
      position: 'right',
      edit: false,
      delete: true,
    },
    columns: GOODS_COLUMS,
  };

  constructor(
    private goodService: GoodService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
    this.navigateTable();
  }

  navigateTable() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(value => {
      console.log(value);
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('id', '3987830');
    paramsF.page = this.params.getValue().page;
    paramsF.limit = this.params.getValue().limit;

    this.goodService.getTransAva(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.goods.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        this.alert('warning', 'No se encontraron datos', '');
        console.log(err);
        this.goods.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  openModalNew() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewValidationExemptedGoodModalComponent, config);
  }
}
