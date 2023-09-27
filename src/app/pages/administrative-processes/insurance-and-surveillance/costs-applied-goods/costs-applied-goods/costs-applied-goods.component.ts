import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ERROR_EXPORT } from 'src/app/pages/documents-reception/goods-bulk-load/utils/goods-bulk-load.message';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-costs-applied-goods',
  templateUrl: './costs-applied-goods.component.html',
  styles: [],
})
export class CostsAppliedGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;

  public delegation = new DefaultSelect();
  public goodTypes = new DefaultSelect();
  public concepts = new DefaultSelect();
  public good = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private goodTypesService: GoodTypeService,
    private expenseService: GoodSpentService,
    private goodService: GoodService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      file: [null, Validators.required],
      toFile: [null, Validators.required],

      noBien: [null, Validators.required],
      alGood: [null, Validators.required],

      goodType: [null, Validators.required],
      costConcept: [null, Validators.required],
      to: [null, Validators.required],

      startDate: [null, Validators.required],
      finishDate: [null, Validators.required],
      typecost: ['null'],
    });
  }

  send() {
    const { typecost, delegation, file, noBien, goodType, costConcept } =
      this.form.value;
    if (typecost == 'I' || typecost == 'null') {
      if (delegation == null || file == null || noBien == null) {
        this.alert(
          'error',
          'Error',
          'Ingrese un número de Delegación, Expediente ó Bien'
        );
        return;
      } else if (delegation != null) {
        if (goodType == null || costConcept == null) {
          this.alert(
            'error',
            'Error',
            'Ingrese Tipo de bien o Concepto de Gasto'
          );
          return;
        } else {
          this.LanzaReporte();
        }
      } else {
        console.log('no entra en el segundo');
      }
    } else {
      console.log('no entra en el primero');
    }
  }

  LanzaReporte() {
    const {
      typecost,
      delegation,
      file,
      toFile,
      noBien,
      alGood,
      goodType,
      costConcept,
      to,
      startDate,
      finishDate,
    } = this.form.value;
    //---------------
    const start = startDate != null ? new Date(startDate) : null;
    const formattedfecstart = start != null ? this.formatDate(start) : null;
    //----------------------
    const Fin = finishDate != null ? new Date(finishDate) : null;
    const formattedfecFin = Fin != null ? this.formatDate(Fin) : null;
    let params = {
      pn_del: delegation,
      pn_expediente: file,
      pn_expediente2: toFile,
      pn_nobien: noBien,
      pn_tipobien: goodType,
      pn_nobien2: alGood,
      pn_gasini: formattedfecstart,
      pn_gasfin: formattedfecFin,
      pc_dir_ind: typecost,
      pc_concepto: costConcept,
      pc_concepto2: to,
    };
    this.siabService
      .fetchReport('RGERADBREPOCOSTOS', params)
      // .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegation = new DefaultSelect(data.data, data.count);
    });
  }

  getGoodType(params: ListParams) {
    this.goodTypesService.getAll(params).subscribe(data => {
      this.goodTypes = new DefaultSelect(data.data, data.count);
    });
  }

  getCostConcept(params: ListParams) {
    this.expenseService.getExpenseConcept(params).subscribe(data => {
      this.concepts = new DefaultSelect(data.data, data.count);
    });
  }

  getGood() {
    let id = this.form.get('noBien').value;
    // this.goodService.getGoodByNoGood(id).subscribe(data => {
    //   this.good = new DefaultSelect(data.data, data.count);
    // });
    if (id != null) {
      this.goodService.getGoodByNoGood(id).subscribe({
        next: response => {},
        error: err => {
          this.alert('error', 'Error', 'El No. bien inicial no existe');
          this.form.get('noBien').setErrors({ customErrorKey: true });
        },
      });
    }
  }

  getGoodTo() {
    let id = this.form.get('alGood').value;
    if (id != null) {
      this.goodService.getGoodByNoGood(id).subscribe({
        next: response => {},
        error: err => {
          this.alert('error', 'Error', 'El No. bien Final no existe');
          this.form.get('alGood').setErrors({ customErrorKey: true });
        },
      });
    }
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  genExcel() {
    this.alertQuestion(
      'question',
      '¿Descargar el formato de detalle gastos? ',
      '¿Está de acuerdo?'
    ).then(q => {
      if (q.isConfirmed) {
        let aux: any[] = [];
        const {
          typecost,
          delegation,
          file,
          toFile,
          noBien,
          alGood,
          goodType,
          costConcept,
          to,
          startDate,
          finishDate,
        } = this.form.value;
        //---------------
        const start = startDate != null ? new Date(startDate) : null;
        const formattedfecstart = start != null ? this.formatDate(start) : null;
        //----------------------
        const Fin = finishDate != null ? new Date(finishDate) : null;
        const formattedfecFin = Fin != null ? this.formatDate(Fin) : null;
        aux = [
          {
            CONCEPTO: '',
            'NO._BIEN': '',
            'VALOR AVALUO': '',
            MONEDA: '',
            'VALOR PARA COSTO': '',
            CANTIDAD: '',
            'FECHA GASTO': '',
            IMPORTE: '',
            'D/I': '',
            'NUM.GASTO': '',
            TIPOBIEN: '',
            CLASIF: '',
          },
        ];
        console.log('Data let Aux-> ', aux);
        this.exportXlsx('export', aux);
      } else {
        return;
      }
    });
  }

  exportXlsx(opcion: string, data: any[]) {
    console.log('exportXlsx Data-> ', data);
    if (data.length == 0) {
      this.onLoadToast('warning', 'Archivo', ERROR_EXPORT);
    } else {
      //this.excelService.export(data, {
      // filename: opcion,
      // });

      //this.getFilterProceedings();

      const workSheet = XLSX.utils.json_to_sheet(data, {
        skipHeader: false,
      });
      const workBook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
      let aux = 'DetalleGastos' + '.xlsx';
      XLSX.writeFile(workBook, aux);
    }
  }
}
