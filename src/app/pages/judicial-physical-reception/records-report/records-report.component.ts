import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodAndDetailProceeding } from 'src/app/core/models/ms-good/good';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

enum REPORT_TYPE {
  Confiscation = 'CONFISCATION',
  Reception = 'RECEPTION',
}

@Component({
  selector: 'app-records-report',
  templateUrl: './records-report.component.html',
  styleUrls: ['records-report.component.css'],
})
export class RecordsReportComponent extends BasePage implements OnInit {
  REPORT_TYPES = REPORT_TYPE;
  type: FormControl = new FormControl(REPORT_TYPE.Reception);
  form: FormGroup = this.fb.group({});
  itemsSelect = new DefaultSelect();
  estatusData = new DefaultSelect(['Abierta', 'Cerrada', 'Todos']);
  initialProceeding = new DefaultSelect();
  finalProceeding = new DefaultSelect();
  delegacionRecibe: string = 'delegacionRecibe';
  subdelegationField: string = 'subdelegation';
  labelDelegation: string = 'Delegación Recibe';
  labelSubdelegation: string = 'Delegación Administra';
  activeOne: boolean = false;
  activeTwo: boolean = false;
  initialProceedingBool: boolean = false;
  finalProceedingBool: boolean = false;
  loadingText = 'Cargando ...';
  keyProceedingInitial = '';
  keyProceedingFinal = '';
  title = 'Entrega Recepción';

  get initialRecord() {
    return this.form.get('actaInicial');
  }
  get finalRecord() {
    return this.form.get('actaFinal');
  }

  constructor(
    private fb: FormBuilder,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private r2: Renderer2,
    private siabService: SiabService,
    private procedureManagementService: ProcedureManagementService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private serviceGoodProcess: GoodProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.form.get('delegacionRecibe').valueChanges.subscribe(res => {
      const initial = document.getElementById('actaI');
      const final = document.getElementById('actaF');
      if (res != null) {
        this.activeOne = true;
        if (this.activeTwo) {
          this.r2.removeClass(initial, 'disabled');
          this.r2.removeClass(final, 'disabled');
        } else {
          this.r2.addClass(initial, 'disabled');
          this.r2.addClass(final, 'disabled');
        }
      } else {
        this.activeOne = false;
        this.r2.addClass(initial, 'disabled');
        this.r2.addClass(final, 'disabled');
      }

      this.activeProceedings();
    });

    this.form.get('actaInicial').valueChanges.subscribe(res => {
      console.log(res);
      this.keyProceedingInitial = res.proceedingskey;
    });

    this.form.get('actaFinal').valueChanges.subscribe(res => {
      this.keyProceedingFinal = res.proceedingskey;
    });

    this.form.get('subdelegation').valueChanges.subscribe(res => {
      const initial = document.getElementById('actaI');
      const final = document.getElementById('actaF');
      if (res != null) {
        this.activeTwo = true;
        if (this.activeOne) {
          this.r2.removeClass(initial, 'disabled');
          this.r2.removeClass(final, 'disabled');
        } else {
          this.r2.addClass(initial, 'disabled');
          this.r2.addClass(final, 'disabled');
        }
      } else {
        this.activeTwo = false;
        this.r2.addClass(initial, 'disabled');
        this.r2.addClass(final, 'disabled');
      }
    });

    if (this.type.value === 'RECEPTION') {
      this.title = 'Entrega Recepción';
      this.form.get('delegacionRecibe').setValidators([Validators.required]);
      this.form.get('subdelegation').setValidators([Validators.required]);
    } else {
      this.title = 'Decomiso';
      this.form.get('delegacionRecibe').clearValidators();
      this.form.get('subdelegation').clearValidators();
    }

    this.type.valueChanges.subscribe(res => {
      this.form.get('delegacionRecibe').reset();
      this.form.get('subdelegation').reset();
      this.form.get('estatusActa').reset();
      this.form.get('actaInicial').reset();
      this.form.get('actaFinal').reset();
      this.form.get('desde').reset();
      this.form.get('hasta').reset();
      this.form.get('fechaDesde').reset();
      this.form.get('fechaHasta').reset();
      this.keyProceedingFinal = '';
      this.keyProceedingInitial = '';
      this.initialProceedingBool = false;
      this.finalProceedingBool = false;
      this.finalProceeding = new DefaultSelect();
      this.initialProceeding = new DefaultSelect();
      if (res === 'RECEPTION') {
        this.title = 'Entrega Recepción';
        this.form.get('delegacionRecibe').setValidators([Validators.required]);
        this.form.get('subdelegation').setValidators([Validators.required]);
      } else {
        this.title = 'Decomiso';
        this.form.get('delegacionRecibe').clearValidators();
        this.form.get('delegacionRecibe').updateValueAndValidity();
        this.form.get('subdelegation').clearValidators();
        this.form.get('subdelegation').updateValueAndValidity();
      }
    });

    this.form.get('actaInicial').valueChanges.subscribe(res => {
      if (res === null) {
        this.keyProceedingInitial = '';
      }
    });

    this.form.get('actaFinal').valueChanges.subscribe(res => {
      if (res === null) {
        this.keyProceedingFinal = '';
      }
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      delegacionRecibe: [null, []],
      subdelegation: [null, []],
      estatusActa: [null, [Validators.required]],
      actaInicial: [null, [Validators.required]],
      actaFinal: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      desde: [null, [Validators.required]],
      hasta: [null, [Validators.required]],
      fechaDesde: [null, [Validators.required]],
      fechaHasta: [null, [Validators.required]],
    });
  }

  validateReception() {
    if (
      this.form.get('delegacionRecibe').value != null &&
      this.form.get('subdelegation').value != null &&
      this.form.get('estatusActa').value != null &&
      this.form.get('actaInicial').value != null &&
      this.form.get('actaFinal').value != null &&
      this.form.get('desde').value != null &&
      this.form.get('hasta').value != null &&
      this.form.get('fechaDesde').value != null &&
      this.form.get('fechaHasta').value != null
    ) {
      if (
        this.form.get('fechaDesde').value <= this.form.get('fechaHasta').value
      ) {
        if (
          this.form.get('desde').valid &&
          this.form.get('hasta').valid &&
          this.form.get('fechaDesde').valid &&
          this.form.get('fechaHasta').valid
        ) {
          return true;
        } else {
          this.alert(
            'warning',
            'Debe Registrar Datos Válidos',
            'Alguno de los Campos que Lleno no son Válidos'
          );
          return false;
        }
      } else {
        this.alert(
          'warning',
          'Debe Registrar Datos Válidos',
          'La Fecha Inicial no Puede ser Mayor a la Final'
        );
        return false;
      }
    } else {
      this.alert(
        'warning',
        'Debe Registrar Todos los Datos',
        'Faltan Llenar Campos que son Obligatorios para Imprimir el Acta'
      );
      return false;
    }
  }

  validateDecomiso() {
    if (
      this.form.get('estatusActa').value != null &&
      this.form.get('desde').value != null &&
      this.form.get('hasta').value != null &&
      this.form.get('fechaDesde').value != null &&
      this.form.get('fechaHasta').value != null
    ) {
      if (
        this.form.get('fechaDesde').value <= this.form.get('fechaHasta').value
      ) {
        if (
          this.form.get('desde').valid &&
          this.form.get('hasta').valid &&
          this.form.get('fechaDesde').valid &&
          this.form.get('fechaHasta').valid
        ) {
          return true;
        } else {
          this.alert(
            'warning',
            'Debe Registrar Datos Validos',
            'Alguno de los Campos que Lleno no son Válidos'
          );
          return false;
        }
      } else {
        this.alert(
          'warning',
          'Debe Registrar Datos Validos',
          'La Fecha Inicial no Puede ser Mayor a la Final'
        );
        return false;
      }
    } else {
      this.alert(
        'warning',
        'Debe Registrar Todos los Datos',
        'Faltan Llenar Campos que son Obligatorios para Imprimir el Acta'
      );
      return false;
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.type.value === 'RECEPTION' && this.validateReception()) {
      this.generateEntrega();
    } else if (this.type.value === 'CONFISCATION' && this.validateDecomiso()) {
      this.generateDecomiso();
    }
  }

  generateEntrega() {
    const params = {
      PN_DELEG: this.form.get('delegacionRecibe').value,
      PN_SUBDEL: this.form.get('subdelegation').value.id,
      PN_EXPEDI_INICIAL: this.form.get('desde').value,
      PN_EXPEDI_FINAL: this.form.get('hasta').value,
      PC_ESTATUS_ACTA1: this.form.get('estatusActa').value,
      PF_F_RECEP_INI: format(this.form.get('fechaDesde').value, 'dd-MM-yyyy'),
      PF_F_RECEP_FIN: format(this.form.get('fechaHasta').value, 'dd-MM-yyyy'),
      PN_ACTA_INICIAL: this.form.get('actaInicial').value.cve_acta,
      PN_ACTA_FINAL: this.form.get('actaFinal').value.cve_acta,
    };
    console.log(params);

    this.downloadReport('blank', params);
  }

  activeProceedings() {
    this.form.get('subdelegation').valueChanges.subscribe(res => {
      if (res != null) {
        this.initialProceedingBool = true;
        this.finalProceedingBool = true;
      }
    });
  }

  generateDecomiso() {
    const params = {
      PN_DELEG:
        this.form.get('delegacionRecibe').value != null
          ? this.form.get('delegacionRecibe').value
          : '',
      PN_SUBDEL:
        this.form.get('subdelegation').value != null
          ? this.form.get('subdelegation').value.id
          : '',
      PN_EXPEDI_INICIAL: this.form.get('desde').value,
      PN_EXPEDI_FINAL: this.form.get('hasta').value,
      PC_ESTATUS_ACTA1: this.form.get('estatusActa').value,
      PF_F_RECEP_INI: format(this.form.get('fechaDesde').value, 'dd-MM-yyyy'),
      PF_F_RECEP_FIN: format(this.form.get('fechaHasta').value, 'dd-MM-yyyy'),
    };
    console.log(params);
    this.downloadReport('blank', params);
  }

  downloadReport(reportName: string, params: any) {
    this.loading = true;
    this.loadingText = 'Generando reporte ...';
    return this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
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

  validateString(params: string) {
    return /[a-zA-Z]/.test(params);
  }

  validateSpecialCharacters(params: string) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(params);
  }

  getInitialProceedings(params: ListParams) {
    if (
      this.validateString(params.text) ||
      this.validateSpecialCharacters(params.text)
    ) {
      this.alert(
        'warning',
        'Datos Inválidos',
        'Este Campo Solo Acepta Campos Númericos y Está Introduciendo Alguno Diferente.'
      );
      this.form.get('actaInicial').reset();
    } else {
      const model: IGoodAndDetailProceeding = {
        pTiNumberDeleg: this.form.get('delegacionRecibe').value,
        pTiNumberSubdel: this.form.get('subdelegation').value,
      };

      this.serviceGoodProcess
        .getDetailProceedingGoodFilterNumber(model, params.text)
        .subscribe(
          res => {
            console.log(res.data);
            this.initialProceeding = new DefaultSelect(res.data);
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  getFinalProceedings(params: ListParams) {
    if (
      this.validateString(params.text) ||
      this.validateSpecialCharacters(params.text)
    ) {
      this.alert(
        'warning',
        'Datos Inválidos',
        'Este Campo Solo Acepta Campos Númericos y Está Introduciendo Alguno Diferente.'
      );
      this.form.get('actaFinal').reset();
    } else {
      const model: IGoodAndDetailProceeding = {
        pTiNumberDeleg: this.form.get('delegacionRecibe').value,
        pTiNumberSubdel: this.form.get('subdelegation').value,
      };
      console.log(model);
      this.serviceGoodProcess
        .getDetailProceedingGoodFilterNumber(model, params.text)
        .subscribe(
          res => {
            console.log(res.data);
            this.finalProceeding = new DefaultSelect(res.data);
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  print() {
    this.loading = true;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RREPREFACTAENTREC.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    //console.log(linkSource);
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();

    /* let params = { ...this.flyersForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    } */
    //let newWin = window.open(pdfurl, 'test.pdf');
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }
}
