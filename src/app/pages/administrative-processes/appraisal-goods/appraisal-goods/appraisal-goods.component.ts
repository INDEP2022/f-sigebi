import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-appraisal-goods',
  templateUrl: './appraisal-goods.component.html',
  styles: [],
})
export class AppraisalGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;

  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();
  public initialType = new DefaultSelect();
  public finalType = new DefaultSelect();
  public initialSubtype = new DefaultSelect();
  public finalSubtype = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private goodTypesService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [],
      subdelegation: [],
      initialType: [],
      finalType: [],
      initialSubtype: [],
      finalSubtype: [],

      daysToFinish: [],
    });
  }

  send() {
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONADBBIENESSAVA.pdf?PARAMFORM=NO&PN_DELEG=` +
    //   this.form.controls['delegation'].value +
    //   `&PN_SUBDEL=` +
    //   this.form.controls['subdelegation'].value +
    //   `&PN_TIPOINI=` +
    //   this.form.controls['initialType'].value +
    //   `&PN_TIPOFIN=` +
    //   this.form.controls['finalType'].value +
    //   `&PN_STIPOINI=` +
    //   this.form.controls['initialSubtype'].value +
    //   `&PN_STIPOFIN=` +
    //   this.form.controls['finalSubtype'].value +
    //   `&PN_DIAS=` +
    //   this.form.controls['daysToFinish'].value;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }

  getSubdelegations(params: ListParams) {
    this.subdelegationService.getAll(params).subscribe(data => {
      this.subdelegations = new DefaultSelect(data.data, data.count);
    });
  }

  getInitialType(params: ListParams) {
    this.goodTypesService.getAll(params).subscribe(data => {
      this.initialType = new DefaultSelect(data.data, data.count);
    });
  }

  getFinaltype(params: ListParams) {
    this.goodSubtypeService.getAll(params).subscribe(data => {
      this.finalType = new DefaultSelect(data.data, data.count);
    });
  }

  getInitialSubtype(params: ListParams) {
    this.goodSsubtypeService.getAll(params).subscribe(data => {
      this.initialSubtype = new DefaultSelect(data.data, data.count);
    });
  }

  getFinalSubtype(params: ListParams) {
    this.goodSssubtypeService.getAll(params).subscribe(data => {
      this.finalSubtype = new DefaultSelect(data.data, data.count);
    });
  }
}
