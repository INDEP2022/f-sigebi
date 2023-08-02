import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { IComerUsuaTxEvent } from 'src/app/core/models/ms-event/comer-usuatxevent-model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EvenPermissionControlModalComponent } from '../even-permission-control-modal/even-permission-control-modal.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-event-permission-control',
  templateUrl: './event-permission-control.component.html',
  styles: [],
})
export class EventPermissionControlComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  comerUsuaTxEvent: LocalDataSource = new LocalDataSource();
  idEventE: IComerEvent;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  users = new DefaultSelect<IComerClients>();
  comerEventSelect = new DefaultSelect();

  event_: any = null;
  columnFilters: any = [];
  layout: string;
  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosService,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private modalService: BsModalService,
    private comerEventService: ComerEventService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private token: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      delete: {
        deleteButtonContent:
          '<i id="tessst" class="fa fa-trash text-danger mx-2"></i>',
        confirmDelete: true,
      },
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'right',
        rowClassFunction: (row: any) => {
          console.log('SI', row);
          return;
        },
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        console.log(params.get('goodType'));
        // if (this.navigateCount > 0) {
        //   this.form.reset();
        //   this.clientRows = [];
        //   window.location.reload();
        // }
        this.layout = params.get('goodType');

        // this.navigateCount += 1;
      }
    });

    this.prepareForm();

    this.comerUsuaTxEvent
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              user: () => (searchFilter = SearchFilter.ILIKE),
              eventId: () => (searchFilter = SearchFilter.EQ),
              date: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getcomerUsersAutxEvent();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getcomerUsersAutxEvent());

    this.getComerEvents(new ListParams(), 'si');
  }

  prepareForm(): void {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      processKey: [null],
      username: [null, []],
      address: [null, []],
    });
  }

  cleanForm(): void {
    this.form.reset();
    this.comerUsuaTxEvent.load([]);
    this.comerUsuaTxEvent.refresh();
    this.totalItems = 0;
    this.event_ = null;
    this.getComerEvents(new ListParams(), 'o');
  }

  getEventByID(): void {
    let _id = this.form.controls['id'].value;
    this.loading = true;
    this.comerEventosService.getById(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getUserEvent(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se Encontraron Registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getUserEvent(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUserByidEVent(id));
  }

  getUserByidEVent(id?: string | number): void {
    this.loading = true;
    this.comerUsuauTxEventService.getByIdFilter(id).subscribe({
      next: response => {
        this.comerUsuaTxEvent = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(comerUser?: IComerUsuaTxEvent) {
    if (!this.event_) {
      this.alert('warning', 'Debe Seleccionar un Evento', '');
      return;
    }
    const modalConfig = MODAL_CONFIG;
    const idE = { ...this.idEventE };
    let event = this.event_;

    modalConfig.initialState = {
      comerUser,
      event,
      idE,
      callback: (next: boolean) => {
        if (next) this.getcomerUsersAutxEvent();
      },
    };
    this.modalService.show(EvenPermissionControlModalComponent, modalConfig);
  }

  // -------------------- WILMER -------------------- //
  getComerEvents(lparams: ListParams, filter: any) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('id_evento', lparams.text, SearchFilter.EQ);
    let obj = {
      p_direccion: this.layout,
      toolbar_usuario: this.token.decodeToken().preferred_username,
      usuario: this.token.decodeToken().preferred_username,
    };
    this.comerEventosService
      .getAppGetfComer(obj, params.getParams())
      .subscribe({
        next: data => {
          console.log('EVENT', data);
          this.comerEventSelect = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          if (filter == 'o') {
            this.comerEventSelect = new DefaultSelect();

            return;
          }
          if (filter != 'x') {
            this.alertInfo(
              'warning',
              'No se Encontraron Eventos Asociados',
              ''
            ).then(question => {
              if (question.isConfirmed) {
                if (filter == 'si') {
                  this.getComerEvents(new ListParams(), 'o');
                }
              }
            });
            this.comerEventSelect = new DefaultSelect();
          } else {
            this.alert('warning', 'No se Encontraron Eventos', '');
            this.comerEventSelect = new DefaultSelect();
            this.getComerEvents(new ListParams(), 'o');
          }
        },
      });
  }

  setValuesForm($event: any) {
    this.event_ = $event;
    if ($event) {
      this.form.patchValue({
        processKey: $event.cve_proceso,
        username: $event.usuario,
        address: $event.direccion,
      });
    } else {
      this.getComerEvents(new ListParams(), 'no');
    }
  }

  getcomerUsersAutxEvent(): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (!this.event_) {
      this.loading = false;
      return;
    }
    this.totalItems = 0;
    if (params['filter.date']) {
      var fecha = new Date(params['filter.date']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.date'] = `$eq:${fechaFormateada}`;
      // delete params['filter.date'];
    }
    console.log(this.event_);
    params['filter.eventId'] = `$eq:${this.event_.id_evento}`;
    this.usersService.getComerUsersAutXEvent(params).subscribe({
      next: response => {
        console.log(response.data);
        this.totalItems = response.count;
        this.comerUsuaTxEvent.load(response.data);
        this.comerUsuaTxEvent.refresh();
        this.loading = false;
      },
      error: err => {
        this.alert('warning', 'No se Encontraron Usuarios Por Eventos', '');
        this.comerUsuaTxEvent.load([]);
        this.comerUsuaTxEvent.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  questionDelete($event: any) {
    console.log($event);
    this.alertQuestion('question', '¿Desea Eliminar el Registro?', '').then(
      question => {
        if (question.isConfirmed) {
          let obj = {
            date: $event.date,
            eventId: $event.eventId,
            user: $event.user,
          };
          this.usersService.deleteComerUsersAutXEvent(obj).subscribe({
            next: response => {
              this.alert('success', 'El Registro se Eliminó Correctamente', '');

              this.getcomerUsersAutxEvent();
            },
            error: error => {
              this.alert(
                'error',
                'Ocurrió un Error al Eliminar el Registro',
                ''
              );
            },
          });
        }
      }
    );
  }
}
