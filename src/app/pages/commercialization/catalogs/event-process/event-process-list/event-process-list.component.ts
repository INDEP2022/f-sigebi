import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { EventProcessFormComponent } from '../event-process-form/event-process-form.component';
//Services
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
//Models
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';

@Component({
  selector: 'app-event-process-list',
  templateUrl: './event-process-list.component.html',
  styles: [],
})
export class EventProcessListComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  comerEvent: IComerEvent[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      goodType: [null, [Validators.required]],
    });
  }

  getEvents() {
    let tpeventoId = this.form.controls['goodType'].value;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventsByType(tpeventoId));
  }

  getEventsByType(id: string | number): void {
    this.loading = true;
    this.comerEventosService
      .getEventsByType(id, this.params.getValue())
      .subscribe({
        next: response => {
          this.comerEvent = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  openForm(comerEvent?: IComerEvent) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      comerEvent,
      callback: (next: boolean) => {
        if (next) this.getEvents();
      },
    };
    this.modalService.show(EventProcessFormComponent, modalConfig);
  }
}
