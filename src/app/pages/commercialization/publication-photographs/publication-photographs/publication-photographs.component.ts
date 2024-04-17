import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import {
  IComerLotEvent,
  IGoodPhoto,
} from 'src/app/core/models/ms-parametercomer/parameter';

import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { PublicationPhotographsService } from 'src/app/core/services/ms-parametercomer/publication-photographs.service';
import { ComerClientService } from 'src/app/core/services/ms-prepareevent/comer-clients.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GoodPhoto,
  Lot,
  PUBLICATION_PHOTO1,
  PUBLICATION_PHOTO2,
} from './publication-photographs-columns';

@Component({
  selector: 'app-publication-photographs',
  templateUrl: './publication-photographs.component.html',
  styles: [
    `
      .float-check {
        position: absolute;
        top: -10px;
        right: -10px;
      }
    `,
  ],
  animations: [
    trigger('OnEventSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PublicationPhotographsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  formEvent: FormGroup = new FormGroup({});
  dataBatch: any;
  transform: number;
  selectedIndex = 0;
  lot: IComerLotEvent;
  eventList: IComerLotEvent[] = [];
  see: boolean;
  lotList: IComerLotEvent[] = [];
  photography: IGoodPhoto;
  photographyList: IGoodPhoto[] = [];
  subtype: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  batchList: any;
  selectedCve: any = null;
  selectedLot: any = null;
  cveItems = new DefaultSelect();
  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  data1: LocalDataSource = new LocalDataSource();
  // dataAllotment = DATA;
  idLot: number = 0;
  data2: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  rowAllotment: any = null;
  selectedRow: any = null;
  title: string = 'Publicación de fotografías';
  selectedEvent: any = null;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  dataParams1 = new BehaviorSubject<ListParams>(new ListParams());
  loading2: boolean = this.loading;
  rowSelectedGood: boolean = false;
  selectedGood: any = null;
  disabled: boolean = false;
  goodNumber: number = 0;
  disableButton: boolean = true;

  settings1;
  settings2;
  settings3;
  settings4;

  columns: any[] = [];
  @Output() refresh = new EventEmitter<true>();
  @Output() onConfirm = new EventEmitter<any>();
  comerEventSelect = new DefaultSelect();
  columnFilters: any = [];
  columnFilters2: any = [];
  columnFilters3: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerLotService: ComerLotService,
    private comerEventService: ComerEventosService,
    private _comerEventService: ComerEventService,
    private publicationPhotographsService: PublicationPhotographsService,
    private prepareeventServices: ComerClientService,
    private comerTpEventosService: ComerTpEventosService,
    private parameterModService: ParameterModService,
    private lotService: LotService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...PUBLICATION_PHOTO1 },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...PUBLICATION_PHOTO2 },
    };

    this.settings4 = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...Lot },
      noDataMessage: 'No se encontrarón registros',
    };

    this.settings3 = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...GoodPhoto },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              idLot: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              idStatusVta: () => (searchFilter = SearchFilter.ILIKE),
              nameClient: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getLot();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems1 > 0) this.getLot();
    });

    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.ILIKE),
              description: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getcomerGoodxLot(this.rowAllotment);
        }
      });

    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems1 > 0) this.getcomerGoodxLot(this.rowAllotment);
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      eventId: [null],
      tpeventoId: [null],
      statusvtaId: [null],
      descriptionPhoto: [null],
    });

    this.formEvent = this.fb.group({
      id: [null],
      eventTpId: [null],
      statusVtaId: [null],
      processKey: [null],
      observations: [null],
      address: [null],
      eventDate: [null],
      descStatus: [null],
      descType: [null],
    });
  }

  loadEvent(search: any) {
    this.comerLotService.findEvent(search).subscribe({
      next(data) {
        // this.eventList = data;
        console.log(data);
        console.log(data.data.count);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  eventSelected: any = null;
  async setValuesFormEvent(event?: any) {
    this.eventSelected = event;
    if (event) {
      const respTpEvent: any = await this.getTpEventos(event.eventTpId);
      if (!respTpEvent) {
        this.alert('warning', 'No se obtuvo el tipo de Evento', '');
      } else {
        console.log(respTpEvent);
      }
      const respStatusVta: any = await this.getAllComerStatusVta(
        event.statusVtaId
      );
      if (!respStatusVta) {
        this.alert('warning', 'No se obtuvo el tipo de Venta', '');
      } else {
        respStatusVta.description;
        console.log(respStatusVta);
      }
      this.formEvent.patchValue(event);
      this.formEvent.patchValue({
        descStatus: respStatusVta ? respStatusVta.description : null,
        descType: respTpEvent ? respTpEvent.description : null,
      });
      this.getLot();
    } else {
      this.clean();
    }
  }

  getTpEventos(id: any) {
    return new Promise((resolve, reject) => {
      this.comerTpEventosService.getByIdComerTEvents(id).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  getAllComerStatusVta(id: any) {
    const params = new ListParams();
    params['filter.salesStatusId'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.parameterModService.getAllComerStatusVta(params).subscribe({
        next(value) {
          resolve(value.data[0]);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  getComerEvents(params: ListParams) {
    if (params.text)
      if (!isNaN(parseInt(params?.text))) {
        params['filter.id'] = `${SearchFilter.EQ}:${params.text}`;
      } else {
        params['filter.id'] = `${SearchFilter.EQ}:${params.text}`;
      }

    this._comerEventService.getAllFilter(params).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['idAndProcess'] = item.id + ' - ' + item.processKey;
        });
        Promise.all(result).then(resp => {
          this.comerEventSelect = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.comerEventSelect = new DefaultSelect();
      },
    });
  }

  searchEvent(): void {
    const { id } = this.formEvent.value;
    if (!id) {
      this.alert('warning', 'Debe ingresar un evento', '');
    } else {
      this.getLot();
    }
  }

  getLot() {
    const { id } = this.formEvent.value;
    this.loading = true;
    const params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.idEvent'] = `$eq:${id}`;

    if (params['filter.nameClient']) {
      params['filter.client.nomRazon'] = params['filter.nameClient'];
      delete params['filter.nameClient'];
    }
    this.lotService.getFindAllRegistersTot(params).subscribe({
      next: data => {
        console.log(data);
        const result = data.items.map((item: any) => {
          item['nameClient'] = item.client ? item.client.nomRazon : null;
        });
        Promise.all(result).then(resp => {
          this.loading = false;
          this.data1.load(data.items);
          this.data1.refresh();
          this.totalItems1 = data.count;
        });
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
      },
    });
  }

  getcomerGoodxLot(idLot: number | string) {
    this.loading2 = true;
    const params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    params['filter.lotId'] = `$eq:${idLot}`;
    this.prepareeventServices.getcomerGoodxLot(params).subscribe({
      next: data => {
        console.log(data);
        this.loading2 = false;
        const result = data.data.map((item: any) => {});
        Promise.all(result).then(resp => {
          this.data2.load(data.data);
          this.data2.refresh();
          this.totalItems2 = data.count;
          this.loading2 = false;
        });
      },
      error: error => {
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
        this.loading2 = false;
      },
    });
  }

  selectRowGood(event: any) {
    this.rowSelectedGood = true;
    this.selectedLot = event;
    this.rowAllotment = this.selectedLot.idLot;
    this.getcomerGoodxLot(this.selectedLot.idLot);
  }

  selectRow(event: any) {
    console.log(event);
    this.selectedGood = event;
    this.goodNumber = 21838744;
  }

  userRowSelect(event: any) {
    this.lot = event.data.id;
  }

  clean(): void {
    this.selectedEvent = null;
    this.selectedGood = null;
    this.selectedLot = null;
    this.rowAllotment = '';
    this.formEvent.reset();
    this.data1.getFilter().filters = [];
    this.data1.refresh();

    this.data1.load([]);
    this.data1.refresh();
    this.totalItems1 = 0;

    this.data2.getFilter().filters = [];
    this.data2.refresh();

    this.data2.load([]);
    this.data2.refresh();
    this.totalItems2 = 0;

    this.enabledOrDisabledControl('eventId', true);
    //this.clearTables();
  }

  public() {
    this.alert('success', this.title, 'Publicación realizada');
  }

  fileEmiter(event: any[]) {
    if (event.length > 0) {
      this.disableButton = false;
    }
  }

  enabledOrDisabledControl(control: string, enabled: boolean) {
    if (enabled) {
      this.form.get(control).enable();
    } else {
      this.form.get(control).disable();
    }
  }
}
