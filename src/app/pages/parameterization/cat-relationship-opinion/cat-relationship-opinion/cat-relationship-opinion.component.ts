import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AFFAIR_COLUMNS } from './relationship-opinion-columns';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//Services
import { LocalDataSource } from 'ng2-smart-table';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AffairTypeService } from 'src/app/core/services/affair/affair-type.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';

@Component({
  selector: 'app-cat-relationship-opinion',
  templateUrl: './cat-relationship-opinion.component.html',
  styles: [],
})
export class CatRelationshipOpinionComponent
  extends BasePage
  implements OnInit
{
  affairForm: ModelForm<IAffair>;
  data: LocalDataSource = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private affairService: AffairService,
    private affairTypeService: AffairTypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...AFFAIR_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.affairForm = this.fb.group({
      id: [null, [Validators.required]],
      description: [{ value: null, disabled: true }],
    });
  }

  getAffairById(): void {
    let _id = this.affairForm.controls['id'].value;
    this.loading = true;
    this.affairService.getById(_id).subscribe(
      response => {
        //TODO: Validate Response
        if (response !== null) {
          this.affairForm.patchValue(response);
          this.affairForm.updateValueAndValidity();
          this.getTypesByAffairId(response.id);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('info', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getTypesByAffairId(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffairTypes(id));
  }

  getAffairTypes(id: string | number): void {
    this.affairTypeService.getByAffair(id, this.params.getValue()).subscribe(
      response => {
        //console.log(response);
        let data = response.data.map((item: IAffairType) => {
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
