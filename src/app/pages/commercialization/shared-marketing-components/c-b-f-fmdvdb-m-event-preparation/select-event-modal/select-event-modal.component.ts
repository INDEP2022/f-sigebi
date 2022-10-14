import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { LIST_EVENT_COLUMNS } from './list-event-columns';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-select-event-modal',
  templateUrl: './select-event-modal.component.html',
  styles: [],
})
export class SelectEventModalComponent extends BasePage implements OnInit {
  rowSelected: boolean = false;
  selectedRow: any = null;
  columns: any[] = [];
  totalItems: number = 0;
  title: string = 'Tipo Penalización';
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();
  table: HTMLElement;

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: LIST_EVENT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }

  data = [
    {
      id_evento: '1448',
      cve_proceso: 'CRTG/COMDD/017/2008',
      tipo: 'Evento comercial',
      lugar: 'TGZ',
      observaciones: 'SI ESTOY ENTRANDO  3 6 M T',
      fecha: '10-10-2019',
      usuario: 'JFELIX',
      no_delegacion: '9',
      id_estatusvta: 'PREP',
    },
    {
      id_evento: '1408',
      cve_proceso: 'MEXICO, D.F., A 18 DE JULIO DE 2008',
      tipo: 'Remesas',
      lugar: 'TGZ',
      observaciones: 'SI ESTOY ENTRANDO  3 3 I T',
      fecha: '10-10-2020',
      usuario: 'JFELIX',
      no_delegacion: '0',
      id_estatusvta: 'CONC',
    },
    {
      id_evento: '1417',
      cve_proceso: 'CRHMO/DES/ADUANA PTO PALOMAS/146/08',
      tipo: 'Preparación',
      lugar: 'PTO PALOMAS CHIHUAHUA',
      observaciones: 'SI ESTOY ENTRANDO  3 6 M T',
      fecha: '10-10-2021',
      usuario: 'JFELIX',
      no_delegacion: '2',
      id_estatusvta: 'PREP',
    },
    {
      id_evento: '1450',
      cve_proceso: 'CRTG/COMDD/018/2008',
      tipo: 'preparación',
      lugar: 'TGZ',
      observaciones: 'SI ESTOY ENTRANDO  3 6 M T',
      fecha: '10-10-2022',
      usuario: 'JFELIX',
      no_delegacion: '4',
      id_estatusvta: 'PREP',
    },
    {
      id_evento: '1624',
      cve_proceso: 'CRHMO/DAD/ADUANA CD JUAREZ/183/08',
      tipo: 'Remesas',
      lugar: 'CD JUAREZ CHIHUAHUA',
      observaciones: 'SI ESTOY ENTRANDO  3 6 M T',
      fecha: '10-10-2018',
      usuario: 'JFELIX',
      no_delegacion: '4',
      id_estatusvta: 'PREP',
    },
  ];
}
