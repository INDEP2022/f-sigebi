import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUpdateMassive } from 'src/app/core/models/catalogs/save-value.model';
import { IDocument } from 'src/app/core/models/ms-documents/document';
import { BatteryService } from 'src/app/core/services/catalogs/battery.service';
import { LockerService } from 'src/app/core/services/catalogs/locker.service';
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { ShelvesService } from 'src/app/core/services/catalogs/shelves.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

interface IGuardaValor {
  estatus_estante: string;
  estatus_casillero: string;
  estatus_bateria: string;
  cve_guardavalor: string;
  desc_guardavalor: string;
  no_bateria: string;
  desc_bateria: string;
  no_estante: string;
  desc_estante: string;
  no_casillero: string;
  desc_casillero: string;
}

@Component({
  selector: 'app-modal-guarda-valor',
  templateUrl: './modal-guarda-valor.component.html',
  styles: [],
})
export class ModalGuardaValorComponent extends BasePage implements OnInit {
  title: string;
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  bank: any;
  guardadores = new DefaultSelect<any>();
  baterias = new DefaultSelect<any>();
  empanios = new DefaultSelect<any>();
  anaqueles = new DefaultSelect<any>();
  blkGuardaValor: IGuardaValor;
  document: IDocument;
  // @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private saveValueService: SaveValueService,
    private lockerService: LockerService,
    private batteryService: BatteryService,
    private shelvesService: ShelvesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGuardador({ page: 1, limit: 10 });
  }
  prepareForm() {
    this.form = this.fb.group({
      guardador: [null, [Validators.required]],
      bateria: [null, [Validators.required]],
      empanio: [null, [Validators.required]],
      anaquel: [null, [Validators.required]],
      estatus_bateria: [null],
      estatus_estante: [null],
      estatus_casillero: [null],
    });
  }

  confirm() {
    const model: IUpdateMassive = {
      batteryNumber: this.form.get('bateria').value,
      shelfNumber: this.form.get('empanio').value,
      lockerNumber: this.form.get('anaquel').value,
      valueGuardKey: this.form.get('guardador').value,
      batteryStatus: this.form.get('estatus_bateria').value,
      shelfStatus: this.form.get('estatus_estante').value,
      lockerStatus: this.form.get('estatus_casillero').value,
      fileNumber: this.document.numberProceedings,
    };
    this.saveValueService.massiveUpdate(model).subscribe({
      next: response => {
        this.handleSuccess();
      },
      error: err => {
        this.alert('error', this.title, 'No se Pudo Realizar la Operación');
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.alert('success', this.title, 'Operación Realizada Correctamente');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getGuardador(params: ListParams) {
    this.saveValueService.getAll(params).subscribe({
      next: response => {
        this.guardadores = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }
  getBaterias(params: ListParams) {
    if (this.form.get('guardador').value)
      params['filter.storeCode'] = `$eq:${this.form.get('guardador').value}`;
    params['filter.status'] = `$neq:L`;
    this.batteryService.getAll(params).subscribe({
      next: response => {
        this.baterias = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }
  getEmpanios(params: ListParams) {
    if (this.form.get('guardador').value)
      params['filter.key.id'] = `$eq:${this.form.get('guardador').value}`;
    if (this.form.get('bateria').value)
      params['filter.batteryNumber'] = `$eq:${this.form.get('bateria').value}`;
    params['filter.status'] = `$neq:L`;
    this.shelvesService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.empanios = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }
  getAnaqueles(params: ListParams) {
    if (this.form.get('guardador').value)
      params['filter.saveValueKey'] = `$eq:${this.form.get('guardador').value}`;
    if (this.form.get('bateria').value)
      params['filter.numBattery'] = `$eq:${this.form.get('bateria').value}`;
    if (this.form.get('empanio').value)
      params['filter.numShelf'] = `$eq:${this.form.get('empanio').value}`;
    params['filter.status'] = `$neq:L`;
    this.lockerService.getAll(params).subscribe({
      next: response => {
        this.anaqueles = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        if (err.status === 0) {
          const error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('warning', 'Error', 'No se Encontraron Registros');
        }
      },
    });
  }

  onGuardadorChange(events: any) {
    this.form.get('guardador').setValue(events.id);
    this.getBaterias({ page: 1, limit: 10 });
  }

  onBateriaChange(events: any) {
    this.form.get('bateria').setValue(events.idBattery);
    this.getEmpanios({ page: 1, limit: 10 });
  }

  onEmpanioChange(events: any) {
    this.form.get('guardador').setValue(events.id);
    //this.getAnaqueles({ page: 1, limit: 10 })
  }

  onAnaquelChange(events: any) {
    this.form.get('guardador').setValue(events.id);
  }
}
