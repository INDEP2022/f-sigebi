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
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ActModalComponent extends BasePage implements OnInit {
  title: string = 'Actualizar Datos';
  totalItems: number = 0;
  data: any[] = [];
  tloading: boolean = false;
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
    let valids: number = 0;
    let novalids: number = 0;
    if (this.data.length == 0) {
      this.alert('warning', 'Sin Lotes a procesar', '');
    } else {
      this.tloading = true;
      let result = this.data.map(async act => {
        if (act.select) {
          n_id_event = act.eventId;
          if (act.n_fac_fol > 0) {
            const user = this.authService.decodeToken().preferred_username;
            // PUP_NVO_GUARDA_FOLIOS
            await this.saveInvoice({
              eventId: Number(act.eventId),
              batchId: Number(act.batchId),
              user,
            });
          }
          // PUP_NVO_ELIMINA_FACT
          await this.deleteInvoice({
            eventId: Number(act.eventId),
            batchId: Number(act.batchId),
          });

          // PK_COMER_FACTINM.PA_AJU_FACTURA_PAG
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
            novalids = novalids + 1;
            this.alert('warning', 'Ha ocurrido un fallo en la operación', '');
          } else if (pk_comer.p_RESUL == 'Correcto.') {
            valids = valids + 1;
          }
        }
      });

      Promise.all(result).then(resp => {
        if (n_id_event) {
          this.modalRef.content.callback(n_id_event);
          this.modalRef.hide();
          this.alert('success', 'Proceso terminado', '');
        } else {
          this.alert('warning', 'Sin Lotes a procesar', '');
        }
        this.tloading = false;
      });
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
