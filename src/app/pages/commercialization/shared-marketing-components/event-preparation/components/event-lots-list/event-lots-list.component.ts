import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  map,
  of,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerLotService } from 'src/app/core/services/ms-prepareevent/comer-lot.service';
import { BasePage } from 'src/app/core/shared';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';
import { EVENT_LOT_LIST_COLUMNS } from '../../utils/table-columns/event-lots-list-columns';
import { EventLotFormComponent } from '../event-lot-form/event-lot-form.component';

const ALLOWED_EXTENSIONS = ['xls', 'xlsx', 'csv'];
@Component({
  selector: 'event-lots-list',
  templateUrl: './event-lots-list.component.html',
  styles: [],
})
export class EventLotsListComponent extends BasePage implements OnInit {
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @Input() params = new BehaviorSubject(new FilterParams());
  @Output() onSelectLot = new EventEmitter<IComerLot>();

  @Input() viewRejectedGoods: boolean;
  @Output() viewRejectedGoodsChange = new EventEmitter<boolean>();
  @Output() fillStadistics = new EventEmitter<void>();
  @ViewChild('validFileInput', { static: true })
  validFileInput: ElementRef<HTMLInputElement>;
  totalItems = 0;
  @Input() lots = new LocalDataSource();
  @Input() onlyBase = false;
  lotSelected: IComerLot = null;

  excelControl = new FormControl(null);
  get controls() {
    return this.eventForm.controls;
  }

  constructor(
    private comerLotService: ComerLotService,
    private modalService: BsModalService,
    private lotService: LotService,
    private comerGoodsXLotService: ComerGoodsXLotService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: EVENT_LOT_LIST_COLUMNS,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
    };
  }

  refreshTable() {
    const params = new FilterParams();
    this.params.next(params);
  }

  fileChange(event: Event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => this.getLots(params).subscribe())
      )
      .subscribe();
  }

  columnsFilter() {
    return this.lots.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        const columns = this.settings.columns as any;
        const operator = columns[filter.field]?.operator;
        if (!filter.search) {
          return;
        }
        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  getLots(params: FilterParams) {
    this.onSelectLot.emit(null);
    this.loading = true;
    const { id } = this.controls;
    if (id.value) {
      params.addFilter('eventId', id.value);
    }
    params.sortBy = 'publicLot:ASC';
    return this.comerLotService.getAllFilterPostQuery(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.lots.load([]);
        this.lots.refresh();
        this.totalItems = 0;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        console.log(response.data);
        this.lots.load(response.data);
        this.lots.refresh();
        this.totalItems = response.count;
      })
    );
  }

  userSelectLot(event: any) {
    if (event.isSelected) {
      this.lotSelected = event.data;
    } else {
      this.lotSelected = null;
    }
    this.onSelectLot.emit(this.lotSelected);
  }

  openForm(lot?: IComerLot) {
    this.modalService.show(EventLotFormComponent, {
      ...MODAL_CONFIG,
      initialState: {
        eventForm: this.eventForm,
        lot: lot,
        callback: (refresh: boolean) => {
          if (refresh) {
            this.refreshTable();
          }
        },
      },
    });
  }

  isSomeLotSelected() {
    if (!this.lotSelected) {
      this.alert('error', 'Error', 'Primero Selecciona un Registro');
      return false;
    }
    return true;
  }

  onActDesc() {
    // if (!this.isSomeLotSelected()) {
    //   return;
    // }
    this.updateDesc().subscribe();
  }

  updateDesc() {
    this.loader.load = true;
    const { id } = this.controls;
    return this.lotService.eventValDesc(id.value).pipe(
      catchError(error => {
        this.loader.load = false;
        return throwError(() => error);
      }),
      tap(res => {
        this.loader.load = false;
        this.alert('success', 'Proceso Terminado', '');
        this.refreshTable();
      })
    );
  }

  onUpdateMand() {
    if (!this.isSomeLotSelected()) {
      return;
    }
    this.updateMand().subscribe();
  }

  updateMand() {
    this.loader.load = true;
    return this.lotService
      .updateMandate({
        pGood: this.parameters.pDirection == 'M' ? 0 : 1,
        pLot: 1,
        lotId: this.lotSelected.id,
      })
      .pipe(
        catchError(error => {
          this.loader.load = false;
          return throwError(() => error);
        }),
        tap(res => {
          this.loader.load = false;
          this.alert('success', 'Proceso Terminado', '');
          this.refreshTable();
        })
      );
  }

  onValFile() {
    this.validFileInput.nativeElement.click();
  }

  async valFileChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.excelControl.reset();
      return;
    }
    const askIsLotifying = await this.alertQuestion(
      'question',
      '¿Está Lotificando?',
      '',
      'Si',
      'No'
    );
    if (this.onlyBase) {
      console.warn('VALIDA COLUMNAS BASE');

      this.onValidateBaseColumns(askIsLotifying, event);
      return;
    }
    if (askIsLotifying.isConfirmed) {
      this.validateCsv(event).subscribe();
      return;
    }

    if (askIsLotifying.dismiss == Swal.DismissReason.cancel) {
      this.validateCsvCustomers(event).subscribe();
      return;
    }
    this.excelControl.reset();
  }

  isValidFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files.length) {
      return false;
    }
    if (target.files.length > 1) {
      this.alert('error', 'Error', 'Solo puede seleccionar un Archivo');
      return false;
    }
    const file = target.files[0];
    const filename = file.name;
    const extension = filename.split('.').at(-1);
    if (!extension) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    return true;
  }

  /** PUP_VALCSV */
  validateCsv(event: Event) {
    console.warn('PUP_VALCSV');
    const { eventTpId } = this.controls;
    const body = {
      file: this.getFileFromEvent(event),
      tpeventId: eventTpId.value,
    };
    return this.lotService.validateCSV(body).pipe(
      catchError(error => {
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        console.log({ response });
      })
    );
  }

  /** PUP_VALCSV_CLIENTES */
  validateCsvCustomers(event: Event) {
    console.warn('PUP_VALCSV_CLIENTES');
    const file = this.getFileFromEvent(event);
    return this.lotService.validateCustomersCSV(file).pipe(
      catchError(error => {
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        console.log({ response });
      })
    );
  }

  /** VALIDA_COLUMNASBASE */
  onValidateBaseColumns(askIsLotifying: SweetAlertResult, event: Event) {
    let type: 'CLIENTES' | 'LOTES' = null;
    if (askIsLotifying.isConfirmed) {
      type = 'LOTES';
    }

    if (askIsLotifying.dismiss == Swal.DismissReason.cancel) {
      type = 'CLIENTES';
    }
    if (type) {
      const file = this.getFileFromEvent(event);
      this.validateBaseColumns(type, file).subscribe();
    }
  }

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const filename = file.name;
    return file;
  }

  validateBaseColumns(type: 'CLIENTES' | 'LOTES', file: File) {
    return this.lotService
      .validBaseColumns({
        file,
        function: type,
        address: this.parameters.pDirection,
      })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(async response => {
          const errors = response.data
            .filter(column => column?.ERROR)
            .map(column => column.ERROR);
          console.log({ errors });
          if (!errors.length) {
            this.alert(
              'success',
              'No se encontraron errores en su archivo',
              ''
            );
            return;
          }
          // const message = errors.join(`
          //   `);
          // this.alert('error', 'Error', message);
          for (let index = 0; index < errors.length; index++) {
            await this.alertInfo('error', 'Error', errors[index]);
          }
        })
      );
  }

  async onDeleteLot(lot: IComerLot) {
    const confirm = await this.alertQuestion(
      'question',
      'Eliminar',
      '¿Desea eliminar este registro?'
    );
    const { isConfirmed } = confirm;
    if (!isConfirmed) {
      return;
    }
    const goodsInLot = await this.countGoodsInLot(lot);
    if (goodsInLot > 0) {
      this.alert(
        'error',
        'Error',
        'Hay información relacionada a este registro, no se puede eliminar'
      );
      return;
    }

    this.deleteLot(lot.id).subscribe();
  }

  deleteLot(lotId: string | number) {
    this.loading = true;
    return this.comerLotService.remove(lotId).pipe(
      catchError(error => {
        this.loading = false;
        if (error.error.message.includes('violates foreign key constraint')) {
          this.alert(
            'error',
            'Error',
            'Hay información relacionada a este registro, no se puede eliminar'
          );
        } else {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
        }
        return throwError(() => error);
      }),
      tap(() => {
        this.loading = false;
        this.alert('success', 'El Evento ha sido Eliminado', '');
        this.refreshTable();
      })
    );
  }

  async countGoodsInLot(lot: IComerLot) {
    const params = new FilterParams();
    params.addFilter('idLot', lot.id);
    this.loading = true;
    return await firstValueFrom(
      this.comerGoodsXLotService.getAllFilterPostQuery(params.getParams()).pipe(
        catchError(error => {
          this.loading = false;

          return of({ count: 0 });
        }),
        tap(() => (this.loading = false)),
        map(resp => resp.count ?? 0)
      )
    );
  }
}
