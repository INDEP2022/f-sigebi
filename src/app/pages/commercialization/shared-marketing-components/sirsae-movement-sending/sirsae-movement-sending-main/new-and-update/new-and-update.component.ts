import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-and-update',
  templateUrl: './new-and-update.component.html',
  styles: [],
})
export class NewAndUpdateComponent extends BasePage implements OnInit {
  title: string = 'Cliente Del Evento';
  edit: boolean = false;

  form: ModelForm<any>;
  clients = new DefaultSelect();
  data: any;
  event: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerClientsService: ComerClientsService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      eventId: [null, [Validators.required]],
      customerId: [null, [Validators.required]],
      sendSirsae: [null, [Validators.required]],
    });
    if (this.data != null) {
      this.edit = true;
      this.form.patchValue({
        eventId: this.data.eventId,
        customerId: this.data.customerId,
        sendSirsae: this.data.sendSirsae,
      });
    } else {
      this.form.patchValue({
        eventId: this.event.id,
      });
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  update() {
    this.comerClientsService.updateClientXEvent(this.form.value).subscribe({
      next: response => {
        this.handleSuccess();
        this.modalRef.hide();
      },
      error: err => {
        if (err.error.message == 'ID previamente registrado') {
          this.alert('warning', 'Ya Existe un Registro con estos Datos', '');
        } else {
          this.handleError();
        }
      },
    });
  }

  create() {
    this.comerClientsService.createClientXEvent(this.form.value).subscribe({
      next: response => {
        this.handleSuccess();
        this.modalRef.hide();
      },
      error: err => {
        if (err.error.message == 'ID previamente registrado') {
          this.alert('warning', 'Ya Existe un Registro con estos Datos', '');
        } else {
          this.handleError();
        }
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Cliente ${message} Correctamente`, '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert('error', `Error al Intentar ${message} el Cliente`, '');
  }

  getClients(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('id', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('reasonName', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }

    this.comerClientsService.getAll_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndName'] = item.id + ' - ' + item.reasonName;
        });

        Promise.all(result).then(resp => {
          this.clients = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.clients = new DefaultSelect();
      },
    });
  }
}
