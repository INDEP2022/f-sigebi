import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';
import { IComerUsuaTxEvent } from 'src/app/core/models/ms-event/comer-usuatxevent-model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
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
  comerUsuaTxEvent: IComerUsuaTxEvent[] = [];
  idEventE: IComerEvent;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  users = new DefaultSelect<IComerClients>();

  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosService,
    private comerUsuauTxEventService: ComerUsuauTxEventService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      processKey: [null, []],
      username: [null, []],
      address: [null, []],
    });
  }

  cleanForm(): void {
    this.form.reset();
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
          this.alert('info', 'No se encontraron registros', '');
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
    const modalConfig = MODAL_CONFIG;
    const idE = { ...this.idEventE };
    let event = this.idEventE;
    modalConfig.initialState = {
      comerUser,
      event,
      idE,
      callback: (next: boolean) => {
        if (next) this.getUserByidEVent(comerUser.idEvent);
      },
    };
    this.modalService.show(EvenPermissionControlModalComponent, modalConfig);
  }
}
