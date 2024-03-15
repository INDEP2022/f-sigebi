import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_COMER_CLIENTS } from './columns-comer-clients';
import { cliente } from './object-clients';

@Component({
  selector: 'app-comer-clients-table',
  templateUrl: './comer-clients-table.html',
  styleUrls: ['./comer-clients-table.component.css'],
})
export class ComerClientsTableComponent extends BasePage implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  ID_TIPO_FALLO: string;
  idEventTMP: number;

  listObjects: any[] = [];
  @ViewChild('table', { static: false }) table: any;
  object: any;

  c_RESUL: string;
  c_TIPO: string;
  t_CLIENTES: string;
  n_CONT: number = 0;
  n_CONL: number = 0;
  n_CONP: number = 0;
  n_CONE: number = 0;
  n_CONK: number = 0;
  c_RELL: string = '';

  clientes: cliente[] = [];

  constructor(
    private modalRef: BsModalRef,
    private guarantyService: GuarantyService,
    private lotService: LotService,
    private goodprocessService: GoodprocessService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      selectMode: 'multi',
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },*/
      columns: { ...COLUMNS_COMER_CLIENTS },
    };
  }

  ngOnInit(): void {
    this.params = this.pageFilter(this.params);

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());

    this.c_TIPO = 'M' + this.ID_TIPO_FALLO;
    console.log('c_TIPO', this.c_TIPO);
  }

  getData() {
    this.loading = true;

    // this.params = this.pageFilter(this.params);
    this.params.getValue()['sortBy'] = `rfc:DESC`;
    let params = {
      ...this.params.getValue(),
      //...this.columnFiltersReprocess,
    };

    this.guarantyService.idEventXClient(params).subscribe({
      next: resp => {
        this.source = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  objectBuilder: string = '';
  miArray: [] = [];

  reProcess() {
    if (this.listObjects.length >= 2) {
      for (let i = 0; i < this.listObjects.length; i++) {
        //console.log('this.object[i]', this.object[i]);

        this.clientes.push(
          new cliente(
            this.object[i].idEvent,
            'S',
            this.object[i].rfc,
            this.object[i].idClient
          )
        );
      }

      console.log('Objeto construido: ', this.clientes);

      const body = {
        clientsEvent: this.clientes,

        C_RELL: null,
      };

      console.log('Body construido: ', body);

      this.goodprocessService.postTbClientsEvent(body).subscribe({
        next: resp => {
          console.log('respuesta de postTbClientsEvent', resp);

          this.n_CONL = resp.n_CONL;
          this.n_CONK = resp.n_CONK;
          this.n_CONT = resp.n_CONT;

          const rfc = resp.t_CLIENTES[1].RFC;

          this.executeValids(this.n_CONL, this.n_CONK, this.n_CONT, rfc);
        },
        error: error => {
          console.log('Error de postTbClientsEvent', error);
        },
      });
    } else if (this.listObjects.length == 1) {
      this.allEvent();
    }
  }

  executeValids(n_CONL: number, n_CONK: number, n_CONT: number, rfc: string) {
    console.log(
      'Método executeValids, n_CONL: ',
      n_CONL,
      'n_CONK: ',
      n_CONK,
      'n_CONT:',
      n_CONT
    );

    if (n_CONL == 0) {
      this.alert('success', 'No se seleccionó algún Cliente', '');
    } else if (n_CONK >= 1) {
      this.alert(
        'success',
        `Clientes con dispersión definitiva:${this.c_RELL}`,
        ''
      );
    } else if (n_CONT == n_CONL) {
      //const id_evento = this.idEventTMP;
      const id_evento = this.idEvent;

      this.alertQuestion(
        'question',
        'Se reprocesará todo el Evento',
        '¿Continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          this.lotService.paGarantXLote(id_evento).subscribe({
            next: resp => {
              console.log('respuesta de paGarantXLote', resp);
              this.alert(
                'success',
                'El Reproceso se realizó satisfactoriamente',
                ''
              );
              this.c_RESUL = 'OK';
            },
            error: error => {
              console.log('Error respuesta de paGarantXLote', error);
              this.alert('warning', 'El Reproceso no se realizó', '');
              this.c_RESUL = 'ERROR';
            },
          });
        }
      });
    } else {
      this.alertQuestion(
        'question',
        `Se reprocesará(n) ${n_CONL} Cliente(s) del Evento. `,
        '¿Continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          //const id_evento = this.idEventTMP;
          const id_evento = this.idEvent;

          for (let i = 1; i <= n_CONL; i++) {
            this.lotService.paGarantXLote(id_evento).subscribe({
              next: resp => {
                console.log('respuesta de paGarantXLote', resp);
                this.alert('success', `Cliente: ${rfc}, ${this.c_RESUL}`, '');
                this.c_RESUL = 'OK';
              },
              error: error => {
                console.log('Error respuesta de paGarantXLote', error);
                this.alert('warning', 'El Reproceso no se realizó', '');
                this.c_RESUL = 'ERROR';
              },
            });
          }

          this.alert('success', 'Ejecución realizada', '');
        }
      });
    }
  }

  allEvent() {
    //const id_evento = this.idEventTMP;
    const id_evento = this.idEvent;

    this.alertQuestion(
      'question',
      'Se reprocesará todo el Evento',
      '¿Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.lotService.paGarantXLote(id_evento).subscribe({
          next: resp => {
            console.log('respuesta de paGarantXLote', resp);
            this.alert(
              'success',
              'El Reproceso se realizó satisfactoriamente',
              ''
            );
            this.c_RESUL = 'OK';
          },
          error: error => {
            console.log('Error respuesta de paGarantXLote', error);
            this.alert('warning', 'El Reproceso no se realizó', '');
            this.c_RESUL = 'ERROR';
          },
        });
      }
    });
  }

  idEvent: number = 0;

  selectRows(event: any) {
    console.log('event.selected', event);
    this.idEvent = Number(event.data.idEvent);
    console.log('ID del primer Evento seleccionado', this.idEvent);
    this.c_RELL = event.data.rfc;

    if (event.isSelected == false) {
      this.table.isAllSelected = false;
    }
    this.listObjects = event.selected;

    if (this.listObjects.length <= 1) {
      if (event.isSelected === true) {
        this.object = this.listObjects[0];
      } else {
        this.object = null;
      }
    } else {
      this.object = this.listObjects;
      console.log('Objetos seleccionados: ', this.object);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
