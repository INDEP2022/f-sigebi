import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { LabelGoodService } from 'src/app/core/services/catalogs/label-good.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-maintenance-commitment-donation-modal',
  templateUrl: './maintenance-commitment-donation-modal.component.html',
  styles: [],
})
export class MaintenanceCommitmentDonationModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  title: string = '';
  newOrEdit: boolean = false;
  data: any;
  type: any;
  textBtn: string = 'Guardar';
  dataValid: string[] = [];
  totalOtKey: number = 0;
  users = new DefaultSelect();
  case: boolean = false;
  arr: number[] = [];

  labels = new DefaultSelect();
  clasifs = new DefaultSelect();
  status = new DefaultSelect();
  units = new DefaultSelect();
  transfers = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private goodsQueryService: GoodsQueryService,
    private authService: AuthService,
    private donationService: DonationService,
    private tvalTable1Service: TvalTable1Service,
    private dynamicCatalogsService: DynamicCatalogsService,
    private labelGoodService: LabelGoodService,
    private goodService: GoodService,
    private transferenteService: TransferenteService,
    private strategyServiceService: StrategyServiceService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('flag ', this.newOrEdit);
    //console.log('NewOrEdir: ', this.newOrEdit);
    if (this.newOrEdit || !this.newOrEdit) {
      console.log('type -> ', this.type);
      switch (this.type) {
        case 1:
          this.title = 'Comercio Exterior Kg';
          this.prepareForm();
          break;
        case 2:
          this.title = 'Delitos Federales';
          this.prepareForm();
          break;
        case 3:
          this.title = 'Otros Transferentes';
          this.prepareFormOthersT();
          break;
        case 4:
          this.title = 'Permisos de Usuarios para Rastreador';
          this.prepareFormPermissionR();
          this.getMax();
          this.case = true;
          break;
        default:
          this.title = '';
          break;
      }
      console.log('data -> ', this.data);
      if (this.data != null) {
        this.textBtn = 'Guardar';

        console.log('data a mapear en el editar-> ', this.data.labelId);
        if (this.type == 4) {
          console.log('tipo 4 > ', this.data);
          this.form.patchValue({
            value: this.data.otvalor,
            name: this.data.name,
            otkey: this.data.otKey,
            valid: this.data.abbreviation,
          });
        } else {
          this.form.patchValue({
            labelId: this.data.label.id,
            status: this.data.status,
            desStatus: this.data.desStatus,
            transferentId: this.data.transfereeId,
            keyCode: this.data.desTrans,
            clasifId: this.data.clasifId,
            desClasif: this.data.desClasif,
            unit: this.data.unit,
            ruleId: this.data.ruleId,
            valid: this.data.valid,
            amount: this.data.amount,
          });
        }
      }
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.form.invalid) return;
    if (this.newOrEdit) {
      switch (this.type) {
        case 1:
          this.update(this.form.value);
          break;
        case 2:
          this.update(this.form.value);
          break;
        case 3:
          this.updateOtros(this.form.value);
          break;
        case 4:
          this.updatePermisoRas(this.form.value);
          break;
        default:
          break;
      }
    } else {
      switch (this.type) {
        case 1:
          this.insertAprueba_donacion();
          break;
        case 2:
          this.insertDelitosFede();
          break;
        case 3:
          this.insertOtrosTrasn();
          break;
        case 4:
          this.createTableUser();
          break;
        default:
          break;
      }
    }
  }
  insertAprueba_donacion() {
    this.newOrEdit = false;
    const model = {} as any;
    model.labelId = Number(this.form.value.labelId);
    model.status = this.form.value.status ? this.form.value.status : 'N/A';
    model.desStatus = this.form.value.desStatus
      ? this.form.value.desStatus
      : 'NO APLICA';
    model.transfereeId = this.form.value.transferentId
      ? Number(this.form.value.transferentId)
      : 0;
    model.desTrans = this.form.value.keyCode
      ? this.form.value.keyCode
      : 'NO APLICA';
    model.clasifId = this.form.value.clasifId
      ? Number(this.form.value.clasifId)
      : 0;
    model.desClasif = this.form.value.desClasif
      ? this.form.value.desClasif
      : 'NO APLICA';
    model.unit = this.form.value.unit ? this.form.value.unit : 'N/A';
    model.ruleId = Number(this.form.value.ruleId);
    model.valid = Number(this.form.value.valid);

    //SERVICIO 1
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.alert('success', 'Registro creado correctamente', '');
      },
      error: error => {
        this.alert('error', error.error.message, '');
      },
    });
  }
  insertDelitosFede() {
    this.newOrEdit = false;
    const model = {} as any;
    model.labelId = Number(this.form.value.labelId);
    model.status = this.form.value.status ? this.form.value.status : 'N/A';
    model.desStatus = this.form.value.desStatus
      ? this.form.value.desStatus
      : 'NO APLICA';
    model.transfereeId = this.form.value.transferentId
      ? Number(this.form.value.transferentId)
      : 0;
    model.desTrans = this.form.value.keyCode
      ? this.form.value.keyCode
      : 'NO APLICA';
    model.clasifId = this.form.value.clasifId
      ? Number(this.form.value.clasifId)
      : 0;
    model.desClasif = this.form.value.desClasif
      ? this.form.value.desClasif
      : 'NO APLICA';
    model.unit = this.form.value.unit ? this.form.value.unit : 'N/A';
    model.ruleId = Number(this.form.value.ruleId);
    model.valid = Number(this.form.value.valid);

    //SERVICIO 1
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.alert('success', 'Registro creado correctamente', '');
      },
      error: error => {
        this.alert('error', error.error.message, '');
      },
    });
  }
  insertOtrosTrasn() {
    this.newOrEdit = false;
    const model = {} as any;
    model.labelId = Number(this.form.value.labelId);
    model.status = this.form.value.status ? this.form.value.status : 'N/A';
    model.desStatus = this.form.value.desStatus
      ? this.form.value.desStatus
      : 'NO APLICA';
    model.transfereeId = this.form.value.transferentId
      ? Number(this.form.value.transferentId)
      : 0;
    model.desTrans = this.form.value.keyCode
      ? this.form.value.keyCode
      : 'NO APLICA';
    model.clasifId = this.form.value.clasifId
      ? Number(this.form.value.clasifId)
      : 0;
    model.desClasif = this.form.value.desClasif
      ? this.form.value.desClasif
      : 'NO APLICA';
    model.unit = this.form.value.unit ? this.form.value.unit : 'N/A';
    model.ruleId = Number(this.form.value.ruleId);
    model.valid = Number(this.form.value.valid);
    model.amount = Number(this.form.value.amount);

    //SERVICIO 1
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Registro creado correctamente', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  insertPermisosRastreador() {
    this.newOrEdit = false;
    const model = {} as any;
    model.value = this.form.value.value;
    model.name = this.form.value.name;
    model.valid = Number(this.form.value.valid);

    //SERVICIO POS PERMISOS
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast(
          'success',
          'Usuario para Rastreador creado correctamente',
          ''
        );
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  getOtKey() {
    // let arr: number[] = [];
    this.tvalTable1Service.getByIdFind(421).subscribe({
      next: response => {
        console.log('total key data ', response.count);
        console.log('total key data ', response);
        for (let i = 0; i < response.data.length; i++) {
          console.log('i -> ', i);
          this.arr.push(Number(response.data[i].otKey));
        }
        console.log('arr  ', this.arr.sort());
        const ultimoNumero = this.arr.sort()[this.arr.length - 1];
        console.log('ult -> ', ultimoNumero);
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  getMax() {
    this.dynamicCatalogsService.GetMax(421).subscribe({
      next: response => {
        console.log('res 111 ', response);
        this.totalOtKey = response + 1;
        console.log('max ln. ', response);
        console.log('this.totalOtKey ', this.totalOtKey);
      },
    });
  }

  createTableUser() {
    const model = {} as any;
    model.nmtable = 421;
    model.otkey = this.totalOtKey;
    model.otvalor = this.form.value.value;
    model.name = this.form.value.name;
    model.registerNumber = 0;
    model.abbreviation = this.form.value.valid;

    console.log('data a guardar 4 -> ', model);
    this.tvalTable1Service.createTvalTable1(model).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          this.handleSuccess();
          this.alert('success', 'Registro creado correctamente', '');
        }
      },
      error: err => {
        this.onLoadToast('error', err.message, '');
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  update(data: any) {
    console.log('data update -> ', data);
    const model = {} as any;
    model.labelId = Number(data.labelId);
    model.status = data.status ? data.status : 'N/A';
    model.desStatus = data.desStatus ? data.desStatus : 'NO APLICA';
    model.transfereeId = data.transferentId ? Number(data.transferentId) : 0;
    model.desTrans = data.keyCode ? data.keyCode : 'NO APLICA';
    model.clasifId = data.clasifId ? Number(data.clasifId) : 0;
    model.desClasif = data.desClasif ? data.desClasif : 'NO APLICA';
    model.unit = data.unit ? data.unit : 'N/A';
    model.ruleId = Number(data.ruleId);
    model.valid = Number(data.valid);

    let obj = {
      clave: {
        labelId: this.data.label.id,
        status: this.data.status,
        transfereeId: this.data.transfereeId,
        clasifId: this.data.clasifId,
        unit: this.data.unit,
        ruleId: this.data.ruleId,
      },
      labelId: model.labelId,
      status: model.status,
      desStatus: model.desStatus,
      transfereeId: model.transfereeId,
      desTrans: model.desTrans,
      clasifId: model.clasifId,
      desClasif: model.desClasif,
      unit: model.unit,
      ruleId: model.ruleId,
      valid: model.valid,
    };
    // model.labelId = Number(data.labelId);
    // model.status = data.status;
    // model.desStatus = data.desStatus;
    // model.transfereeId = Number(data.transferentId);
    // model.desTrans = data.keyCode;
    // model.clasifId = Number(data.clasifId);
    // model.desClasif = data.desClasif;
    // model.unit = data.unit;
    // model.ruleId = Number(data.ruleId);
    // model.valid = Number(data.valid);
    console.log('data update 2-> ', model);

    this.donationService.editApproveDonation(obj).subscribe({
      next: data => {
        this.handleSuccess();
        this.alert('success', 'Registro actualizado correctamente', '');
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de internet.';
          this.onLoadToast('error', 'Error', error);
          //this.newOrEdit = false;
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  updateOtros(data: any) {
    //console.log("data update -> ", data);
    const model = {} as any;
    model.labelId = Number(data.labelId);
    model.status = data.status ? data.status : 'N/A';
    model.desStatus = data.desStatus ? data.desStatus : 'NO APLICA';
    model.transfereeId = data.transferentId ? Number(data.transferentId) : 0;
    model.desTrans = data.keyCode ? data.keyCode : 'NO APLICA';
    model.clasifId = data.clasifId ? Number(data.clasifId) : 0;
    model.desClasif = data.desClasif ? data.desClasif : 'NO APLICA';
    model.unit = data.unit ? data.unit : 'N/A';
    model.ruleId = Number(data.ruleId);
    model.valid = Number(data.valid);
    model.amount = Number(data.amount);
    let obj = {
      clave: {
        labelId: this.data.label.id,
        status: this.data.status,
        transfereeId: this.data.transfereeId,
        clasifId: this.data.clasifId,
        unit: this.data.unit,
        ruleId: this.data.ruleId,
      },
      labelId: model.labelId,
      status: model.status,
      desStatus: model.desStatus,
      transfereeId: model.transfereeId,
      desTrans: model.desTrans,
      clasifId: model.clasifId,
      desClasif: model.desClasif,
      unit: model.unit,
      ruleId: model.ruleId,
      valid: model.valid,
      amount: model.amount,
    };
    console.log('data update 3-> ', model);

    this.donationService.editApproveDonation(obj).subscribe({
      next: data => {
        this.handleSuccess();
        this.alert('success', 'Registro actualizado correctamente', '');
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de internet.';
          this.onLoadToast('error', 'Error', error);
          //this.newOrEdit = false;
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  updatePermisoRas(data: any) {
    const model = {} as any;
    (model.nmtable = 421), (model.otkey = Number(this.data.otkey));
    model.otvalor = data.value;
    model.registerNumber = 0;
    model.abbreviation = data.valid;

    console.log('data update 4-> ', model);

    this.dynamicCatalogsService.editTvalTable1(model).subscribe({
      next: data => {
        this.handleSuccess();
        this.alert('success', 'Registro actualizado correctamente', '');
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de internet.';
          this.onLoadToast('error', 'Error', error);
          //this.newOrEdit = false;
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      labelId: ['', Validators.required],
      status: [''],
      desStatus: [''],
      transferentId: ['', Validators.required],
      keyCode: [''],
      clasifId: [''],
      desClasif: [''],
      unit: [''],
      ruleId: ['', Validators.required],
      valid: [''],
    });

    this.form.patchValue({
      ruleId: this.type,
    });
    this.form.get('ruleId').disabled;
  }

  prepareFormOthersT() {
    this.form = this.fb.group({
      labelId: ['', Validators.required],
      status: [''],
      desStatus: [''],
      transferentId: ['', Validators.required],
      keyCode: [''],
      clasifId: [''],
      desClasif: [''],
      unit: [''],
      amount: [''],
      ruleId: ['', Validators.required],
      valid: [''],
    });

    this.form.patchValue({
      ruleId: this.type,
    });
    this.form.get('ruleId').disabled;
  }

  prepareFormPermissionR() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      valid: ['', Validators.required],
      //otkey: ['', Validators.required],
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true, this.case);
    this.modalRef.hide();
  }

  // SELECT DESCRIPCION,NO_ETIQUETA
  // FROM CAT_ETIQUETA_BIEN
  listLabel(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('id', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }
    params.sortBy = `id:ASC`;
    this.labelGoodService.getEtiqXClasif(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['idAndDesc'] = item.id + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          this.labels = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.labels = new DefaultSelect([]);
      },
    });
  }

  // SELECT 'N/A' ESTATUS,'NO APLICA' DESCRIPCION
  //   FROM DUAL
  // UNION
  // SELECT ESTATUS,DESCRIPCION
  //   FROM ESTATUS_BIEN
  // ORDER BY ESTATU
  listStatus(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('status', lparams.text, SearchFilter.EQ);

    // if (!isNaN(parseInt(lparams?.text))) {
    //     // params.addFilter('no_cuenta', lparams.text);
    //   } else {
    //     params.addFilter('description', lparams.text, SearchFilter.ILIKE);
    //     // params.addFilter('cve_banco', lparams.text);
    //   }
    // params.search = `${lparams.text}`
    this.goodService.getAllStatusGood_(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['idAndDesc'] = item.status + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          this.status = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.status = new DefaultSelect([]);
      },
    });
  }

  // SELECT 0 NO_TRANSFERENTE,'NO APLICA' CLAVE
  //   FROM DUAL
  // UNION
  // SELECT NO_TRANSFERENTE,CLAVE
  //   FROM CAT_TRANSFERENTE
  // ORDER BY NO_TRANSFERENTE
  listTransfer(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('id', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        params.addFilter('keyTransferent', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }
    params.sortBy = `id:ASC`;
    this.transferenteService.getAll(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['idAndDesc'] = item.id + ' - ' + item.keyTransferent;
        });
        Promise.all(result).then(resp => {
          this.transfers = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.transfers = new DefaultSelect([]);
      },
    });
  }

  // SELECT 0 NO_CLASIF_BIEN,'NO APLICA' DESCRIPCION
  //   FROM DUAL
  // UNION
  // SELECT NO_CLASIF_BIEN,DESCRIPCION
  //   FROM CAT_SSSUBTIPO_BIEN
  // ORDER BY NO_CLASIF_BIEN
  listClasif(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('numClasifGoods', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }
    params.sortBy = `id:ASC`;
    this.goodSssubtypeService.getFilter(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['idAndDesc'] = item.numClasifGoods + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          this.clasifs = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.clasifs = new DefaultSelect([]);
      },
    });
  }

  // SELECT 'N/A' UNIDAD
  //   FROM DUAL
  // UNION
  // SELECT UNIDAD
  //   FROM UNIDADESMED
  // ORDER BY UNIDAD
  listUnidades(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    // if (lparams.text)
    //   if (!isNaN(parseInt(lparams?.text))) {
    //     console.log('SI');
    //     params.addFilter('idLot', lparams.text, SearchFilter.EQ);
    //     // params.addFilter('no_cuenta', lparams.text);
    //   } else {
    //     console.log('NO');

    params.addFilter('unit', lparams.text, SearchFilter.ILIKE);
    //     // params.addFilter('cve_banco', lparams.text);
    //   }
    params.sortBy = `unit:ASC`;
    this.strategyServiceService.getMedUnits(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map(item => {
          // item['idAndDesc'] = item.id + ' - ' + item.keyTransferent
        });
        Promise.all(result).then(resp => {
          this.units = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.units = new DefaultSelect([]);
      },
    });
  }

  insertDescClasif(event: any) {
    if (event) {
      this.form.get('desClasif').setValue(event.description);
    } else {
      this.form.get('desClasif').setValue('');
    }
  }

  insertDescTrans(event: any) {
    if (event) {
      this.form.get('keyCode').setValue(event.keyTransferent);
    } else {
      this.form.get('keyCode').setValue('');
    }
  }

  insertDescStatus(event: any) {
    if (event) {
      this.form.get('desStatus').setValue(event.description);
    } else {
      this.form.get('desStatus').setValue('');
    }
  }
}
