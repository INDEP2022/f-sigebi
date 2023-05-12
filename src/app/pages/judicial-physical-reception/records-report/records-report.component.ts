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
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
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
  styles: [],
})
export class RecordsReportComponent extends BasePage implements OnInit {
  REPORT_TYPES = REPORT_TYPE;
  type: FormControl = new FormControl(REPORT_TYPE.Reception);
  form: FormGroup = this.fb.group({});
  itemsSelect = new DefaultSelect();
  initialProceeding = new DefaultSelect();
  finalProceeding = new DefaultSelect();
  delegacionRecibe: string = 'delegacionRecibe';
  subdelegationField: string = 'subdelegation';
  labelDelegation: string = 'Delegación Recibe';
  labelSubdelegation: string = 'Delegación Administra';
  activeOne: boolean = false;
  activeTwo: boolean = false;
  loadingText = 'Cargando ...';

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
    private sanitizer: DomSanitizer
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
  }

  prepareForm() {
    this.form = this.fb.group({
      delegacionRecibe: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
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
      this.form.get('noExpediente').value != null &&
      this.form.get('desde').value != null &&
      this.form.get('hasta').value != null &&
      this.form.get('fechaDesde').value != null &&
      this.form.get('fechaHasta').value != null
    ) {
      return true;
    } else {
      this.alert(
        'warning',
        'Debe registrar todos los datos',
        'Faltan llenar campos que son obligatorios para imprimir el acta'
      );
      return false;
    }
  }

  validateDecomiso() {
    if (
      this.form.get('delegacionRecibe').value != null &&
      this.form.get('subdelegation').value != null &&
      this.form.get('estatusActa').value != null &&
      this.form.get('desde').value != null &&
      this.form.get('hasta').value != null &&
      this.form.get('fechaDesde').value != null &&
      this.form.get('fechaHasta').value != null
    ) {
      return true;
    } else {
      this.alert(
        'warning',
        'Debe registrar todos los datos',
        'Faltan llenar campos que son obligatorios para imprimir el acta'
      );
      return false;
    }
  }

  onSubmit() {
    console.log(this.type.value);
    this.form.markAllAsTouched();
    if (this.type.value === 'RECEPTION' && this.validateReception()) {
      this.generateEntrega();
    } else if (this.type.value === 'CONFISCATION' && this.validateDecomiso()) {
      this.alert('success', 'Funciona', ':D');
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
      PN_ACTA_INICIAL: this.form.get('actaInicial').value,
      PN_ACTA_FINAL: this.form.get('actaFinal').value,
    };
    this.downloadReport('blank', params);
  }

  generateDecomiso() {
    const params = {
      PN_DELEG: this.form.get('delegacionRecibe').value,
      PN_SUBDEL: this.form.get('subdelegation').value.id,
      PN_EXPEDI_INICIAL: this.form.get('desde').value,
      PN_EXPEDI_FINAL: this.form.get('hasta').value,
      PC_ESTATUS_ACTA1: this.form.get('estatusActa').value,
      PF_F_RECEP_INI: format(this.form.get('fechaDesde').value, 'dd-MM-yyyy'),
      PF_F_RECEP_FIN: format(this.form.get('fechaHasta').value, 'dd-MM-yyyy'),
      PN_ACTA_INICIAL: this.form.get('actaInicial').value,
      PN_ACTA_FINAL: this.form.get('actaFinal').value,
    };
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

  /*  getPaperwork() {
    return this.procedureManagementService.getById(
      this.paperwork.processNumber
    );
  }

  downloadReport(user: string) {
    return this.getPaperwork().pipe(
      switchMap(paperwork => {
        const params = {
          PFOLIO: paperwork.folio,
          PTURNADOA: user,
        };
        return this.siabService.fetchReport('RREPREFACTAENTREC', params);
      }),
      tap(response => {
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
      })
    );
  } */

  getInitialProceedings(params: any) {
    this.serviceProcVal
      .getProceedingsByDelAndSub(
        this.form.get('delegacionRecibe').value,
        this.form.get('subdelegation').value.id,
        'proceedingkey',
        params.text.toUpperCase()
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.initialProceeding = new DefaultSelect(res.data, res.count);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  getFinalProceedings(params: ListParams) {
    this.serviceProcVal
      .getProceedingsByDelAndSub(
        this.form.get('delegacionRecibe').value,
        this.form.get('subdelegation').value.id,
        'proceedingkey',
        params.text.toUpperCase()
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.finalProceeding = new DefaultSelect(res.data, res.count);
        },
        (err: any) => {
          console.log(err);
        }
      );
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

  onTypeChange() {
    const controls = [this.initialRecord, this.finalRecord];
    const type = this.type.value;
    if (type === REPORT_TYPE.Confiscation) {
      controls.forEach(control => control.clearValidators());
    } else {
      controls.forEach(control => control.setValidators(Validators.required));
    }
    controls.forEach(control => {
      control.reset();
      control.updateValueAndValidity();
    });
  }
}
