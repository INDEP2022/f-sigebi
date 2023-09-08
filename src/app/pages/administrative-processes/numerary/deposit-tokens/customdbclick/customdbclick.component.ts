import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared';
import { ListGoodsComponent } from '../list-goods/list-goods.component';

@Component({
  selector: 'app-customdbclick',
  templateUrl: './customdbclick.component.html',
  styles: [
    `
      .hoverBg {
        background-color: #117a8b !important;
      }
      .hoverBg:hover {
        background-color: #269abc !important;
        font-weight: 700;
      }

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
export class CustomdbclickComponent extends BasePage implements OnInit {
  @Input() value: any;
  clickTimer: any;
  @Input() rowData: any;
  @Output() funcionEjecutada = new EventEmitter<void>();
  @Output() loadingConciliar = new EventEmitter<boolean>();
  loadingBtn: boolean = false;
  constructor(
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService
  ) {
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
      // this.openForm(null);
      this.seleccionarBien_();
    } else {
      // Lógica a ejecutar en caso de doble clic en una celda con valor
      this.alert(
        'warning',
        'No puede realizar una conciliación debido a que ya tiene especificado un Bien',
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

  ejecutarloadingConciliar() {
    this.loadingConciliar.emit(true);
  }

  async seleccionarBien_() {
    this.ejecutarloadingConciliar();
    this.loadingBtn = true;

    let V_BIEN_VALIDO: any;
    let vb_encontrado: any = false;
    if (
      this.rowData.currency != null &&
      this.rowData.deposit != null &&
      this.rowData.motionDate_ != null &&
      this.rowData.cveAccount != null
    ) {
      let obj = {
        diCurrency:
          this.rowData.currency == "'M'" ? 'M' : this.rowData.currency,
        tiBank: this.rowData.bank,
        fecMovement: this.rowData.motiondate,
        diAccount: this.rowData.cveAccount,
      };
      console.log('obj', obj);
      const can: any = await this.getGoodSelectClasif(obj);
      this.loadingBtn = false;
      console.log('this.loadingBtn', this.loadingBtn);
      console.log('can', can);

      for (let i = 0; i < can.length; i++) {
        if (can[i].val2 != null) {
          var canVal2 = can[i].val2;
          var number = parseFloat(canVal2.replace(',', ''));
          console.log('number', number);
          console.log('this.rowData.deposito', this.rowData.deposit);
          if (number == Number(this.rowData.deposit)) {
            console.log('SI');

            vb_encontrado = await this.getGoodMovimientosCuentas(can[i]);
            console.log('vb_encontrado', vb_encontrado);
            if (vb_encontrado) {
              V_BIEN_VALIDO = await this.getGoodMovimientosCuentas1(can[i]);
              if (V_BIEN_VALIDO == 0) {
                let obj: any = {
                  numberMotion: this.rowData.motionnumber,
                  numberAccount: this.rowData.accountnumber,
                  numberGood: can[i].no_bien,
                  numberProceedings: can[i].no_expediente,
                };
                const validUpdate = await this.updateAccountMovement(obj);
                if (validUpdate) {
                  return;
                }
              }
            }
          }
        }
      }
      if (!vb_encontrado) {
        this.alert(
          'warning',
          'No se encontró algún Bien que cumpla con el criterio de conciliación',
          ''
        );
      }
      this.ejecutarloadingConciliar();
    } else {
      this.ejecutarloadingConciliar();
      this.alert(
        'warning',
        'No se encontró algún Bien que cumpla con el criterio de conciliación',
        ''
      );
    }
  }

  async getGoodSelectClasif(data: any) {
    return new Promise((resolve, reject) => {
      this.accountMovementService.getBlkMov(data).subscribe({
        next: response => {
          // this.data1.load(response.data);
          // this.data1.refresh();
          // this.totalItems = response.data.length;
          // this.loading = false;
          console.log('response', response);
          resolve(response.data);
        },
        error: err => {
          // this.data1.load([]);
          // this.data1.refresh();
          // this.totalItems = 0;
          // this.loading = false;
          resolve(null);
          console.log(null);
        },
      });
    });
  }

  async getGoodMovimientosCuentas(data: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${data.no_bien}`;
    params['filter.numberProceedings'] = `$eq:${data.no_expediente}`;

    return new Promise((resolve, reject) => {
      this.accountMovementService.getAllFiltered(params).subscribe({
        next: response => {
          resolve(false);
        },
        error: err => {
          resolve(true);
        },
      });
    });
  }

  async getGoodMovimientosCuentas1(data: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${data.no_bien}`;
    return new Promise((resolve, reject) => {
      this.accountMovementService.getAllFiltered(params).subscribe({
        next: response => {
          resolve(1);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async updateAccountMovement(data: any) {
    return new Promise((resolve, reject) => {
      this.accountMovementService.update(data).subscribe({
        next: async (response: any) => {
          this.alert('success', `Movimiento Actualizado Correctamente`, '');

          // this.modalRef.content.callback(true);
          // this.close();
          this.ejecutarFuncion();
          // this.loading = false;
          resolve(true);
        },
        error: err => {
          this.alert('error', `Error al Actualizar el Movimiento`, '');
          // this.loading = false;
          resolve(false);
        },
      });
    });
  }
}
