import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ZONE_COLUMNS } from './zone-columns';

@Component({
  selector: 'app-surveillance-zones',
  templateUrl: './surveillance-zones.component.html',
  styles: [],
})
export class SurveillanceZonesComponent extends BasePage implements OnInit {
  form: FormGroup;

  zoneState: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  public zones = new DefaultSelect();
  public zoneStates = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = ZONE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      zone: [null, Validators.required],
      noSupervisors: [null, Validators.required],
      zoneStates: [null, Validators.required],
    });
  }

  public getZones(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getZoneStates(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }
}
