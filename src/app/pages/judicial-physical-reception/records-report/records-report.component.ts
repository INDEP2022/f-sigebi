import { Component, OnInit, Renderer2 } from '@angular/core';
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
  finalProceeding = new DefaultSelect();
  delegacionRecibe: string = 'delegacionRecibe';
  subdelegationField: string = 'subdelegation';
  labelDelegation: string = 'Delegación Recibe';
  labelSubdelegation: string = 'Delegación Administra';
  activeOne: boolean = false;
  activeTwo: boolean = false;

  get initialRecord() {
    return this.form.get('actaInicial');
  }
  get finalRecord() {
    return this.form.get('actaFinal');
  }

  constructor(
    private fb: FormBuilder,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private r2: Renderer2
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

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.REPORT_TYPES.Reception) {
      const value = this.form.get('delegacionRecibe').value;
      console.log({
        delegacionRecibe: value,
        delegacionEmite: this.form.get('subdelegation').value,
      });
    }
  }

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
