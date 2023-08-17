import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';

import { LocalDataSource } from 'ng2-smart-table';
import { IGood } from 'src/app/core/models/good/good.model';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { NotificacionAbandonoService } from 'src/app/core/services/notificacion-abandono/notificacion-abandono.service';
@Component({
  selector: 'app-notice-of-abandonment-by-return',
  templateUrl: './notice-of-abandonment-by-return.component.html',
  styles: [],
})
export class NoticeOfAbandonmentByReturnComponent
  extends BasePage
  implements OnInit
{
  data: any[];
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  loadingText = '';
  isdisable: boolean = true;
  totalItems: number = 0;
  good = new DefaultSelect<IGood>();
  form: FormGroup;
  period: boolean = false;
  searching: boolean = false;
  username: string = '';

  dataTable: LocalDataSource = new LocalDataSource();
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());

  dataArray: any = [];

  get goodId() {
    return this.form.get('goodId');
  }
  get description() {
    return this.form.get('description');
  }
  get quantity() {
    return this.form.get('quantity');
  }
  get periods() {
    return this.form.get('periods');
  }
  get periods1() {
    return this.form.get('periods1');
  }
  get periods2() {
    return this.form.get('periods2');
  }

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private notificationService: NotificationService,
    private goodTypesService: GoodTypeService,
    private notificacionAbandono: NotificacionAbandonoService,
    private programmingRequestService: ProgrammingRequestService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
    this.getUserInfo();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      goodId: [null, [Validators.required]],
      description: [null],
      quantity: [null],
      periods: [null],
      periods1: [null],
      periods2: [null],
    });
  }
  getGoods() {
    const params = this.params.getValue();
    console.log(params);
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;

    if (this.form.value.goodId) {
      this.filterParams
        .getValue()
        .addFilter('goodId', this.form.value.goodId, SearchFilter.EQ);
    }
    this.loading = true;
    this.loadingText = 'Cargando';

    this.notificationService
      .getNotificationxPropertyFilter({
        numberProperty: this.form.value.goodId,
      })
      .subscribe({
        next: response => {
          let dataCreada: any[] = [];
          for (let ficha of response.data) {
            let fichaObjeto: any = {};
            fichaObjeto.periodEndDate = ficha.periodEndDate;
            fichaObjeto.notificationDate = ficha.notificationDate;
            fichaObjeto.duct = ficha.duct;
            fichaObjeto.notifiedTo = ficha.notifiedTo;
            fichaObjeto.notifiedPlace = ficha.notifiedPlace;
            fichaObjeto.editPublicationDate = ficha.editPublicationDate;
            fichaObjeto.newspaperPublication = ficha.newspaperPublication;
            fichaObjeto.observation = ficha.observation;
            fichaObjeto.statusNotified = ficha.statusNotified;
            dataCreada.push(fichaObjeto);
          }
          this.dataTable.load(dataCreada);
          this.dataArray = dataCreada;
          this.totalItems = response.data.length;

          console.log(dataCreada);

          this.loading = false;
          this.searching = true;
        },
        error: error => {
          console.log(error);
          this.onLoadToast('error', 'Error', 'Este registro no existe');
          this.clean();
          this.loading = false;
        },
      });
  }

  getGoodIdDescription(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    let paramDinamyc = '';

    if (lparams.text.length > 0) {
      !isNaN(parseInt(lparams.text))
        ? (paramDinamyc = `filter.goodId=$eq:${lparams.text}`)
        : (paramDinamyc = `filter.description=$ilike:${lparams.text}`);
    }

    this.goodService.getAll(`${params.getParams()}&${paramDinamyc}`).subscribe({
      next: data => {
        this.good = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
    });
  }
  onGoodIdDescription(goodChange: any) {
    if (goodChange && goodChange != null) {
      let param = `filter.goodId=$eq:${goodChange.goodId}`;
      this.goodService.getAll(param).subscribe({
        next: data => {
          this.executeCamps(data.data[0]);
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.message;
          }

          this.onLoadToast('error', 'Error', error);
        },
      });
    }
  }
  executeCamps(data: any) {
    this.quantity.setValue(data.quantity);
    const params = new FilterParams();
    let paramDinamyc = `filter.id=$eq:${data.id}`;

    let params3 = {
      ...this.params.getValue(),
      'filter.id': `$eq:${data.id}`,
    };

    this.goodTypesService.getAllS(params3).subscribe({
      next: value => {
        const { maxAsseguranceTime, maxFractionTime, maxExtensionTime } =
          value.data[0];
        if (
          maxAsseguranceTime != null &&
          maxFractionTime !== null &&
          maxExtensionTime !== null
        ) {
          this.period = true;
          this.periods.setValue(maxAsseguranceTime);
          this.periods1.setValue(maxFractionTime);
          this.periods2.setValue(maxExtensionTime);
        } else {
          this.onLoadToast('error', 'No existen Periodos', 'Periodos Vacíos');
        }
      },
    });
  }
  clean() {
    this.form.reset();
    this.searching = false;

    let fichaObjeto: any = {};
    fichaObjeto.periodEndDate = null;
    fichaObjeto.notificationDate = null;
    fichaObjeto.duct = null;
    fichaObjeto.notifiedTo = null;
    fichaObjeto.notifiedPlace = null;
    fichaObjeto.editPublicationDate = null;
    fichaObjeto.newspaperPublication = null;
    fichaObjeto.observation = null;
    fichaObjeto.statusNotified = null;
    this.dataTable.load([fichaObjeto]);
  }

  search() {
    if (this.goodId.value != null) {
      this.getGoods();
    } else {
      this.message('info', 'Error', 'Debe llenar algun filtro.');
    }
  }
  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  getUserInfo() {
    return this.programmingRequestService.getUserInfo().subscribe({
      next: (data: any) => {
        console.log(data);
        this.username = data.username;
      },
      error: error => {
        error;
      },
    });
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  accept() {
    let fecha1 = this.formatDate(this.dataArray[0].notificationDate);
    let fecha2 = this.formatDate(this.dataArray[0].periodEndDate);
    let fecha3 = this.formatDate(this.dataArray[0].editPublicationDate);

    let body = {
      estatus: 'VXP',
      fec_notificacion: fecha1 || '',
      fec_termino_periodo: fecha2 || '',
      fec_vencimiento_abandono: fecha3 || '',
      no_bien: Number(this.form.value.goodId),
      usuario: this.username,
      vc_pantalla: 'FACTREFACTAENTREC',
      changeStatusProgram: 'FACTREFACTAERCIER',
    };

    const validacionStatus = this.dataArray.every((item: any) => {
      item.statusNotified === 'DE';
    });

    console.log('Body a enviar: ', body);

    if (this.dataArray.length < 2) {
      this.onLoadToast(
        'error',
        'Error',
        'Deben haber 2 notificaciones de devolución para confirmar'
      );
    } else {
      this.notificacionAbandono.confirmarStatus(body).subscribe({
        next: data => {
          console.log(data);
          this.onLoadToast(
            'success',
            'Guardado',
            'Registros actualizados exitosamente'
          );
          this.clean();
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Hubo un error actualizando la base de datos'
          );
          this.clean();
        },
      });
    }
  }
}
