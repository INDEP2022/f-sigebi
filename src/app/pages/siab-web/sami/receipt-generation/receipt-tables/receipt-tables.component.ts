import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { INotSucess, ISucess } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePage } from 'src/app/core/shared';
// import { EReceiptType } from '../models/eReceiptType';
import { EReceiptType } from '../../receipt-generation-sami/models/eReceiptType';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';

@Component({
  selector: 'app-receipt-tables',
  templateUrl: './receipt-tables.component.html',
  styleUrls: ['./receipt-tables.component.css'],
})
export class ReceiptTablesComponent extends BasePage {
  @Input() folio: string;
  @Input() id_programacion: string;
  @Input() count = 0;
  @Input() update = 0;
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
      motiveCancel: [null, [Validators.required]],
      motiveReprograming: [null, [Validators.required]],
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

  get selectedGoods() {
    return this.receiptGenerationData.selectedGoods;
  }

  set selectedGoods(value) {
    this.receiptGenerationData.selectedGoods = value;
  }

  massiveClick() {
    let receiptType;
    let P_MOTIVOCAN;
    if (this.divcanmas) {
      this.alertQuestion(
        'question',
        'Se Cancelará la Programación',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          receiptType = EReceiptType.Cancelacion;
          P_MOTIVOCAN = this.form.get('motiveCancel').value;
          this.registerReceipt(receiptType, P_MOTIVOCAN);
        }
      });
    }
    if (this.divrepmas) {
      this.alertQuestion(
        'question',
        'Se hará una Reprogramación',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          receiptType = EReceiptType.Reprogramacion;
          P_MOTIVOCAN = this.form.get('motiveReprograming').value;
          this.registerReceipt(receiptType, P_MOTIVOCAN);
        }
      });
    }
  }
  isFirstTable() {
    if (this.typeReceiptSelected === 'RECIBO') return true;
    if (this.typeReceiptSelected === 'RESGUARDO') return true;
    if (this.typeReceiptSelected === 'ALMACEN') return true;
    return false;
  }

  private registerReceipt(receiptType: EReceiptType, P_MOTIVOCAN: number) {
    console.log(this.selectedGoods);

    forkJoin(
      this.selectedGoods.map(row => {
        return this.programmingGoodReceiptService
          .postGoodsProgramingReceipts({
            P_TIPO_OPERACION: receiptType,
            P_MOTIVOCAN,
            P_CANTIDAD_SAE: 0,
            P_DESTINO_SAE: 0,
            P_ESTADO_CONSERVACION_SAE: 0,
            P_ESTADO_FISICO_SAE: 0,
            P_UNIDAD_MEDIDA_SAE: 0,
            P_DESCRIPCION_BIEN_SAE: ' ',
            P_ID_BIEN: row.id_bien,
            P_ID_PROGRAMACION: row.id_programacion,
            P_USUARIO_CREACION: localStorage.getItem('username'),
          })
          .pipe(
            takeUntil(this.$unSubscribe),
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
        this.selectedGoods = [];
        // this.getData();
      },
      error: err => {
        let recibos = '';
        this.selectedGoods.forEach((selected, index) => {
          recibos +=
            selected.id_bien +
            (index < this.selectedGoods.length - 1 ? ',' : '');
        });
        this.alert(
          'error',
          'Registro de Recibos ' + receiptType,
          `No se Pudieron Registrar los Recibos con Bien ${recibos}`
        );
      },
    });
  }

  assignReception(receiptType: EReceiptType) {
    if (receiptType === EReceiptType.Reprogramacion) {
      this.divcanmas = false;
      this.divrepmas = true;
      this.form.get('motiveCancel').setValue(null);
      return;
    }
    if (receiptType === EReceiptType.Cancelacion) {
      this.divcanmas = true;
      this.divrepmas = false;
      this.form.get('motiveReprograming').setValue(null);
      return;
    }
    this.divcanmas = false;
    this.divrepmas = false;
    this.alertQuestion(
      'question',
      '¿Desea Registrar los Bienes con Tipo ' + receiptType + '?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        this.form.get('motiveCancel').setValue(null);
        this.form.get('motiveReprograming').setValue(null);
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
          selected + (index < this.selectedGoods.length - 1 ? ',' : '');
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
          `No se Pudieron Registrar los Recibos con No. Bien ${recibos}`
        );
      }
    }
  }

  private showMessageNotAddeds(notAddeds: string[]) {
    let goodsNotAddeds = '';
    if (notAddeds.length > 0) {
      notAddeds.forEach((selected, index) => {
        goodsNotAddeds +=
          selected + (index < this.selectedGoods.length - 1 ? ',' : '');
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
