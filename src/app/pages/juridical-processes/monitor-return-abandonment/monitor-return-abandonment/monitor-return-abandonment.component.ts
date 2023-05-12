/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { InputTableComponent } from '../input-table/input-table.component';
import {
  MONITOR_RETUR_ABANDONMENT,
  TABLE_SETTINGS_T,
} from './monitor-return-abandonment-columns';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-monitor-return-abandonment',
  templateUrl: './monitor-return-abandonment.component.html',
  styleUrls: [
    './monitor-return-abandonment.component.scss',
    './monitor-return-abandonment.component.css',
  ],
})
export class MonitorReturnAbandonmentComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public idBien: string = '';
  public form: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  goods: any[] = [];
  id: string | number;
  judicialDate: string | Date;
  goodData: any;
  validBtn: boolean = false;
  //historygood
  _settings: any;
  di_disponible: string = 'N';

  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private activateRoute: ActivatedRoute,
    private screenStatusService: ScreenStatusService,
    private fb: FormBuilder,
    private goodService: GoodService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private route: Router,
    private modalService: BsModalService,
    private statusGoodService: StatusGoodService,
    private token: AuthService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
    this._settings = { ...TABLE_SETTINGS_T };
    this._settings.columns = MONITOR_RETUR_ABANDONMENT;
    this._settings.actions.delete = false;
    this._settings.actions.add = false;
    this._settings = {
      ...this._settings,
      hideSubHeader: false,
    };

    this._settings.rowClassFunction = (row: any) => {
      if (
        row.data.status == row.data.di_status_final &&
        row.data.judicialLeaveDate != null
      ) {
        return 'bg-green-to-confirm';
      } else {
        if (row.data.di_disponible == 'N') {
          return 'bg-black-unavailable';
        }
      }
      return '';
    };
  }

  ngOnInit(): void {
    const id: string | number = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);
    console.log('SI', id);
    this.prepareForm(this.idBien);
    this.settingColumns();
    // this.getGoods();
    this.loading = true;
  }

  settingColumns() {
    this._settings.columns = MONITOR_RETUR_ABANDONMENT;
  }

  private prepareForm(id: any) {
    this.form = this.fb.group({
      diEstatusBien: ['', Validators.required],
    });

    this.getGoods(id);
    // this.params
    //   .pipe(
    //     takeUntil(this.$unSubscribe),
    //     tap(() => this.getGoods())
    //   )
    //   .subscribe();
  }

  public async goodSelect(good: IGood) {
    this.goodData = good;

    // DISABLED BUTTON DECLARACIÓN //
    if (this.id == good.id) {
      this.id = '';
      this.validBtn = false;
    } else {
      this.validBtn = true;
      this.id = good.id;
    }

    if (good.status != null) {
      let params = new ListParams();
      params['filter.status'] = `$ilike:${good.status}`;
      await this.statusGoodService.getAll(params).subscribe({
        next: (response: any) => {
          const data = response.data[0];
          console.log('a', response);
          this.form.get('diEstatusBien').setValue(data.description);
          this.loading = false;
        },
        error: err => {
          this.form
            .get('diEstatusBien')
            .setValue('No se encontró estatus del Bien');
          this.loading = false;
        },
      });
    } else {
      this.form
        .get('diEstatusBien')
        .setValue('El Bien no tiene un estatus asignado');
      this.loading = false;
    }
  }

  getGoods(id: any): void {
    this.loading = true;
    // let params = this.params.getValue();
    this.id = null;

    this.goodService.getGoodById(id).subscribe({
      next: async resp => {
        // console.log("RES", resp)
        let arr: any = [];
        const statusScreen: any = await this.getScreenStatus(resp);

        resp.di_disponible = statusScreen.di_disponible;
        resp.di_status_final = statusScreen.di_status_final;

        if (resp.judicialLeaveDate) {
          if (statusScreen.di_status_final != null) {
            // CAMBIAMOS STATUS DEL BIEN POR EL BIEN FINAL OBTENIDO
            await this.updateStatusGood(resp);
            // APLICAMOS ABANDONO
            await this.aplicaAbandono(resp);
          }
        }
        arr.push(resp);
        if (arr) {
          setTimeout(() => {
            this.goods = arr;
          }, 100);
        }

        console.log('Datos regresados: ', this.goods);
        // this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  edit(good: IGood) {
    this.openModal({ edit: true, good });
  }

  openModal(context?: Partial<InputTableComponent>) {
    const modalRef = this.modalService.show(InputTableComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) this.getGoods(this.idBien);
    });
  }

  // BUSCAMOS EL STATUSFINAL EN LA TABLA STATUSXSCREEN //
  getScreenStatus(good: any) {
    let obj = {
      estatus: good.status,
      vc_pantalla: 'FACTJURCONABANDEV',
    };

    console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenStatusService.getAllFiltro(obj).subscribe({
        next: (resp: any) => {
          console.log(resp);
          const data = resp.data[0];

          let objScSt = {
            di_disponible: 'S',
            di_status_final: data.statusFinal.status,
          };

          resolve(objScSt);
        },
        error: (error: any) => {
          let objScSt: any = {
            di_disponible: 'N',
            di_status_final: null,
          };
          resolve(objScSt);
        },
      });
    });
  }

  public btnDeclaracion() {
    if (this.goodData.judicialLeaveDate == null) {
      this.alertInfo(
        'warning',
        'Debe capturar primero la fecha de Ratificación Judicial.',
        ''
      );
    } else {
      const route = `pages/juridical/return-abandonment-monitor/${this.id}`;
      this.route.navigate([route]);
    }
  }

  aplicaAbandono(good: any) {
    const historyGood: any = {
      propertyNum: good.id,
      status: good.di_status_final,
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'FACTJURCONABANDEV',
      reasonForChange: '',
      registryNum: null,
      extDomProcess: null,
    };

    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        this.onLoadToast('success', 'El Abandono ha sido aplicado', '');

        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  updateStatusGood(good: any) {
    let params = {
      id: good.id,
      goodId: good.goodId,
      status: good.di_status_final,
    };

    this.goodService.updateWithParams(params).subscribe(
      response => {
        this.onLoadToast(
          'success',
          'Se actualizó correctamente el Estatus del Bien',
          ``
        );
        this.loading = false;
      },
      error => (
        this.onLoadToast('error', error.error.message, ``),
        (this.loading = false)
      )
    );
  }
}
