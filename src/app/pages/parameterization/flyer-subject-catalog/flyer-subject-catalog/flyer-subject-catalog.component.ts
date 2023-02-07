import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FLYER_SUBJECT_CAT_COLUMNS2 } from './flyer-subject-catalog-column2';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
//service
import { LocalDataSource } from 'ng2-smart-table';
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';

@Component({
  selector: 'app-flyer-subject-catalog',
  templateUrl: './flyer-subject-catalog.component.html',
  styles: [],
})
export class FlyerSubjectCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  show = false;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private affairTypeService: AffairTypeService,
    private affairService: AffairService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...FLYER_SUBJECT_CAT_COLUMNS2 },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getIaffairTypebyAffair());
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  //traer asunto por id
  getAffairById(): void {
    let _id = this.form.controls['id'].value;
    this.loading = true;
    this.affairService.getById(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getAffairTypeByAffair(response.id);
          // this.getGoodsByExpedient(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontrarón registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getAffairTypeByAffair(code: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairType(code));
  }

  getAffairType(code: string | number): void {
    this.affairTypeService
      .getByAffairId(code, this.params.getValue())
      .subscribe(
        response => {
          let data = response.data.map((item: IAffairType) => {});
          this.data.load(data);
          this.totalItems = response.count;
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
