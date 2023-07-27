import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, forkJoin, map, of } from 'rxjs';
import { INotSucess, ISucess } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePage } from 'src/app/core/shared';
import { EReceiptType } from '../models/eReceiptType';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';

@Component({
  selector: 'app-receipt-tables',
  templateUrl: './receipt-tables.component.html',
  styleUrls: ['./receipt-tables.component.css'],
})
export class ReceiptTablesComponent extends BasePage {
  @Input() folio: string;
  @Input() count = 0;
  estatus_bien_programacion: string;
  receiptType = EReceiptType;
  divcanmas = false;
  divrepmas = false;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private receiptGenerationData: ReceiptGenerationDataService
  ) {
    super();
    this.form = this.fb.group({
      motiveCancel: [null],
      motiveReprograming: [null],
    });
  }

  get pathCatalogsCancelacion() {
    return 'catalog/api/v1/generics?filter.name=Cancelacion';
  }

  get pathCatalogsReprogramacion() {
    return 'catalog/api/v1/generics?filter.name=Reprogramacion';
  }

  get disabledMassiveButton() {
    if (this.divcanmas) {
      if (this.form.get('motiveCancel').value) {
        return false;
      }
    }
    if (this.divrepmas) {
      if (this.form.get('motiveReprograming').value) {
        return false;
      }
    }
    return true;
  }

  get recibos() {
    return this.receiptGenerationData.recibos;
  }

  get resguardo() {
    return this.receiptGenerationData.resguardo;
  }

  get almacen() {
    return this.receiptGenerationData.almacen;
  }

  get programacion() {
    return this.receiptGenerationData.programacion;
  }

  get cancelacion() {
    return this.receiptGenerationData.cancelacion;
  }

  get typeReceiptSelected() {
    return this.receiptGenerationData.typeReceiptSelected;
  }

  get selectedGooods() {
    return this.receiptGenerationData.selectedGooods;
  }

  massiveClick() {
    let receiptType;
    let P_MOTIVOCAN;
    if (this.divcanmas) {
      receiptType = EReceiptType.Cancelacion;
      P_MOTIVOCAN = this.form.get('motiveCancel').value;
    }
    if (this.divrepmas) {
      receiptType = EReceiptType.Reprogramacion;
      P_MOTIVOCAN = this.form.get('motiveReprograming').value;
    }
    this.registerReceipt(receiptType, 0);
  }
  isFirstTable() {
    if (this.typeReceiptSelected === 'RECIBO') return true;
    if (this.typeReceiptSelected === 'RESGUARDO') return true;
    if (this.typeReceiptSelected === 'ALMACEN') return true;
    return false;
  }

  private registerReceipt(receiptType: EReceiptType, P_MOTIVOCAN: number) {
    forkJoin(
      this.selectedGooods.map(row => {
        return this.programmingGoodReceiptService
          .postGoodsProgramingReceipts({
            P_TIPO_OPERACION: receiptType,
            P_MOTIVOCAN,
            P_CANTIDAD_SAE: 0,
            P_DESTINO_SAE: 0,
            P_ESTADO_CONSERVACION_SAE: 0,
            P_ESTADO_FISICO_SAE: 0,
            P_UNIDAD_MEDIDA_SAE: 0,
            P_DESCRIPCION_BIEN_SAE: '',
            P_ID_BIEN: row.id_bien,
            P_ID_PROGRAMACION: row.id_programacion,
          })
          .pipe(
            map(item => {
              return { sucess: row.id_bien } as ISucess;
            }),
            catchError(err => {
              return of({ error: row.id_bien } as INotSucess);
            })
          );
      })
    ).subscribe({
      next: response => {
        const addeds: string[] = [];
        const notAddeds: string[] = [];
        response.forEach(item => {
          const { sucess } = item as ISucess;
          const { error } = item as INotSucess;
          if (sucess) {
            addeds.push(sucess);
          }
          if (error) {
            notAddeds.push(error);
          }
        });
        this.showMessage(addeds, notAddeds, receiptType);
        this.receiptGenerationData.refreshAll.next(true);
        // this.getData();
      },
      error: err => {
        let recibos = '';
        this.selectedGooods.forEach((selected, index) => {
          recibos +=
            selected.id_bien +
            (index < this.selectedGooods.length - 1 ? ',' : '');
        });
        this.alert(
          'error',
          'Registro de Recibos ' + receiptType,
          `No se pudieron registrar los recibos con bien° ${recibos}`
        );
      },
    });
  }

  assignReception(receiptType: EReceiptType) {
    this.alertQuestion(
      'question',
      '¿Desea registrar los bienes con tipo ' + receiptType,
      ''
    ).then(question => {
      if (question.isConfirmed) {
        if (receiptType === EReceiptType.Reprogramacion) {
          this.divcanmas = false;
          this.divrepmas = true;
          return;
        }
        if (receiptType === EReceiptType.Cancelacion) {
          this.divcanmas = true;
          this.divrepmas = false;
          return;
        }
        this.registerReceipt(receiptType, 0);
      }
    });

    // selectedGoods.forEach(async row => {
    //   this.programmingGoodReceiptService.postGoodsProgramingReceipts(row).pipe();
    // })
  }

  private showMessage(
    addeds: string[],
    notAddeds: string[],
    receiptType: EReceiptType
  ) {
    let recibos = '';
    if (addeds.length > 0) {
      addeds.forEach((selected, index) => {
        recibos +=
          recibos + (index < this.selectedGooods.length - 1 ? ',' : '');
      });
      this.alert(
        'success',
        'Registro de Recibos ' + receiptType,
        `Se registraron No. ${recibos} ` + this.showMessageNotAddeds(notAddeds)
      );
    } else {
      if (notAddeds.length > 0) {
        this.alert(
          'error',
          'Registro de Recibos',
          `No se pudieron registrar los recibos con No. Bien ${recibos}`
        );
      }
    }
  }

  private showMessageNotAddeds(notAddeds: string[]) {
    let goodsNotAddeds = '';
    if (notAddeds.length > 0) {
      notAddeds.forEach((selected, index) => {
        goodsNotAddeds +=
          selected + (index < this.selectedGooods.length - 1 ? ',' : '');
      });
      return `pero no se pudieron eliminar las recibos con No. Bien ${goodsNotAddeds}`;
    } else {
      return '';
    }
  }

  showTableByTiporecibo(type: EReceiptType) {
    this.receiptGenerationData.typeReceiptSelected = type;
    if (this.isFirstTable()) {
      this.receiptGenerationData.refreshTableProgrammings.next(true);
    } else {
      if (type === EReceiptType.Cancelacion) {
        this.estatus_bien_programacion = 'CANCELADO';
      } else {
        this.estatus_bien_programacion = 'EN_PROGRAMACION';
      }
    }
  }
}
