import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { MeasurementUnitsService } from 'src/app/core/services/catalogs/measurement-units.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IPackage } from 'src/app/core/models/catalogs/package.model';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { packagesData } from './data';

@Component({
  selector: 'app-packages-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './packages-shared.component.html',
  styles: [],
})
export class PackagesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() packageField: string = 'package';

  @Input() showPackages: boolean = true;
  @Output() infoSent: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();

  packages = new DefaultSelect<IPackage>();
  status = new DefaultSelect<IPackage>();
  get measurementUnit() {
    return this.form.get(this.packageField);
  }

  constructor(private service: PackageGoodService) {
    super();
  }

  ngOnInit(): void {
    this.getPackages(new ListParams());
  }

  getPackages(params: ListParams) {
    //Provisional data
    let data = packagesData;
    let count = data.length;
    this.packages = new DefaultSelect(data, count);
    this.service.getPaqDestinationEnc(params).subscribe(
      data => {
        this.packages = new DefaultSelect(data.data, data.count);
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
    ); /** */
  }

  sentInfo(data: any) {
    const info = data;
    // Emitir evento con la información
    this.infoSent.emit(info);
  }

  onPackagesChange(type: any) {
    this.sentInfo(type);
    //this.resetFields([this.subdelegation]);
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
