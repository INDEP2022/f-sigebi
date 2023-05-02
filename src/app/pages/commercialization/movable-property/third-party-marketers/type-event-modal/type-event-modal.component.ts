import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerTpEvent } from 'src/app/core/models/ms-event/event-type.model';
import { ITypeEventXtercomer } from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { TypeEventXterComerService } from 'src/app/core/services/ms-thirdparty/type-events-xter-comer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-type-event-modal',
  templateUrl: './type-event-modal.component.html',
  styles: [],
})
export class TypeEventModalComponent extends BasePage implements OnInit {
  title: string = 'Tipo de eventos';
  edit: boolean = false;

  typeEvent3erForm: ModelForm<ITypeEventXtercomer>;
  typeEvents: ITypeEventXtercomer;

  typeEventsSelect = new DefaultSelect();
  idTypeEvent: IComerTpEvent;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeEventXterComerService: TypeEventXterComerService,
    private comerTpEventosService: ComerTpEventosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeEvent3erForm = this.fb.group({
      thirdPartyId: [null, []],
      typeEventId: [null, []],
    });
    if (this.typeEvents != null) {
      this.idTypeEvent = this.typeEvents
        .typeEventId as unknown as IComerTpEvent;
      console.log('valor', this.idTypeEvent);
      this.edit = true;
      this.typeEvent3erForm.patchValue(this.typeEvents);
      this.typeEvent3erForm.controls['typeEventId'].setValue(this.idTypeEvent);
    }
  }

  getTypeEvents(params: ListParams) {
    this.comerTpEventosService.getAll(params).subscribe({
      next: data =>
        (this.typeEventsSelect = new DefaultSelect(data.data, data.count)),
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
    this.typeEventXterComerService
      .update(
        this.typeEvents.thirdPartyId,
        this.typeEvents.typeEventId,
        this.typeEvent3erForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  create() {
    this.loading = true;
    this.typeEventXterComerService
      .create(this.typeEvent3erForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
