import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerTpEvent } from 'src/app/core/models/ms-event/event-type.model';
import {
  IThirdParty,
  ITypeEventXtercomer,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { TypeEventXterComerService } from 'src/app/core/services/ms-thirdparty/type-events-xter-comer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-type-event-modal',
  templateUrl: './type-event-modal.component.html',
  styles: [],
})
export class TypeEventModalComponent extends BasePage implements OnInit {
  title: string = 'Tipo de Evento';
  edit: boolean = false;

  typeEvent3erForm: ModelForm<ITypeEventXtercomer>;
  descr: ModelForm<any>;
  typeEvents: ITypeEventXtercomer;

  typeEventsSelect = new DefaultSelect();
  thirdPartySelect = new DefaultSelect();
  idTypeEvent: IComerTpEvent;
  thirPartys: IThirdParty;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeEventXterComerService: TypeEventXterComerService,
    private comerTpEventosService: ComerTpEventosService,
    private thirdPartyService: ThirdPartyService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('thirPartys', this.thirPartys);
    this.prepareForm();
  }

  private prepareForm() {
    this.typeEvent3erForm = this.fb.group({
      thirdPartyId: [null, []],
      typeEventId: [null, Validators.required],
    });

    this.descr = this.fb.group({
      description: [null],
    });
    if (this.typeEvents != null) {
      this.idTypeEvent = this.typeEvents
        .typeEventId as unknown as IComerTpEvent;
      console.log('valor', this.idTypeEvent);
      this.edit = true;
      this.typeEvent3erForm.patchValue({
        thirdPartyId: this.typeEvents.thirdPartyId,
        typeEventId: this.typeEvents.typeEventId,
      });
      // this.typeEvent3erForm.controls['typeEventId'].setValue(this.idTypeEvent);
    } else {
      if (this.thirPartys != null) {
        this.typeEvent3erForm.patchValue({
          thirdPartyId: this.thirPartys.id,
        });
      }
    }
  }

  getTypeEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    this.comerTpEventosService.getAll_(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map(item => {
          item['bindlabel_'] = item.id + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          console.log('EVENT', data);
          this.typeEventsSelect = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.typeEventsSelect = new DefaultSelect();
      },
    });
  }

  getThirdPartyAll(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    this.thirdPartyService.getAll(params.getParams()).subscribe({
      next: response => {
        console.log(response);
        this.thirdPartySelect = new DefaultSelect(
          response.data,
          response.count
        );
        this.loading = false;
      },
      error: error => {
        this.thirdPartySelect = new DefaultSelect();
        this.loading = false;
        console.log(error);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    let obj: ITypeEventXtercomer = {
      thirdPartyId: this.typeEvent3erForm.value.thirdPartyId,
      typeEventId: this.typeEvent3erForm.value.typeEventId,
    };
    this.typeEventXterComerService
      .update(
        this.typeEvents.thirdPartyId,
        this.typeEvents.typeEventId,
        this.typeEvent3erForm.value
      )
      .subscribe({
        next: data => {
          this.handleSuccess();
        },
        error: error => {
          this.handleError();
        },
      });
  }

  create() {
    this.loading = true;
    let obj: ITypeEventXtercomer = {
      thirdPartyId: this.typeEvent3erForm.value.thirdPartyId,
      typeEventId: this.typeEvent3erForm.value.typeEventId,
    };
    this.typeEventXterComerService
      .create(this.typeEvent3erForm.value)
      .subscribe({
        next: data => {
          this.handleSuccess();
        },
        error: error => {
          if (error.error.message == 'Ya existe un registro') {
            this.alert('warning', 'Ya Existe un Registro con Estos Datos', '');
          } else {
            this.handleError();
          }
        },
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Tipo de Evento ${message} Correctamente`, '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert('error', `Error al Intentar ${message} el tipo de Evento`, '');
  }

  llenarDescription($event: any) {
    console.log($event);

    if ($event) {
      this.descr.get('description').setValue($event.description);
    } else {
      this.descr.get('description').setValue('');
    }
  }
}
