import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject, debounceTime, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { IGoodsSubtype } from 'src/app/core/models/catalogs/goods-subtype.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';

@Component({
  selector: 'app-goods-types-shared-Good',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-types-shared.component.html',
  styles: [],
})
export class GoodsTypesSharedGoodComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() loadTypes = false;
  @Output() loadTypesChange = new EventEmitter<boolean>();
  @Input() loadOnChangesNoBien = false;
  @Input() typeField: string = 'type';
  @Input() subtypeField: string = 'subtype';
  @Input() ssubtypeField: string = 'ssubtype';
  @Input() sssubtypeField: string = 'sssubtype';
  @Input() inlineForm: boolean = false;
  @Input() columns: number = 4;
  @Input() goodTypeShow: boolean = true;
  @Input() subTypeShow: boolean = true;
  @Input() ssubTypeShow: boolean = true;
  @Input() sssubTypeShow: boolean = true;
  @Input() goodselect: IGood;
  rowClass: string;

  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() types = new DefaultSelect<Partial<IGoodType>>();
  @Input() subtypes = new DefaultSelect();
  @Input() ssubtypes = new DefaultSelect();
  @Input() sssubtypes = new DefaultSelect();
  @Input() set reloadGood(value: IGood) {
    if (value) this.getData(value);
  }

  @Output() goodTypeChange = new EventEmitter<IGoodType>();
  @Output() goodSubtypeChange = new EventEmitter<IGoodSubType>();
  @Output() goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  @Output() goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

  get type() {
    return this.form.get(this.typeField);
  }
  get subtype() {
    return this.form.get(this.subtypeField);
  }
  get ssubtype() {
    return this.form.get(this.ssubtypeField);
  }
  get sssubtype() {
    return this.form.get(this.sssubtypeField);
  }

  constructor(
    private service: GoodTypeService,
    private goodSubtypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
  }

  async ngOnInit() {
    //let countSssubtype: number = 0;
    this.rowClass = this.inlineForm
      ? `col-md-${this.columns} mt-3`
      : `col-md-12 mt-3`;
    if (
      (this.form.get('noBien').value !== null ||
        this.form.get('noBien').value !== '') &&
      this.loadOnChangesNoBien
    ) {
      console.info('Desde el componenete de change*******');
      this.getTypes(new ListParams());
      this.form
        .get('noBien')
        .valueChanges.pipe(debounceTime(500), takeUntil(this.$unSubscribe))
        .subscribe(async res => {
          console.info('Desde el componenete de change', res);
          if (this.goodselect && res !== null) {
            if (this.goodselect.goodClassNumber) {
              console.info('Desde el componenete de change', res);
              const params = new ListParams();
              const response: any = await this.getClassif(
                params,
                this.goodselect.goodClassNumber
              );
              console.log(response);
              this.sssubtype.setValue(response.id);
              this.onSssubtypesChange(response);
            }
          } else {
            console.info('Desde el componenete de change', res);
            this.type.setValue('');
            this.types = new DefaultSelect([], 0, true);
            this.subtype.setValue('');
            this.subtypes = new DefaultSelect([], 0, true);
            this.ssubtype.setValue('');
            this.ssubtypes = new DefaultSelect([], 0, true);
            this.sssubtype.setValue('');
            this.sssubtypes = new DefaultSelect([], 0, true);
            this.form.get('situacion').setValue('');
            this.form.get('destino').setValue('');
            this.form.get('estatus').setValue('');
            this.goodSssubtypeChange.emit(null);
            this.getTypes(new ListParams());
          }
        });
      return;
    }

    // if (this.form) {
    //   this.form.valueChanges
    //     .pipe(debounceTime(500), takeUntil(this.$unSubscribe))
    //     .subscribe(x => {
    //       if (this.loadTypes) {
    //         const params = new ListParams();
    //         if (x[this.sssubtypeField]) {
    //           this.getSssubtypes(params, x[this.sssubtypeField]);
    //         }
    //         if (x[this.ssubtypeField]) {
    //           this.getSsubtypes(params, x[this.ssubtypeField]);
    //         }
    //         if (x[this.subtypeField]) {
    //           this.getSubtypes(params, x[this.subtypeField]);
    //         }
    //         if (x[this.typeField]) {
    //           this.getTypes(params, x[this.typeField]);
    //         }
    //       }
    //       this.loadTypes = false;
    //       this.loadTypesChange.emit(false);
    //     });
    //   // this.sssubtype.valueChanges
    //   //   .pipe(debounceTime(500), takeUntil(this.$unSubscribe))
    //   //   .subscribe(x => {
    //   //     console.log(x);
    //   //   });
    // }
  }

  async getData(good: IGood) {
    console.info('---------- nuevo flujo -----------------', this.goodselect);
    if (good) {
      if (good.goodClassNumber) {
        const params = new ListParams();
        const response: any = await this.getClassif(
          params,
          good.goodClassNumber
        );
        console.log(response);
        this.sssubtype.setValue(response.id);
        this.onSssubtypesChange(response);
      }
    } else {
      this.type.setValue('');
      this.types = new DefaultSelect([], 0);
      this.subtype.setValue('');
      this.subtypes = new DefaultSelect([], 0);
      this.ssubtype.setValue('');
      this.ssubtypes = new DefaultSelect([], 0);
      this.sssubtype.setValue('');
      this.sssubtypes = new DefaultSelect([], 0);
      this.form.get('situacion').setValue('');
      this.form.get('destino').setValue('');
      this.form.get('estatus').setValue('');
      this.goodSssubtypeChange.emit(null);
    }
  }
  getTypes(params: ListParams, id: any = null) {
    const _params: any = params;

    if (id) {
      _params['filter.id'] = id;
    } else {
      _params['filter.nameGoodType'] = `$ilike:${params.text}`;
    }
    _params['sortBy'] = 'id:ASC';
    delete _params.search;
    delete _params.text;
    this.service.search(_params).subscribe({
      next: data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.types = new DefaultSelect([], 0, true);
        if (err.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al obtener los tipos de bien'
          );
        }
      },
    });
  }

  getSubtypes(params: ListParams, id: any = null) {
    const _params: any = params;
    if (id) {
      params['filter.id'] = id;
    } else {
      _params['filter.nameSubtypeGood'] = `$ilike:${params.text}`;
    }
    delete _params.search;
    delete _params.text;
    if (this.type.value) {
      _params['filter.idTypeGood'] = this.type.value;
    }
    this.goodSubtypesService.getAll(_params).subscribe({
      next: data => {
        this.subtypes = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.subtypes = new DefaultSelect([], 0, true);
      },
    });
  }

  getSsubtypes(params: ListParams, id: any = null) {
    const _params: any = params;
    if (id) {
      params['filter.id'] = id;
    } else {
      _params['filter.description'] = `$ilike:${params.text}`;
    }
    delete _params.search;
    delete _params.text;
    if (this.type.value) {
      _params['filter.noType'] = this.type.value;
    }
    if (this.type.value) {
      _params['filter.noSubType'] = this.subtype.value;
    }
    this.goodSsubtypeService.getAll(_params).subscribe({
      next: data => {
        this.ssubtypes = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.ssubtypes = new DefaultSelect([], 0, true);
      },
    });
  }

  getSssubtypes(params: ListParams, id: any = null) {
    const _params: any = params;
    if (id) {
      params['filter.id'] = id;
    } else {
      _params['filter.description'] = `$ilike:${params.text}`;
    }
    delete _params.search;
    delete _params.text;
    if (this.type.value) {
      _params['filter.numType'] = this.type.value;
    }
    if (this.type.value) {
      _params['filter.numSubType'] = this.subtype.value;
    }
    if (this.ssubtype.value) {
      _params['filter.numSsubType'] = this.ssubtype.value;
    }
    this.goodSssubtypeService.getAll(_params).subscribe({
      next: data => {
        this.sssubtypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.sssubtypes = new DefaultSelect([], 0, true);
      },
    });
  }

  async getClassif(params: ListParams, id: string | number) {
    return new Promise((res, rej) => {
      const _params: any = params;
      _params['filter.numClasifGoods'] = id;
      delete _params.search;
      delete _params.text;
      console.log(_params);
      this.goodSssubtypeService.getAll(_params).subscribe({
        next: data => {
          console.log(data.data);
          this.sssubtypes = new DefaultSelect(data.data, data.count);
          res(data.data[0]);
        },
        error: error => {
          this.sssubtypes = new DefaultSelect([], 0);
          res(null);
        },
      });
    });
  }

  onTypesChange(type: any) {
    this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    this.subtypes = new DefaultSelect();
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.getSubtypes(new ListParams());
    this.form.updateValueAndValidity();
    this.goodTypeChange.emit(type);
  }

  onSubtypesChange(subtype: any) {
    if (!this.type.value) {
      this.types = new DefaultSelect([subtype.idTypeGood], 1);
      this.type.setValue(subtype.idTypeGood.id);
    }
    this.resetFields([this.ssubtype, this.sssubtype]);
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.getSsubtypes(new ListParams());
    this.goodSubtypeChange.emit(subtype);
  }

  onSsubtypesChange(ssubtype: any) {
    if (!this.type.value || !this.subtype.value) {
      this.types = new DefaultSelect([ssubtype.noType], 1);
      this.subtypes = new DefaultSelect([ssubtype.noSubType], 1);
      this.type.setValue(ssubtype.noType.id);
      this.subtype.setValue(ssubtype.noSubType.id);
    }
    this.resetFields([this.sssubtype]);
    this.getSssubtypes(new ListParams());
    this.goodSsubtypeChange.emit(ssubtype);
  }

  onSssubtypesChange(sssubtype: any) {
    if (!this.type.value || !this.subtype.value || !this.ssubtype.value) {
      this.types = new DefaultSelect([sssubtype.numType], 1);
      this.subtypes = new DefaultSelect([sssubtype.numSubType], 1);
      this.ssubtypes = new DefaultSelect([sssubtype.numSsubType], 1);
      this.type.setValue(sssubtype.numType.id);
      this.subtype.setValue(sssubtype.numSubType.id);
      this.ssubtype.setValue(sssubtype.numSsubType.id);
    }
    this.goodSssubtypeChange.emit(sssubtype);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field.setValue(null);
    });
    this.form.updateValueAndValidity();
  }
}
