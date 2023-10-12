import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
@Component({
  selector: 'act-modal',
  templateUrl: './act-modal.component.html',
  styles: [],
})
export class ActModalComponent extends BasePage implements OnInit {
  title: string = 'Actualizar Datos';
  totalItems: number = 0;
  data: any[] = [];

  constructor(
    private modalRef: BsModalRef,
    private comerInvoice: ComerInvoiceService,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        select: {
          title: 'Selección',
          sort: false,
          filter: false,
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: any) => {
            instance.toggle.subscribe((data: any) => {
              instance.rowData.select = data.toggle;
            });
          },
        },
        eventId: {
          title: 'Evento',
          type: 'string',
          sort: false,
        },
        batchId: {
          title: 'Lote',
          type: 'string',
          sort: false,
        },
        cause: {
          title: 'Causa',
          type: 'string',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  async updateData() {
    let n_id_event: number;
    if (this.data.length == 0) {
      this.alert('warning', 'Atención', 'Sin Lotes a procesar');
    } else {
      for (const act of this.data) {
        if (act.select) {
          n_id_event = act.eventId;
          if (act.n_fac_fol > 0) {
            const user = this.authService.decodeToken().preferred_username;
            await this.saveInvoice({
              eventId: Number(act.eventId),
              batchId: Number(act.batchId),
              user,
            });
          }
          await this.deleteInvoice({
            eventId: Number(act.eventId),
            batchId: Number(act.batchId),
          });

          const pk_comer: any = await this.packageInvoice({
            eventId: act.eventId,
            option: 0,
            publicLot: act.batchId,
            cveDisplay: 'FCOMER086_I',
            invoiceId: null,
            paymentId: null,
            document: 'FAC',
            secdoc: 'M',
            indGendet: 1,
            delegationNumber: null,
            command: null,
            partiality: null,
            type: null,
          });

          if (!pk_comer) {
            this.alert(
              'warning',
              'Atención',
              'Ha ocurrido un fallo en la operación'
            );
          } else if (pk_comer.p_RESUL == 'Correcto.') {
            this.alert('success', 'Proceso terminado', '');
          }
        }
      }
      this.modalRef.hide();
    }
  }

  close() {
    this.modalRef.hide();
  }

  async packageInvoice(data: any) {
    return firstValueFrom(
      this.comerInvoice.generatePreInvoice(data).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }

  async saveInvoice(data: any) {
    return firstValueFrom(
      this.comerInvoice.saveInvoiceProcedure(data).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }

  async deleteInvoice(data: any) {
    return firstValueFrom(
      this.comerInvoice.deleteInvoiceProcedure(data).pipe(
        map(resp => resp),
        catchError(() => of(null))
      )
    );
  }
}
