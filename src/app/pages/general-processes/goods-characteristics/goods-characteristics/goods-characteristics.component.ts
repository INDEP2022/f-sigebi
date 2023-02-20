import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/good/good.service';
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

  form: FormGroup;

  good: any;

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

  select = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private serviceDeleg: DelegationService,
    private subdelegationService: SubdelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.form.get('noBien').valueChanges.subscribe({
      next: val => {
        this.goodService.getById(val).subscribe({
          next: data => {
            this.searchGood(data);
          },
        });
      },
    });
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
    this.good = ssssubType.numClasifGoods;
  }

  searchGood(good: any) {
    const numberGood = Number(this.numberGood.value);

    this.goodService.getById(numberGood).subscribe({
      next: response => {
        this.good = response;
        this.getDelegation(response.delegationNumber);
        this.getSubdelegation(response.subDelegationNumber);

        // this.getDelegation(response.)
        this.numberClassification.setValue(response.goodClassNumber);
        this.goodStatus.setValue(response.goodStatus);
        this.goodDescription.setValue(response.description);
        this.goodUnit.setValue(response.unit);
        this.goodQuantity.setValue(response.quantity);
        this.goodReference.setValue(response.referenceValue);
        this.goodAppraisal.setValue(response.appraisedValue);
        this.goodDateVigency.setValue(response.appraisalVigDate);
        this.goodLatitude.setValue(response.latitude);
        this.goodLongitude.setValue(response.longitud);
        this.goodObservations.setValue(response.observationss);
        if (response.appraisal === null) {
          this.goodAppraisal2.setValue('0');
        } else {
          this.goodAppraisal2.setValue('1');
        }
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
}
