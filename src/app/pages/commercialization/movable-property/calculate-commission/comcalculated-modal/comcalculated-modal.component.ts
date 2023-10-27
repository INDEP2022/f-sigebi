import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IThirdParty2 } from 'src/app/core/models/ms-thirdparty/third-party.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { ComerComCalculatedService } from 'src/app/core/services/ms-thirdparty/comer-comcalculated';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-comcalculated-modal',
  templateUrl: './comcalculated-modal.component.html',
  styles: [],
})
export class ComcalculatedModalComponent extends BasePage implements OnInit {
  title: string = 'Calcular';
  edit: boolean = false;

  calculatedForm: ModelForm<any>;
  calculated: any;

  idT: IThirdParty2;
  thirdPartySelect = new DefaultSelect();
  comerEventSelect = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerComCalculatedService: ComerComCalculatedService,
    private thirdPartyService: ThirdPartyService,
    private comerEventService: ComerEventService,
    private token: AuthService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  fecha1: any;
  fecha2: any;
  private prepareForm() {
    this.calculatedForm = this.fb.group({
      comCalculatedId: [null],
      thirdComerId: [null, Validators.required],
      userBelieve: [null],
      believeDate: [null],
      startDate: [null],
      endDate: [null],
      eventId: [null],
      changeType: [null, Validators.max(9999999999999)],
    });

    if (this.calculated != null) {
      this.edit = true;
      // this.idT = this.calculated.thirdComerId as unknown as IThirdParty2;
      this.calculatedForm.patchValue({
        // comCalculatedId: this.calculated.comCalculatedId,
        thirdComerId: this.calculated.thirdComerId,
        userBelieve: this.calculated.userBelieve,
        believeDate: this.calculated.believeDate,
        startDate: this.datePipe.transform(
          this.calculated.startDate,
          'dd-MM-yyyy'
        ),
        endDate: this.datePipe.transform(this.calculated.endDate, 'dd-MM-yyyy'),
        eventId: this.calculated.comerEvents,
        changeType: this.calculated.changeType,
      });
      this.fecha1 = this.calculatedForm.value.startDate;
      this.fecha2 = this.calculatedForm.value.endDate;
      this.calculatedForm.controls['thirdComerId'].setValue(
        this.calculated.IdAndNameReason
      );
      this.calculatedForm.controls['eventId'].setValue(
        this.calculated.idAndProcessKey
      );
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const thirdComerId = this.calculatedForm.value.thirdComerId;
    const eventId = this.calculatedForm.value.eventId;
    let obj = {
      thirdComerId: thirdComerId ? thirdComerId.id : null,
      userBelieve: 'USER',
      believeDate: new Date(),
      startDate: this.calculatedForm.value.startDate,
      endDate: this.calculatedForm.value.endDate,
      eventId: eventId ? eventId.id : null,
      changeType: this.calculatedForm.value.changeType,
    };
    this.comerComCalculatedService.createW(obj).subscribe({
      next: data => this.handleSuccess(),
      error: error => (
        this.alert(
          'error',
          'Ocurrió un error al guardar el registro',
          'Verifique e intente nuevamente'
        ),
        (this.loading = false)
      ),
    });
  }

  update() {
    this.loading = true;
    const thirdComerId = this.calculatedForm.value.thirdComerId;
    const eventId = this.calculatedForm.value.eventId;
    // const fecha1 = this.datePipe.transform(this.calculatedForm.value.startDate, 'yyyy-MM-dd')
    // const fecha2 = this.datePipe.transform(this.calculatedForm.value.endDate, 'yyyy-MM-dd')
    let obj = {
      thirdComerId: thirdComerId ? thirdComerId.id : null,
      userBelieve: this.calculated.userBelieve,
      believeDate: this.calculated.believeDate,
      startDate: this.convertirFecha1(this.calculatedForm.value.startDate),
      endDate: this.convertirFecha2(this.calculatedForm.value.endDate),
      eventId: eventId ? eventId.id : null,
      changeType: this.calculatedForm.value.changeType,
    };
    this.comerComCalculatedService
      .updateW(this.calculated.comCalculatedId, obj)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (
          this.alert(
            'error',
            'Ocurrió un error al actualizar el registro',
            'Verifique e intente nuevamente'
          ),
          (this.loading = false)
        ),
      });
  }

  convertirFecha1(fecha: any) {
    // Divide la fecha en sus componentes
    console.log('fecha', fecha);
    if (fecha) {
      if (this.fecha1 == fecha) {
        var partes = fecha.split('-');

        // Reorganiza los componentes en el formato deseado
        var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];

        return fechaFormateada;
      } else {
        fecha = this.datePipe.transform(fecha, 'dd-MM-yyyy');

        var partes = fecha.split('-');

        // Reorganiza los componentes en el formato deseado
        var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];

        return fechaFormateada;
      }
    } else {
      return null;
    }
  }

  convertirFecha2(fecha: any) {
    // Divide la fecha en sus componentes
    console.log('fecha', fecha);
    if (fecha) {
      if (this.fecha2 == fecha) {
        var partes = fecha.split('-');

        // Reorganiza los componentes en el formato deseado
        var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];

        return fechaFormateada;
      } else {
        fecha = this.datePipe.transform(fecha, 'dd-MM-yyyy');

        var partes = fecha.split('-');

        // Reorganiza los componentes en el formato deseado
        var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];

        return fechaFormateada;
      }
    } else {
      return null;
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'actualizado' : 'guardado';
    this.onLoadToast('success', `Registro ${message} correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getThirdPartyAll(lparams: ListParams) {
    this.loading = true;
    this.thirdPartyService.getFindItemCustom(lparams).subscribe({
      next: response => {
        console.log(response);
        let result = response.data.map((item: any) => {
          item['IdAndNameReason'] = item.id + ' - ' + item.nameReason;
        });
        Promise.all(result).then(resp => {
          this.thirdPartySelect = new DefaultSelect(
            response.data,
            response.count
          );
          // this.loading = false;
        });
      },
      error: error => {
        this.thirdPartySelect = new DefaultSelect([], 0);
        // this.loading = false;
      },
    });
  }
  selectThird($event: any) {}

  // COMER_EVENTOS
  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);
    // if (this.layout == 'M') params.addFilter('address', `M`, SearchFilter.EQ);

    // if (this.layout == 'I') {
    params.addFilter('address', `M`, SearchFilter.EQ);
    params.addFilter('eventTpId', `6`, SearchFilter.LT);

    // params.addFilter('eventTpId', `6,7`, SearchFilter.NOTIN);
    // params.addFilter('statusVtaId', `CONT`, SearchFilter.NOT);
    params.sortBy = `id:ASC`;
    this.comerEventService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map((item: any) => {
          item['idAndProcessKey'] = item.id + ' - ' + item.processKey;
        });
        Promise.all(result).then(resp => {
          this.comerEventSelect = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.comerEventSelect = new DefaultSelect();
      },
    });
  }
  selectEvent(event: any) {}
}
