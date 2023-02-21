import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
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
  delegacionRecibe: string = 'delegacionRecibe';
  subdelegationField: string = 'subdelegation';
  labelDelegation: string = 'Delegación Recibe';
  labelSubdelegation: string = 'Delegación Administra';

  get initialRecord() {
    return this.form.get('actaInicial');
  }
  get finalRecord() {
    return this.form.get('actaFinal');
  }

  constructor(
    private fb: FormBuilder,
    private serviceProcVal: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
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

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.REPORT_TYPES.Reception) {
      const value = this.form.get('delegacionRecibe').value;
      console.log({
        delegacionRecibe: value,
        delegacionEmite: this.form.get('delegacionAdministra').value,
      });
    }
  }

  getProceedings(params: ListParams) {
    console.log(params);
    this.serviceProcVal.getAll(params).subscribe(
      res => {
        console.log(res);
        this.initialProceeding = new DefaultSelect(res.data, res.count);
      },
      err => {
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
