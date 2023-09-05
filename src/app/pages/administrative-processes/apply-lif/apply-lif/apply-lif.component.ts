import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { HasMoreResultsComponent } from 'src/app/@standalone/has-more-results/has-more-results.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryNumeraryService } from 'src/app/core/services/ms-historynumerary/historynumerary.service';
import { MassiveNumeraryService } from 'src/app/core/services/ms-massivenumerary/massivenumerary.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ApplyLifRequest } from './apply-lif-requests';

@Component({
  selector: 'app-apply-lif',
  templateUrl: './apply-lif.component.html',
  styles: [
    `
      .loader-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        background: #ffffff75;
        z-index: 100;
      }
    `,
  ],
})
export class ApplyLifComponent extends ApplyLifRequest implements OnInit {
  public form: FormGroup;
  public disabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    protected goodService: GoodService,
    protected massiveNumeraryService: MassiveNumeraryService,
    protected historyNumeraryService: HistoryNumeraryService,
    protected parameterModService: ParameterModService,
    protected modal: BsModalService
  ) {
    super();
  }

  isVisibleMotive = true;
  isContConvVisible = false;
  isVisibleVal15 = true;
  isEnableBtnLif = false;
  isEnableBtnRvlif = false;
  formGood = new FormGroup({
    id: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
    fileNumber: new FormControl(''),
    identifier: new FormControl(''),
    extDomProcess: new FormControl(''),
  });

  formGood1 = new FormGroup({
    goodReferenceNumber: new FormControl(''),
    id: new FormControl(''),
    goodId: new FormControl(''),
    val2: new FormControl(null),
    val10: new FormControl(null),
    val13: new FormControl(null),
    val15: new FormControl(null),
    contConv: new FormControl(),
    status: new FormControl(''),
  });

  formBlkControl = new FormGroup({
    dateChange: new FormControl(null),
    motive: new FormControl(''),
    tTotal: new FormControl(null),
  });

  ngOnInit(): void {
    this.handleForm();
    console.log(this.formGood.value.id);
    console.log(this.formGood1.value.id);
  }

  public handleForm(): void {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      description: [
        '',
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      status: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      noRecord: [null, Validators.required],
      identifier: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      processExtDom: [
        '',
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      noConversions: [null, Validators.required],
      noBienNum: [null, Validators.required],
      statusBien: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      date: ['', [Validators.required]],
      price: [null, Validators.required],
      spend: [null, [Validators.required]],
      totalIva: [null],
      total: [null],
    });
  }

  getGood() {
    if (!this.formGood.value.id) return;
    this.loading = true;
    const listParams = new ListParams();
    listParams['filter.id'] = this.formGood.value.id;
    this.clean();
    this.goodService
      .getAll(listParams)
      .pipe(map(x => x.data[0]))
      .subscribe({
        next: good => {
          this.formGood.patchValue(good as any);
          this.formGood1.get('goodReferenceNumber').setValue(good.id as any);
          this.getGood1(good.id);
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  getGood1(goodId: number) {
    this.getGoodByReference(goodId).subscribe({
      next: async good => {
        // this.formGood1.patchValue(good as any);
        // await this.postQueryGood1();
        this.changeGood1(good);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openSelectorGood() {
    const option: Partial<HasMoreResultsComponent> = {
      title: 'Seleccionar bien',
      ms: 'good',
      columns: {
        id: { title: 'No. Bien' },
        description: { title: 'Descripción' },
        status: { title: 'Estatus' },
        fileNumber: { title: 'No. Expediente' },
      },
      path: 'good',
      queryParams: { 'filter.goodReferenceNumber': this.formGood.value.id },
    };
    this.modal
      .show(HasMoreResultsComponent, {
        class: 'modal-xl',
        initialState: option,
      })
      .content.onClose.subscribe({
        next: (good: any) => {
          console.log(good);
          this.changeGood1(good);
        },
      });
  }

  async changeGood1(good: IGood) {
    this.loading = true;
    this.formGood1.patchValue(good as any);
    await this.postQueryGood1();
    this.loading = false;
  }

  async postQueryGood1() {
    let TOT: number;
    const good1 = this.formGood1.getRawValue();
    try {
      TOT = await this.getCountGoodByReference(this.formGood.value.id);
      try {
        const { dateChange } = await this.getChangeNumeraryByGood(
          this.formGood.value.id,
          good1.id
        );
        this.formBlkControl.get('dateChange').setValue(new Date(dateChange));
      } catch (error) {
        this.loading = false;
        try {
          const params = new ListParams();
          params['filter.originalGood'] = this.formGood.value.id;
          params['filter.goodNumeraryNumber'] = good1.id;
          const { dateChange } = await this.getHistoricalNumeraryByGood(params);
          this.formBlkControl.get('dateChange').setValue(new Date(dateChange));
        } catch (error) {
          this.formBlkControl.get('dateChange').setValue(null);
          this.loading = false;
        }
      }

      try {
        const params = new ListParams();
        params['filter.originalGood'] = this.formGood.value.id;
        params['filter.goodNumeraryNumber'] = good1.id;
        const { reason } = await this.getHistoricalNumeraryByGood(params);
        this.formBlkControl.get('motive').setValue(reason);
        this.isVisibleMotive = true;
      } catch (error) {
        this.isVisibleMotive = false;
        this.loading = false;
      }

      this.formGood1.get('contConv').setValue(TOT);
      const tTotal = good1.val2 - good1.val13 - (good1.val10 || 0);
      this.formBlkControl.get('tTotal').setValue(tTotal);
      if (TOT == 0) {
        this.isContConvVisible = false;
      } else {
        this.isContConvVisible = true;
      }

      const val15 = good1.val15 || 0;
      if (val15 == 0) {
        this.isVisibleVal15 = false;
        this.formGood1.get('val15').disable();
        this.isEnableBtnLif = true;
        this.isEnableBtnRvlif = false;
      } else {
        this.isVisibleVal15 = true;
        this.formGood1.get('val15').enable();
        this.isEnableBtnLif = false;
        this.isEnableBtnRvlif = true;
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  public send() {
    console.log(this.form.value);
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/s.pdf?NO_BIEN=` + this.form.controls['noBien'].value +
    //   `&DESCRIPCION=` + this.form.controls['description'].value +
    //   `&ESTATUS=` + this.form.controls['status'].value +
    //   `&NO_EXPEDIENTE=` + this.form.controls['noRecord'].value +
    //   `&IDENTIFICADOR=` + this.form.controls['identifier'].value +
    //   `&PROCESO_EXT_DOM=` + this.form.controls['processExtDom'].value +
    //   `&CONT_CONV=` + this.form.controls['noConversions'].value +
    //   `&NO_BIEN=` + this.form.controls['noBienNum'].value +
    //   `&ESTATUS=` + this.form.controls['statusBien'].value +
    //   `&FEC_CAMBIO=` +
    //   this.datePipe.transform(
    //     this.form.controls['date'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&VAL2=` + this.form.controls['price'].value;
    // `&VAL13=` + this.form.controls['spend'].value;
    // `&VAL10=` + this.form.controls['totalIva'].value;
    // `&T_TOTAL=` + this.form.controls['total'].value;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.alert('success', 'Reporte Generado', '');
    this.loading = false;
  }

  clean() {
    this.formBlkControl.reset();
    this.formGood.reset();
    this.formGood1.reset();
    this.isEnableBtnLif = false;
    this.isEnableBtnRvlif = false;
  }

  async onClickApplyLif() {
    let VLIF: number;
    let VEST: string;
    let GAST: number;
    try {
      GAST = this.formGood1.value.val13;
      let params = new ListParams();
      params['filter.id'] = this.formGood1.value.id;
      const { status } = await this.getGoodParams(params, true);
      VEST = status;

      if (VEST != 'ADM') {
        this.alert(
          'warning',
          'El bien numerario no se encuentra en un estatus valido para esta operación',
          ''
        );
      } else {
        params = new ListParams();
        params['filter.parameter'] = 'LIF';
        const { value } = await this.getComerParameterMod(params);
        VLIF = Number(value);
        this.formGood1
          .get('val15')
          .setValue(
            (
              (this.formGood1.value.val2 - this.formGood1.value.val10) *
              VLIF
            ).toFixed(2)
          );
        GAST = GAST + this.formGood1.value.val15;
        this.formBlkControl
          .get('tTotal')
          .setValue(this.formGood1.value.val2 - (GAST || 0));
        this.commit();
      }
    } catch (error) {
      this.alert('error', 'El bien numerario no se encuentra', '');
      console.log(error);
    }
  }

  async onClickApplyRvlif() {
    // DECLARE
    let VLIF: number;
    const good1 = this.formGood1.getRawValue();
    let VEST: string;
    try {
      let params = new ListParams();
      params['filter.id'] = good1.id;
      const { status } = await this.getGoodParams(params, true);
      VEST = status;
      if (VEST != 'ADM') {
        this.alert(
          'warning',
          'El bien numerario no se encuentra en un estatus valido para esta operación',
          ''
        );
        return;
      } else {
        params = new ListParams();
        params['filter.parameter'] = 'LIF';
        const { value } = await this.getComerParameterMod(params);
        VLIF = Number(value);
        this.formGood1.get('val13').setValue(good1.val13 - good1.val15);
        this.formGood1.get('val15').setValue(0);
        this.formBlkControl
          .get('tTotal')
          .setValue(good1.val2 - good1.val13 - (good1.val10 || 0));
        // LIP_COMMIT_SILENCIOSO;
        this.commit();
      }
      // GO_BLOCK('BIENES1');
      // EXECUTE_QUERY;
    } catch (error) {
      this.loading = false;
    }
  }

  commit() {
    const auxBody = { ...this.formGood1.getRawValue() };
    delete auxBody.contConv;
    auxBody.val15 = String(auxBody?.val15) || null;

    this.goodService.update(auxBody).subscribe({
      next: () => {
        this.alert('success', 'Bien Actualizado', '');
        this.postQueryGood1();
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
