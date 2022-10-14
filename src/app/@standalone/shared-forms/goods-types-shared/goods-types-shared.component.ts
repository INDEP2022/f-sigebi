import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbstractControl, FormGroup } from '@angular/forms';
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

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

  @Input() goodTypeShow: boolean = true;
  @Input() subTypeShow: boolean = true;
  @Input() ssubTypeShow: boolean = true;
  @Input() sssubTypeShow: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  types = new DefaultSelect<IGoodType>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

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

  constructor(private service: GoodTypeService) {
    super();
  }

  ngOnInit(): void {}

  getTypes(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  getSubtypes(params: ListParams) {
    // this.service
    //   .getSubtypes({ type: this.type.value, ...params })
    //   .subscribe((data) => {
    //     this.subtypes = new DefaultSelect(data.data, data.count);
    //   });
  }

  getSsubtypes(params: ListParams) {
    // this.service
    //   .getSsubtypes({
    //     type: this.type.value,
    //     subtype: this.subtype.value,
    //     ...params,
    //   })
    //   .subscribe((data) => {
    //     this.ssubtypes = new DefaultSelect(data.data, data.count);
    //   });
  }

  getSssubtypes(params: ListParams) {
    // this.service
    //   .getSssubtypes({
    //     type: this.type.value,
    //     subtype: this.subtype.value,
    //     ssubtype: this.ssubtype.value,
    //     ...params,
    //   })
    //   .subscribe((data) => {
    //     this.sssubtypes = new DefaultSelect(data.data, data.count);
    //   });
  }

  onTypesChange(type: any) {
    this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    this.subtypes = new DefaultSelect();
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.form.updateValueAndValidity();
  }

  onSubtypesChange(subtype: any) {
    this.types = new DefaultSelect([subtype.type], 1);
    this.type.setValue(subtype.type.id);
    this.resetFields([this.ssubtype, this.sssubtype]);
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
  }

  onSsubtypesChange(ssubtype: any) {
    this.types = new DefaultSelect([ssubtype.type], 1);
    this.subtypes = new DefaultSelect([ssubtype.subtype], 1);
    this.type.setValue(ssubtype.type.id);
    this.subtype.setValue(ssubtype.subtype.id);
    this.resetFields([this.sssubtype]);
  }

  onSssubtypesChange(sssubtype: any) {
    this.types = new DefaultSelect([sssubtype.type], 1);
    this.subtypes = new DefaultSelect([sssubtype.subtype], 1);
    this.ssubtypes = new DefaultSelect([sssubtype.ssubtype], 1);
    this.type.setValue(sssubtype.type.id);
    this.subtype.setValue(sssubtype.subtype.id);
    this.ssubtype.setValue(sssubtype.ssubtype.id);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
