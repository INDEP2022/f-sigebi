import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
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
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';

@Component({
  selector: 'app-goods-types-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-types-shared.component.html',
  styles: [],
})
export class GoodsTypesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
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
  rowClass: string;

  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() types = new DefaultSelect<Partial<IGoodType>>();
  @Input() subtypes = new DefaultSelect();
  @Input() ssubtypes = new DefaultSelect();
  @Input() sssubtypes = new DefaultSelect();

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

  ngOnInit(): void {
    this.rowClass = this.inlineForm
      ? `col-md-${this.columns} mt-3`
      : `col-md-12 mt-3`;
  }

  getTypes(params: ListParams) {
    const _params: any = params;
    _params['filter.nameGoodType'] = `$ilike:${params.text}`;
    delete _params.search;
    delete _params.text;
    this.service.search(_params).subscribe({
      next: data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.types = new DefaultSelect();
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

  getSubtypes(params: ListParams) {
    const _params: any = params;
    _params['filter.nameSubtypeGood'] = `$ilike:${params.text}`;
    delete _params.search;
    delete _params.text;
    if (this.type.value) {
      _params['type'] = this.type.value;
    }
    this.goodSubtypesService.getAll(_params).subscribe({
      next: data => {
        this.subtypes = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.subtypes = new DefaultSelect();
      },
    });
  }

  getSsubtypes(params: ListParams) {
    const _params: any = params;
    _params['filter.description'] = `$ilike:${params.text}`;
    delete _params.search;
    delete _params.text;
    if (this.type.value) {
      _params['type'] = this.type.value;
    }
    if (this.type.value) {
      _params['subtype'] = this.subtype.value;
    }
    this.goodSsubtypeService.getAll(_params).subscribe({
      next: data => {
        this.ssubtypes = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.ssubtypes = new DefaultSelect();
      },
    });
  }

  getSssubtypes(params: ListParams) {
    const _params: any = params;
    _params['filter.description'] = `$ilike:${params.text}`;
    delete _params.search;
    delete _params.text;
    if (this.type.value) {
      _params['type'] = this.type.value;
    }
    if (this.type.value) {
      _params['subtype'] = this.subtype.value;
    }
    if (this.ssubtype.value) {
      _params['ssubtype'] = this.ssubtype.value;
    }
    this.goodSssubtypeService.getAll(_params).subscribe({
      next: data => {
        this.sssubtypes = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.ssubtypes = new DefaultSelect();
      },
    });
  }

  onTypesChange(type: any) {
    this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    this.subtypes = new DefaultSelect();
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
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
