import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-warehouse-type-report',
  templateUrl: './warehouse-type-report.component.html',
  styles: [],
})
export class WarehouseTypeReportComponent extends BasePage implements OnInit {
  formCostWare: FormGroup = new FormGroup({});
  formAsigWare: FormGroup = new FormGroup({});
  title: string = 'Reportes de Control de Almacenes';
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.formCostWare = this.fb.group({
      numeroAlmacen: [null, [Validators.required, Validators.maxLength(10)]],
      tipoAlmacen: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      fechaReporte: [null, [Validators.required]],
      numeroBien: [null],
      fecha1: [null],
      fecha2: [null],
    });

    this.formAsigWare = this.fb.group({
      numeroAlmacen: [null],
      idTipoAlmacen: [null],
      numeroBien: [null],
      seccion: [null],
      pocision: [null],
      fecha1: [null],
      fecha2: [null],
    });
  }

  onReport1() {
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params);
  }
  onReport2() {
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params);
  }
  onReport3() {
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params);
  }
  cleanForm1() {
    this.formCostWare.reset();
  }
  cleanForm2() {
    this.formAsigWare.reset();
  }
  /// 1) REP_COSTOS
  /// 2) REP_BIENES
  /// 2) REP_HISTORICO
  downloadReport(reportName: string, params: any) {
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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
      },
    });
  }
}
