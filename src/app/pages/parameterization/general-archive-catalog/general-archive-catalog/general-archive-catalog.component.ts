import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SHELF_COLUMNS } from './shelf-columns';
//services
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { ShelvessService } from 'src/app/core/services/save-values/shelves.service';
//models
import { IShelves } from 'src/app/core/models/catalogs/shelves.model';

@Component({
  selector: 'app-general-archive-catalog',
  templateUrl: './general-archive-catalog.component.html',
  styles: [],
})
export class GeneralArchiveCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  data: LocalDataSource = new LocalDataSource();

  show = false;

  // settingsBattery;
  // settingsShelves;
  // settingsLockers;

  @Output() refresh = new EventEmitter<true>();

  // data1: LocalDataSource = new LocalDataSource();
  // data2: LocalDataSource = new LocalDataSource();
  // data3: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private saveValueService: SaveValueService,
    private shelvessService: ShelvessService
  ) {
    super();
    // this.settingsBattery = {
    //   ...this.settings,
    //   columus: {...BATTERY_COLUMNS}
    // }
    this.settings = {
      ...this.settings,
      actions: {
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...SHELF_COLUMNS },
    };
    // this.settingsLockers = {
    //   ...this.settings,
    //   columus: {...LOCKERS_COLUMNS}
    // }
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      description: [null, []],
      location: [null, []],
      responsible: [null, []],
    });
  }

  //Traer Guardavalores por ID y rellenar en los inputs
  getSaveValuesById(): void {
    let _id = this.form.controls['id'].value;
    this.loading = true;
    this.saveValueService.getById(_id).subscribe(
      response => {
        console.log(response);
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getShelvesBySaveValues(response.id);
        } else {
          this.alert('info', 'No se encontraron registros', '');
        }
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getShelvesBySaveValues(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getShelves(id));
  }

  getShelves(id: string | number): void {
    this.shelvessService
      .getByCveSaveValues(id, this.params.getValue())
      .subscribe(
        response => {
          //console.log(response);
          let data = response.data.map((item: IShelves) => {
            //console.log(item);
            return item;
          });
          this.data.load(data);
          this.totalItems = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }
}
