import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-p-mta-c-maximum-times-for-abandonment',
  templateUrl: './c-p-mta-c-maximum-times-for-abandonment.component.html',
  styles: [],
})
export class CPMtaCMaximumTimesForAbandonmentComponent
  extends BasePage
  implements OnInit
{
  contentData: IListResponse<IGoodType> = {} as IListResponse<IGoodType>;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private goodTypeServ: GoodTypeService) {
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

  getAllGoodTypes() {
    this.goodTypeServ.getAll(this.params.getValue()).subscribe({
      next: response => (this.contentData = response),
      error: err =>
        this.onLoadToast('error', 'Error', 'Revise su conexión de internet'),
    });
  }
}
