import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProccesNum } from 'src/app/core/models/ms-numerary/numerary.model';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared';
import { ProcessService } from '../process.service';
import { clearGoodCheck, goodCheck, REQUESTS_COLUMNS_MODAL } from './columns';

@Component({
  selector: 'app-modal-request',
  templateUrl: './modal-request.component.html',
  styles: [],
})
export class ModalRequestComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  @Input() process: IProccesNum;

  constructor(
    private modalRef: BsModalRef,
    private readonly numeraryService: NumeraryService,
    private readonly processService: ProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUESTS_COLUMNS_MODAL,
    };
    //this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeEnc());
    console.log('Inicio el Modal');
    this.processService.getProcess().subscribe(data => {
      this.process = data;
      console.log('Consumiendo observable', this.process);
    });
  }

  getRequestNumeEnc() {
    this.loading = true;
    this.numeraryService
      .getNumeraryRequestNumeEnc(this.params.getValue())
      .subscribe({
        next: resp => {
          console.log(resp.data);
          this.data1 = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
        },
      });
  }

  close() {
    clearGoodCheck();
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.alert('success', 'Registro de inventario', `${message} correctamente`);
    this.loading = false;
    this.modalRef.content.callback(goodCheck);
    clearGoodCheck();
    this.modalRef.hide();
  }

  async confirm() {
    if (this.process === undefined || this.process === null) {
      const resp = await this.alertQuestion(
        'question',
        '¿Desea continuar?',
        'Se generará un nuevo proceso'
      );
      if (resp.isConfirmed) {
        /// se genera el pre Inset
        this.modalRef.content.callback('preInsert');
      } else {
        clearGoodCheck();
        this.modalRef.hide();
        return;
      }
    } else {
      const resp = await this.alertQuestion(
        'question',
        '¿Desea continuar?',
        'Se adicionaran las solicitudes al proceso'
      );
      if (!resp.isConfirmed) {
        clearGoodCheck();
        this.modalRef.hide();
        return;
      }
    }

    if (this.process) {
      /// AGREGARLE ESTO AL REGISTER DEL REGISTRO
      // :SOLICITUDES_NUME_ENC1.ID_PROCNUM := :PROCESOS_NUME.ID_PROCNUM;
      // :SOLICITUDES_NUME_ENC1.ESTATUS_SOLNUM := 'P';
      // Y GUARDAR ESTO
    } else {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'No se identificó el proceso.'
      );
    }
  }
}
