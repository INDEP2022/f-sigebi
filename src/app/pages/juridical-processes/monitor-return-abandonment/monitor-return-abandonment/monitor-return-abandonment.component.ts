/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { MONITOR_RETUR_ABANDONMENT } from './monitor-return-abandonment-columns';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-monitor-return-abandonment',
  templateUrl: './monitor-return-abandonment.component.html',
  styleUrls: ['./monitor-return-abandonment.component.scss'],
})
export class MonitorReturnAbandonmentComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  goods: any[] = [];
  id: string | number;
  dateNoti: string | Date;
  //historygood

  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private route: Router
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      mode: '',
      columns: { ...MONITOR_RETUR_ABANDONMENT },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      diEstatusBien: ['', Validators.required],
    });
  }

  get statusgood() {
    return this.form.get('diEstatusBien');
  }

  public btnDeclaracion() {
    if (this.id != undefined && this.id !== null) {
      const route = `pages/juridical/return-abandonment-monitor/${this.id}`;
      this.route.navigate([route]);
    } else {
      this.alert('info', 'Este bien no se puede ratificar', '');
    }
  }

  public goodSelect(good: IGood) {
    console.log(good);
    this.id = good.id;
    this.dateNoti = good.notifyDate;

    this.statusgood.setValue(good.goodStatus);
  }

  getGoods(): void {
    this.goodService.getAll(this.params.getValue()).subscribe(
      response => {
        this.goods = response.data;
        console.log(this.goods);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }
}
