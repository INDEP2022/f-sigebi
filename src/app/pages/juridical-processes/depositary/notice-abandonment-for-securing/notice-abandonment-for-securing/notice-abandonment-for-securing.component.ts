import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-notice-of-abandonment-by-return',
  templateUrl: './notice-abandonment-for-securing.component.html',
  styles: [],
})
export class NoticeAbandonmentForSecuringComponent
  extends BasePage
  implements OnInit
{
  data: any[];

  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectRegDele = new DefaultSelect<any>();
  constructor(
    private readonly goodServices: GoodService,
    private readonly historyGoodService: HistoryGoodService,
    private fb: FormBuilder
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: ['', [Validators.required]],
      periods: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      periods1: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      periods2: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  listGoodsId(params?: ListParams) {
    console.log('PARAMAS.', params);
    params['filter.goodId'] = `$eq:${params.text}`;
    delete params['search'];

    this.goodServices.getAll(params).subscribe({
      next: (data: any) => {
        data.data.map((data: any) => {
          // let descripcion = (data.description == null) ? '' : data.description;
          // data.descriptionAndId = `${data.id} - ${descripcion} `;
          return data;
        }),
          console.log('RESP', data);
        this.selectRegDele = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.selectRegDele = new DefaultSelect();
      },
    });
  }

  cleanForm() {}

  getGood(item: any) {
    this.loading = true;
    console.log('ITEM', item);

    if (item != undefined) {
      // let id = item.goodId;
      // let obj = {
      //   propertyNum: id,
      //   status: "ABN"
      // }

      // this.historyGoodService.getHistoryStatusGoodById(obj).subscribe({
      //   next: response => {

      //     if (response) {
      //       this.onLoadToast('warning', 'Aplicación de Abandono', 'El Bien previamente ha tenido un estatus de Abandono')
      //       this.cleanForm();
      //     }

      //   },
      //   error: error => {

      this.loading = false;
      this.form.get('description').setValue(item.description);
      this.form.get('amount').setValue(item.quantity);
      // this.form.get('periods').setValue(item.description);
      // this.form.get('periods1').setValue(item.unit);
      // this.form.get('periods2').setValue(item.clarification);

      //   },
      // });
    } else {
      this.cleanForm();
    }
  }
}
