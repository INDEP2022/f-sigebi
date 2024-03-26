import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_COMER_LOTES } from './columns-comer-lotes';
import { lote } from './objetct-lots';

@Component({
  selector: 'app-comer-lotes-table',
  templateUrl: './comer-lotes-table.html',
  styleUrls: ['./comer-lotes-table.component.css'],
})
export class ComerLotesTableComponent extends BasePage implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  listObjects: any[] = [];
  @ViewChild('table', { static: false }) table: any;
  object: any;

  idEventTMP: number;
  ID_TIPO_FALLO: string;

  c_RESUL: string;
  c_TIPO: string;
  t_LOTES: string;
  n_CONT: number = 0;
  n_CONL: number = 0;
  n_CONP: string = '';
  n_CONE: number = 0;
  n_CONK: number = 0;
  c_RELL: string = '';

  idEvent: number = 0;

  lotes: lote[] = [];

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
      columns: { ...COLUMNS_COMER_LOTES },
    };
  }

  ngOnInit(): void {
    this.params = this.pageFilter(this.params);

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;

    //this.params = this.pageFilter(this.params);
    this.params.getValue()['sortBy'] = `publicLot:DESC`;
    let params = {
      ...this.params.getValue(),
      //...this.columnFiltersReprocess,
    };

    this.guarantyService.idEventXLote(params).subscribe({
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

  selectRows(event: any) {
    console.log('event.selected', event);

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

  reProcess() {
    this.c_RESUL = '';
    this.c_TIPO = '';
    this.t_LOTES = '';
    this.n_CONT = 0;
    this.n_CONL = 0;
    this.n_CONP = '';
    this.n_CONE = 0;
    this.n_CONK = 0;
    this.c_RELL = '';
    this.lotes = [];

    if (this.listObjects.length == 0) {
      this.alertInfo('warning', 'No ha seleccionado ningún registro', '');
    }

    if (this.listObjects.length >= 2) {
      console.log('Mayor a 1');

      for (let i = 0; i < this.listObjects.length; i++) {
        this.lotes.push(
          new lote(
            this.object[i].idLot,
            'S',
            this.object[i].publicLot,
            this.object[i].idEvent
          )
        );
      }

      console.log('Objeto construido: ', this.lotes);

      const body = {
        eventLotes: this.lotes,

        C_RELL: null,
      };

      console.log('Body construido: ', body);

      this.goodprocessService.postTbLotsEvent(body).subscribe({
        next: resp => {
          console.log('respuesta de postTbLotsEvent', resp);

          this.n_CONT = resp.n_CONT;
          this.n_CONK = resp.n_CONK;
          this.n_CONL = resp.n_CONL;
          this.n_CONP = resp.n_CONP;

          const registerResponse = resp.t_LOTES.length;
          let uniqueValues = new Set();

          for (let i = 1; i < registerResponse; i++) {
            uniqueValues.add(resp.t_LOTES[i].LOTE_PUBLICO);

            // this.c_RELL = `${this.c_RELL}, ${resp.t_LOTES[i].lote}`;
          }

          this.c_RELL = Array.from(uniqueValues).join(', ');

          this.executeValids(
            this.n_CONT,
            this.n_CONK,
            this.n_CONL,
            this.n_CONP,
            this.c_RELL
          );
        },
        error: error => {
          console.log('Error de postTbLotesEvent', error);
        },
      });
    } else if (this.listObjects.length == 1) {
      console.log('Igual a 1');
      this.allEvent();
    }
  }

  executeValids(
    n_CONT: number,
    n_CONK: number,
    n_CONL: number,
    n_CONP: string,
    lote: string
  ) {
    console.log(
      'Método executeValids, n_CONT: ',
      n_CONT,
      'n_CONK: ',
      n_CONK,
      'n_CONTL:',
      n_CONL,
      'n_CONP:',
      n_CONP
    );

    if (n_CONL == 0) {
      this.alert('warning', 'No se seleccionó algún Lote', '');
    } else if (n_CONK >= 1) {
      this.alertInfo(
        'success',
        'Ejecución Correcta',
        `Lotes con dispersión definitiva: :${lote}`
      ).then(question => {
        if (question.isConfirmed) {
          this.deselectRows();
        }
      });
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
              this.deselectRows();
            },
            error: error => {
              console.log('Error respuesta de paGarantXLote', error);
              this.alert('warning', 'El Reproceso no se realizó', '');
              this.c_RESUL = 'ERROR';
              this.deselectRows();
            },
          });
        }
      });
    } else {
      this.alertQuestion(
        'question',
        `Se reprocesará(n) ${n_CONL} Lote(s) del Evento. `,
        '¿Continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          //const id_evento = this.idEventTMP;
          const id_evento = this.idEvent;

          for (let i = 1; i <= n_CONL; i++) {
            this.lotService.paGarantXLote(id_evento).subscribe({
              next: resp => {
                console.log('respuesta de paGarantXLote', resp);
                this.alert('success', `Lote: ${lote}, ${this.c_RESUL}`, '');
                this.c_RESUL = 'OK';
                this.deselectRows();
              },
              error: error => {
                console.log('Error respuesta de paGarantXLote', error);
                this.alert('warning', 'El Reproceso no se realizó', '');
                this.c_RESUL = 'ERROR';
                this.deselectRows();
              },
            });
          }

          this.alert('success', 'Ejecución realizada', '');
        }
      });
    }
  }

  deselectRows() {
    this.listObjects.splice(0, this.listObjects.length);
    this.table.grid.dataSet['willSelect'] = [];
    this.table.grid.dataSet.deselectAll();
  }

  allEvent() {
    this.c_RESUL = '';
    this.c_TIPO = '';
    this.t_LOTES = '';
    this.n_CONT = 0;
    this.n_CONL = 0;
    this.n_CONP = '';
    this.n_CONE = 0;
    this.n_CONK = 0;
    this.c_RELL = '';
    //const id_evento = this.idEvent;
    const id_evento = this.idEventTMP;

    this.alertQuestion(
      'question',
      `Se reprocesará todo el Evento ${this.idEventTMP}`,
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

  close() {
    this.modalRef.hide();
  }
}
