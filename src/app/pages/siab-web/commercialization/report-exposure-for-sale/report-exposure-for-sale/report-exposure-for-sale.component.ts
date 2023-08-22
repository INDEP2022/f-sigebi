import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UNEXPOSED_GOODS_COLUMNS } from './columns';

@Component({
  selector: 'app-report-exposure-for-sale',
  templateUrl: './report-exposure-for-sale.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }

      /* input[type = file]::file-selector-button:hover {
        background: #9D2449;
      } */
    `,
  ],
})
export class ReportExposureForSaleComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  show: boolean = false;
  valorDelInput: number;
  txtSearch: boolean = true;
  goodSearch: boolean = false;
  validTxt: boolean = true;

  typeGood = new DefaultSelect();
  subType = new DefaultSelect();
  delegation = new DefaultSelect();
  state = new DefaultSelect();

  idTypeGood: number = 0;
  totalAssets: number;

  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  constructor(
    private fb: FormBuilder,
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private regionalDelegationService: RegionalDelegationService,
    private statusGoodService: StatusGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...UNEXPOSED_GOODS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [],
      subtype: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      status: [null, [Validators.required]],
      totalAssets: [null],
    });

    this.form.get('totalAssets').disable();

    /*setTimeout(() => {
      this.getTypeGood(new ListParams());
    }, 1000);*/
  }

  private prepareForm2() {
    this.form2 = this.fb.group({
      filterGoods: [],
      filterText: [],
    });
    this.form2.get('filterGoods').setValue('0');
  }

  onInputChange() {
    const filtertxt = this.form2.get('filterGoods').value;
    if (filtertxt == 1) {
      this.txtSearch = true;
      this.goodSearch = false;
      if (this.form.valid) {
        this.form.reset();
      }
    } else if (filtertxt == 0) {
      this.txtSearch = false;
      this.goodSearch = true;
      this.form2.get('filterText').setValue('');
      this.validTxt = true;
    }
    //console.log(event.target);
  }

  getTypeGood(params: ListParams) {
    console.log(params.text);
    if (params.text) {
      params['filter.nameGoodType'] = `$ilike:${params.text}`;
    }
    this.goodTypesService.getAll(params).subscribe({
      next: resp => {
        this.typeGood = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.typeGood = new DefaultSelect();
      },
    });
  }

  changeTypeGood(event: any) {
    if (event) {
      console.log(event.id);
      this.idTypeGood = event.id;
      this.form.get('subtype').setValue(null);
      //this.form.get('subtype').enable();
      this.getSubTypeGood(new ListParams(), event.id);
    } else {
      this.form.get('subtype').setValue(null);
      //this.form.get('subtype').disable();
      setTimeout(() => {
        this.getTypeGood(new ListParams());
      }, 1000);
    }
  }

  getSubTypeGood(params: ListParams, idType?: number | string) {
    if (idType) {
      params['filter.idTypeGood'] = `$eq:${idType}`;
    }
    if (params.text) {
      params['filter.nameGoodType'] = `$ilike:${params.text}`;
    }
    this.goodSubTypesService.getAllDetails(params).subscribe({
      next: resp => {
        this.subType = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.loading = false;
        this.subType = new DefaultSelect();
      },
    });
  }

  changeSubTypeGood(event: any) {
    if (event) {
      console.log(event);
    } else {
      /*setTimeout(() => {
        this.getSubTypeGood(new ListParams(), this.idTypeGood);
      }, 1000);*/
    }
  }
  getDelegation(params: ListParams) {
    if (params.text) {
      params['filter.nameGoodType'] = `$ilike:${params.text}`;
    }
    this.regionalDelegationService.getAll(params).subscribe({
      next: resp => {
        this.delegation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.delegation = new DefaultSelect();
      },
    });
  }
  changeDelegation(event: any) {
    if (event) {
      console.log(event);
    } else {
      setTimeout(() => {
        this.getDelegation(new ListParams());
      }, 1000);
    }
  }
  getStatusGood(params: ListParams) {
    if (params.text) {
      params['filter.nameGoodType'] = `$ilike:${params.text}`;
    }
    this.statusGoodService.getAll(params).subscribe({
      next: resp => {
        this.state = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.state = new DefaultSelect();
      },
    });
  }
  changeStatusGood(event: any) {
    if (event) {
      console.log(event);
    } else {
      setTimeout(() => {
        this.getStatusGood(new ListParams());
      }, 1000);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
    }
    console.warn('Your order has been submitted');
  }

  chargeFile(event: any) {
    if (event) {
      console.log(event);
      this.validTxt = false;
    } else {
      this.validTxt = true;
    }
  }

  reportNoAttempt() {
    if (this.idTypeGood) {
      this.getReportNoAttempt(this.idTypeGood, '', '', '');
    }
  }

  getReportNoAttempt(
    typeGood: number | string,
    subType: number | string,
    delegation: number | string,
    status: number | string
  ) {
    //Endpoint en construccion
    if (this.totalAssets > 0) {
      //this.totalAssets = count
      this.form.get('totalAssets').setValue(this.totalAssets);
    } else {
      this.alert(
        'warning',
        'No se encontraron registros',
        `Con el criterio de búsqueda seleccionado`
      );
    }
  }

  reporTwoMonths() {
    if (this.idTypeGood) {
      this.getReporTwoMonths(this.idTypeGood, '', '', '');
    }
  }

  getReporTwoMonths(
    typeGood: number | string,
    subType: number | string,
    delegation: number | string,
    status: number | string
  ) {
    //Endpoint en construccion
    if (this.totalAssets > 0) {
      //this.totalAssets = count
      this.form.get('totalAssets').setValue(this.totalAssets);
    } else {
      this.alert(
        'warning',
        'No se encontraron registros',
        `Con el criterio de búsqueda seleccionado`
      );
    }
  }

  consult() {
    this.show = !this.show;
    const type = this.form.get('typeGood').value;
    const subtype = this.form.get('subtype').value;
    const delegation1 = this.form.get('delegation').value;
    const state1 = this.form.get('status').value;
    this.getConsultGood(type, subtype, delegation1, state1);
  }

  getConsultGood(
    typeGood: number | string,
    subType: number | string,
    delegation: number | string,
    status: number | string
  ) {
    //LLamar al endpoint
    //this.totalAssets = count
    if (this.totalAssets > 0) {
      this.form.get('totalAssets').setValue(this.totalAssets);
    } else {
      this.alert(
        'warning',
        'No se encontraron registros',
        `Con el criterio de búsqueda seleccionado`
      );
    }
  }

  data: any;
}
