import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ButtonSelectComponent } from '../components/button-select/button-select.component';
import { GOODS_COLUMNS, NOTIFICATIONS_COLUMNS } from './columns';

@Component({
  selector: 'app-records-tracker',
  templateUrl: './records-tracker.component.html',
  styleUrls: ['./records-tracker.component.scss'],
})
export class RecordsTrackerComponent extends BasePage implements OnInit {
  @ViewChild('scrollTable') scrollTable: ElementRef<HTMLDivElement>;
  form: FormGroup;
  select = new DefaultSelect();
  notificationselect = new DefaultSelect();
  minsPublic = new DefaultSelect();
  entsFed = new DefaultSelect();
  columnFilters: any = [];
  columnFiltersGoods: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGood = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsGood: number = 0;
  data: LocalDataSource = new LocalDataSource();
  dataGood: LocalDataSource = new LocalDataSource();
  loadingGood: boolean = this.loading;
  settingsNotifications = this.settings;
  settingsGood = this.settings;
  showTable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private minPubService: MinPubService,
    private entFedService: EntFedService,
    private goodService: GoodService
  ) {
    super();

    this.settingsNotifications = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        acciones: {
          title: 'Acciones',
          type: 'custom', // Indicamos que esta columna utilizará un componente personalizado
          sort: false,
          filter: false,
          with: '20%',
          renderComponent: ButtonSelectComponent, // Nombre del componente personalizado que mostrará el botón
          onComponentInitFunction: (instance: any) => {
            instance.someClick.subscribe((row: any) => {
              // Aquí puedes manejar el evento de clic del botón si es necesario
              console.log('Seleccionar', row);
            });
            instance.viewGood.subscribe((row: any) => {
              // Aquí puedes manejar el evento de clic del botón si es necesario
              console.log('Ver bienes', row);
              this.selectNotification(row);
            });
          },
        },
        ...NOTIFICATIONS_COLUMNS,
      },
    };

    this.settingsGood = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.initForms();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getNotificationsTable();
    });
  }

  initForms() {
    this.form = this.fb.group({
      noExpediente: [null],
      averPrevia: [null],
      causaPenal: [null],
      noVolante: [null],
      indiciado: [null],
      fechaRec: [null],
      amparo: [null],
      tocaPenal: [null],
      noJuzgado: [null],
      fechaOficio: [null],
      minPub: [null],
      oficioExterno: [null],
      entFed: [null],
    });
  }

  getNotifications(params?: ListParams) {
    params['filter.protectionKey'] = `$ilike:a`;
    this.notificationService.getAll(params).subscribe({
      next: resp => {
        const data = resp.data.map(element => {
          return {
            ...element,
            externalOfficeDate: element.externalOfficeDate
              .toString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join('/'),
            receiptDate: element.receiptDate
              .toString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join('/'),
          };
        });
        console.log(data);
        this.notificationselect = new DefaultSelect(data, resp.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.notificationselect = new DefaultSelect();
      },
    });
  }

  getMinsPublic(params?: ListParams) {
    this.minPubService.getAll(params).subscribe({
      next: response => {
        this.minsPublic = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.minsPublic = new DefaultSelect();
      },
    });
  }

  getEntFed(params?: ListParams) {
    this.entFedService.getAll(params).subscribe({
      next: response => {
        this.entsFed = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.alert('error', 'Error', error);
        this.entsFed = new DefaultSelect();
      },
    });
  }

  onNotificationChange(event: any) {
    console.log(event);
  }

  onMinsPublicChange(event: any) {
    console.log(event);
  }

  consult() {
    this.showTable = true;
    console.log(this.form.value);
    if (this.form.controls['noExpediente'].value !== null) {
      this.params.value.page = 1;
      this.params.getValue()[
        'filter.expedientNumber'
      ] = `$eq:${this.form.controls['noExpediente'].value}`;
    } else {
      delete this.params.getValue()['filter.expedientNumber'];
      //this.params.getValue()['filter.preliminaryInquiry'] = `$eq:${this.form.controls['averPrevia'].value}`;
    }
    this.getNotificationsTable();
    this.scrollTable.nativeElement.scrollIntoView();
  }

  clean() {
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.dataGood.load([]);
    this.dataGood.refresh();
    this.showTable = false;
  }

  getNotificationsTable() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.notificationService.getAll(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getGoodsTable(fileNumber: number | string) {
    this.loadingGood = true;
    let params = {
      ...this.paramsGood.getValue(),
      ...this.columnFiltersGoods,
    };
    params['filter.fileNumber'] = `$eq:${fileNumber}`;
    this.goodService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.dataGood.load(resp.data);
        this.dataGood.refresh();
        this.totalItemsGood = resp.count;
        this.loadingGood = false;
      },
      error: err => {
        this.dataGood.load([]);
        this.dataGood.refresh();
        this.totalItemsGood = 0;
        this.loadingGood = false;
      },
    });
  }

  selectNotification(event: any) {
    console.log(event);
    this.getGoodsTable(event.expedientNumber);
  }

  selectAndExit(event: any) {
    console.log(event);
  }
}
