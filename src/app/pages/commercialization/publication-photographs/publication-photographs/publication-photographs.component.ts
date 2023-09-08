import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import {
  IComerLotEvent,
  IGoodPhoto,
} from 'src/app/core/models/ms-parametercomer/parameter';

import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { PublicationPhotographsService } from 'src/app/core/services/ms-parametercomer/publication-photographs.service';
import { ComerClientService } from 'src/app/core/services/ms-prepareevent/comer-clients.service';
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
  rowAllotment: string = null;
  selectedRow: any = null;
  title: string = 'Publicación de fotografías';
  selectedEvent: any = null;
  dataParams2 = new BehaviorSubject<ListParams>(new ListParams());
  dataParams1 = new BehaviorSubject<ListParams>(new ListParams());
  loading2: boolean = this.loading;
  rowSelectedGood: boolean = false;
  selectedGood: any;
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

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerLotService: ComerLotService,
    private comerEventService: ComerEventosService,
    private publicationPhotographsService: PublicationPhotographsService,
    private prepareeventServices: ComerClientService
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
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, [Validators.required]],
      eventId: [null],
      tpeventoId: [null],
      statusvtaId: [null],
      // place: [null],
      // location: [null],
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

  searchEvent(): void {
    const eventId = this.form.controls['eventId'].value;
    if (!eventId) {
      this.alert('warning', this.title, 'Debe ingresar un evento');
      return;
    }
    //this.enabledOrDisabledControl('eventId', false);
    this.comerEventService.getComerEventById(eventId).subscribe({
      next: (event: any) => {
        // this.enabledOrDisabledControl('eventId', true);
        console.log({ event });
        this.selectedEvent = event || null;
        this.getLot();
        //this.getcomerGoodxLot();
      },
      error: () => {
        //this.enabledOrDisabledControl('eventId', true);
        this.alert('warning', this.title, 'No se encontró el evento');
      },
    });
  }

  getLot() {
    this.loading = true;
    this.dataParams1.getValue()[
      'filter.idEvent'
    ] = `$eq:${this.selectedEvent.id}`;
    this.comerLotService.getEatLotAll(this.dataParams1.getValue()).subscribe({
      next: data => {
        console.log(data);
        this.loading = false;
        this.data1.load(data.data);
        this.data1.refresh();
        this.totalItems1 = data.count;
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
      },
    });
  }

  getcomerGoodxLot(idLot: number | string) {
    this.loading2 = true;
    this.dataParams2.getValue()['filter.lotId'] = `$eq:${idLot}`;
    this.prepareeventServices
      .getcomerGoodxLot(this.dataParams2.getValue())
      .subscribe({
        next: data => {
          this.loading2 = false;
          const dataRep = data.data.map((item: any) => {
            return {
              ...item,
              status: item.good.status,
              description: item.good.description,
            };
          });
          this.data2.load(dataRep);
          this.data2.refresh();
          this.totalItems2 = data.count;
        },
        error: error => {
          this.loading2 = false;
        },
      });
  }

  selectRowGood(event: any) {
    this.rowSelectedGood = true;
    this.selectedLot = event;
    this.getcomerGoodxLot(this.selectedLot.idLot);
    this.rowAllotment = this.selectedLot.idLot;
  }

  selectRow(event: any) {
    console.log(event);
    this.selectedGood = null;
    this.selectedGood = event;
    this.goodNumber = event.goodNumber;
  }

  userRowSelect(event: any) {
    this.lot = event.data.id;
  }

  enableInputEvent(): void {
    this.selectedEvent = null;
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
