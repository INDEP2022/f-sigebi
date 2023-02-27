import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerUsuauTxEventService } from 'src/app/core/services/ms-event/comer-usuautxevento.service';
import { IComerUsuaTxEvent } from 'src/app/core/models/ms-event/comer-usuatxevent-model';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { EvenPermissionControlModalComponent } from '../even-permission-control-modal/even-permission-control-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

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
  comerUsuaTxEvent: IComerUsuaTxEvent[]=[];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  

  constructor(private fb: FormBuilder, private comerEventosService:ComerEventosService, private comerUsuauTxEventService:ComerUsuauTxEventService, private modalService: BsModalService,) {
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

  getEventByID(): void{
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

  getUserEvent(id: string | number) : void {
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
    modalConfig.initialState = {
      comerUser,
      callback: (next: boolean) => {
       if (next) this.getUserByidEVent(comerUser.idEvent);
      },
    };
    this.modalService.show(
      EvenPermissionControlModalComponent,
      modalConfig
    );
  }



}
