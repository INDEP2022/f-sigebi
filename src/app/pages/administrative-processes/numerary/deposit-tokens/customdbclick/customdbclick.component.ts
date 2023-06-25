import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared';
import { ListGoodsComponent } from '../list-goods/list-goods.component';

@Component({
  selector: 'app-customdbclick',
  templateUrl: './customdbclick.component.html',
  styles: [
    `
      .hoverBg:hover {
        background-color: #11798a !important;
        font-weight: 600;
      }
    `,
  ],
})
export class CustomdbclickComponent extends BasePage implements OnInit {
  @Input() value: any;
  clickTimer: any;
  @Input() rowData: any;
  @Output() funcionEjecutada = new EventEmitter<void>();

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  onCellClick(event: any) {
    console.log('AQUI', event);
    console.log('rpw', this.rowData);
    if (!this.value) {
      this.onCellDoubleClick();
    } else {
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;
        this.onCellDoubleClick();
      } else {
        this.clickTimer = setTimeout(() => {
          this.clickTimer = null;
        }, 300);
      }
    }
  }

  onCellDoubleClick() {
    if (!this.value) {
      // Lógica a ejecutar en caso de doble clic en una celda vacía
      console.log('Celda vacía seleccionada');
      this.openForm(null);
    } else {
      // Lógica a ejecutar en caso de doble clic en una celda con valor
      this.alert(
        'warning',
        'No puede realizar una conciliacion debido a que ya tiene especificado un bien',
        ''
      );
      console.log('Celda seleccionada:', this.value);
    }
  }
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    const rowData = this.rowData;
    modalConfig.initialState = {
      data,
      rowData,
      callback: (next: boolean) => {
        console.log('AQUI', next);
        this.ejecutarFuncion();
      },
    };
    this.modalService.show(ListGoodsComponent, modalConfig);
  }

  // RECARGAR DATA DE LA TABLA DE MOVIMIENTOS //
  ejecutarFuncion() {
    console.log('AQUI2');
    this.funcionEjecutada.emit();
  }
}
