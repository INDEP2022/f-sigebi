import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';

@Component({
  selector: 'app-goods-characteristics',
  templateUrl: './goods-characteristics.component.html',
  styles: [],
})
export class GoodsCharacteristicsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods: IGood[] = [];
  disabledBienes = true;
  form: FormGroup;
  permisions = false;
  good: any;

  handleEvent(data: any) {
    console.log('Evento recibido:', data);
  }

  get numberGood() {
    return this.form.get('noBien');
  }

  get numberClassification() {
    return this.form.get('noClasif');
  }

  get goodStatus() {
    return this.form.get('status');
  }

  get goodDescription() {
    return this.form.get('descripcion');
  }

  get goodUnit() {
    return this.form.get('unidad');
  }

  get goodQuantity() {
    return this.form.get('cantidad');
  }

  get goodReference() {
    return this.form.get('valRef');
  }

  get goodAppraisal() {
    return this.form.get('valorAval');
  }

  get goodDateVigency() {
    return this.form.get('fechaAval');
  }

  get goodLatitude() {
    return this.form.get('latitud');
  }

  get goodLongitude() {
    return this.form.get('longitud');
  }

  get goodObservations() {
    return this.form.get('observaciones');
  }

  get goodAppraisal2() {
    return this.form.get('avaluo');
  }

  get delegation() {
    return this.form.get('delegation');
  }

  get subdelegation() {
    return this.form.get('subdelegation');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get type() {
    return this.form.get('type');
  }

  get subType() {
    return this.form.get('subType');
  }

  select = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private serviceDeleg: DelegationService,
    private subdelegationService: SubdelegationService,
    private georeferencieService: SurvillanceService,
    private statusScreenService: StatusXScreenService,
    private dictationService: DictationService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        if (param['noBien']) {
          this.searchGood(param['noBien']);
        }
        // this.goodService.getById2(param['noBien']).subscribe({
        //   next: data => {
        //     this.searchGood(data);
        //   },
        // });
      },
    });
    // this.form.get('noBien').valueChanges.subscribe({
    //   next: val => {
    //     this.goodService.getById2(val).subscribe({
    //       next: data => {
    //         this.searchGood(data);
    //       },
    //     });
    //   },
    // });
  }

  prepareForm() {
    this.form = this.fb.group({
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      noClasif: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unidad: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      cantidad: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      valRef: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fechaAval: [null, [Validators.required]],
      valorAval: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observaciones: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      latitud: [null, [Validators.required]],
      longitud: [null, [Validators.required]],
      avaluo: ['0', [Validators.required]],
    });
  }

  getGoods(ssssubType: IGoodSssubtype) {
    // this.good = ssssubType.numClasifGoods;
  }

  searchGood(good: any) {
    // const numberGood = Number(this.numberGood.value);

    this.goodService.getById2(good).subscribe({
      next: response => {
        console.log(response);

        this.good = response;

        this.type.setValue(response.goodTypeId);
        this.subType.setValue(response.subTypeId);
        // this.form.get('ssubtype').setValue(response.goodTypeId);
        // this.form.get('sssubtype').setValue(response.goodTypeId);
        // this.getDelegation(response.delegationNumber);
        // this.getSubdelegation(response.subDelegationNumber);
        this.delegation.setValue(response.delegationNumber.description);
        this.subdelegation.setValue(response.subDelegationNumber.description);
        this.getLatitudLongitud(response.goodId);
        // this.getDelegation(response.)
        this.numberClassification.setValue(response.goodClassNumber);
        this.goodStatus.setValue(response.goodStatus);
        this.goodDescription.setValue(response.description);
        this.goodUnit.setValue(response.unit);
        this.goodQuantity.setValue(response.quantity);
        this.goodReference.setValue(response.referenceValue);
        this.goodAppraisal.setValue(response.appraisedValue);
        this.goodDateVigency.setValue(new Date(response.appraisalVigDate));
        // this.goodLatitude.setValue(response.latitude);
        // this.goodLongitude.setValue(response.longitud);
        this.goodObservations.setValue(response.observationss);
        if (response.appraisal === null) {
          this.goodAppraisal2.setValue('0');
        } else {
          this.goodAppraisal2.setValue('1');
        }
        this.getTDicta();
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', 'No existe el Bien ingresado');
      },
    });
  }

  getDelegation(id: any) {
    this.serviceDeleg.getById(id).subscribe(data => {
      this.delegation.setValue(data.description);
    });
  }

  getSubdelegation(id: any) {
    this.subdelegationService.getById(id).subscribe(data => {
      this.subdelegation.setValue(data.description);
    });
  }

  private getStatusXPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FACTDIRDATOSBIEN');
    filterParams.addFilter('status', this.good.status);
    return this.statusScreenService
      .getList(filterParams.getFilterParams())
      .pipe(map(x => (x.data ? x.data : [])));
  }

  private getTDicta() {
    const filterParams = new FilterParams();
    filterParams.addFilter('typeNumber', 'CARBIEN');
    // filterParams.addFilter('user', localStorage.getItem('username'));
    filterParams.addFilter('reading', 'S');
    // filterParams.addFilter()
    this.dictationService.getRTdictaAarusr(filterParams.getParams()).subscribe({
      next: response => {
        console.log(response);
        if (response.count && response.count > 0) {
          this.permisions = true;
        }
        this.getValidations();
      },
      error: err => {
        this.getValidations();
      },
    });
  }

  private fillAvaluo() {
    if (this.type.value === '6' && this.subType.value) {
      if (this.goodAppraisal.value === null) {
        if (this.good.val14 === 'S') {
          this.goodAppraisal2.setValue('S');
        } else if (this.good.val14 === 'N') {
          this.goodAppraisal2.setValue('N');
        } else {
          if (this.good.val14 === null) {
            this.goodAppraisal2.setValue('X');
          } else {
            this.goodAppraisal2.setValue('S');
          }
        }
      } else {
        if (this.good.val14 === 'S') {
          this.goodAppraisal2.setValue('S');
        } else if (this.good.val14 === 'N') {
          this.goodAppraisal2.setValue('S');
        }
        if (this.goodAppraisal.value != null && this.good.val14 === null) {
          this.goodAppraisal2.setValue('S');
        }
        if (this.good.val14 === null) {
          this.goodAppraisal2.setValue('X');
        } else {
          this.goodAppraisal2.setValue('S');
        }
      }
    }
  }

  private getValidations() {
    this.getStatusXPantalla().subscribe({
      next: response => {
        console.log(response);
        const di_disponible_e = response.filter(x => x.action === 'E').length;
        const di_disponible = response.filter(
          x => x.action === null || x.action === 'null'
        ).length;
        const di_disponible_d = response.filter(x => x.action === 'D').length;
        if (di_disponible > 0) {
          this.disabledBienes = false;
        } else {
          if (di_disponible_e > 0 && this.permisions) {
            this.disabledBienes = false;
          } else if (di_disponible_d > 0 && this.permisions) {
            this.disabledBienes = false;
          } else {
            this.disabledBienes = true;
          }
        }
      },
    });
  }

  getLatitudLongitud(id: number) {
    // const params = new FilterParams();
    // params.addFilter('id', id)
    // this.georeferencieService.getGeoreferencieObject().subscribe({
    //   next: response => {
    //     console.log(response);
    //     // if(response.data && response.data.length > 0) {
    //     //   this.longitud.setValue(response.data[0])
    //     // }
    //   }
    // })

    this.georeferencieService.getGeoreferencieObjectById(id).subscribe({
      next: response => {
        console.log(response);
        if (response) {
          this.latitud.setValue(response.georefLatitude);
          this.longitud.setValue(response.georefLongituded);
        }
        // if(response.data && response.data.length > 0) {
        //   this.longitud.setValue(response.data[0])
        // }
      },
    });
  }
}
