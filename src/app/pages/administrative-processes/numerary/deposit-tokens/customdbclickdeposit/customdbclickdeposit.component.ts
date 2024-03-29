import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-customdbclickdeposit',
  templateUrl: './customdbclickdeposit.component.html',
  styles: [
    `
      .hoverBg:hover {
        background-color: #11798a !important;
        font-weight: 600;
      }
    `,
  ],
})
export class CustomdbclickdepositComponent extends BasePage implements OnInit {
  @Input() value: any;
  clickTimer: any;
  @Input() rowData: any;
  @Output() funcionEjecutada = new EventEmitter<void>();

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
    if (!this.rowData.no_bien) {
      this.seleccionarBien_();
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

  // RECARGAR DATA DE LA TABLA DE MOVIMIENTOS //
  ejecutarFuncion() {
    console.log('AQUI2');
    this.funcionEjecutada.emit();
  }

  async seleccionarBien_() {
    let V_BIEN_VALIDO: any;
    let vb_encontrado: any = false;
    if (
      this.rowData.currency != null &&
      this.rowData.deposito != null &&
      this.rowData.fec_movimiento != null &&
      this.rowData.cveAccount != null &&
      this.rowData.deposito
    ) {
      let obj = {
        diCurrency: this.rowData.currency,
        tiBank: this.rowData.bank,
        fecMovement: this.rowData.fec_movimiento,
        diAccount: this.rowData.cveAccount,
      };
      console.log('obj', obj);
      const can: any = await this.getGoodSelectClasif(obj);
      console.log('can', can);

      for (let i = 0; i < can.length; i++) {
        if (can[i].val2 != null) {
          var canVal2 = can[i].val2;
          var number = parseFloat(canVal2.replace(',', ''));
          console.log('number', number);
          console.log('this.rowData.deposito', this.rowData.deposito);
          if (number == Number(this.rowData.deposito)) {
            console.log('SI');

            vb_encontrado = await this.getGoodMovimientosCuentas(can[i]);
            console.log('vb_encontrado', vb_encontrado);
            if (vb_encontrado) {
              V_BIEN_VALIDO = await this.getGoodMovimientosCuentas1(can[i]);
              if (V_BIEN_VALIDO == 0) {
                let obj: any = {
                  numberMotion: this.rowData.no_movimiento,
                  numberAccount: this.rowData.no_cuenta,
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
          'No se encontró ningún bien que cumpliera con el criterio de conciliación',
          ''
        );
      }
    } else {
      this.alert(
        'warning',
        'No tiene capturados todos los criterios para realizar la conciliación',
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
          this.loading = false;
          console.log('response', response);
          resolve(response.data);
        },
        error: err => {
          // this.data1.load([]);
          // this.data1.refresh();
          // this.totalItems = 0;
          this.loading = false;
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
          this.alert('success', `Datos actualizados correctamente`, '');

          // this.modalRef.content.callback(true);
          // this.close();
          this.ejecutarFuncion();
          this.loading = false;
          resolve(true);
        },
        error: err => {
          this.alert('error', `Error al actualizar los datos`, '');
          this.loading = false;
          resolve(false);
        },
      });
    });
  }
}
