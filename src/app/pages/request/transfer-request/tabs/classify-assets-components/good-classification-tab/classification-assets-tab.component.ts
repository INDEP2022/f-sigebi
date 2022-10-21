import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REQUEST_OF_ASSETS_COLUMNS } from '../classification-assets.columns';

@Component({
  selector: 'app-classification-assets-tab',
  templateUrl: './classification-assets-tab.component.html',
  styles: [],
})
export class ClassificationAssetsTabComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Bienes de la Solicitud';
  public classiGoodsForm: ModelForm<any>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  public selectSection = new DefaultSelect<any>();
  public selectChapter = new DefaultSelect<any>();
  public selectLevel1 = new DefaultSelect<any>();
  public selectLevel2 = new DefaultSelect<any>();
  public selectLevel3 = new DefaultSelect<any>();
  public selectLevel4 = new DefaultSelect<any>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: REQUEST_OF_ASSETS_COLUMNS,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  initForm() {
    this.classiGoodsForm = this.fb.group({
      section: [null],
      chapter: [null],
      level1: [null],
      level2: [null],
      level3: [null],
      level4: [null],
    });
  }

  getData() {
    this.loading = true;
    /*  this.exampleService.getAll(this.params.getValue()).subscribe(
      response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    ); */
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  getSection(event: any) {
    /* this.delegationService.getZones(params).subscribe({
      next: data => (this.selectSection = new DefaultSelect(data.data, data.count)),
    }); */
  }

  getChapter(event: any) {}

  getLevel1(event: any) {}

  getLevel2(event: any) {}

  getLevel3(event: any) {}

  getLevel4(event: any) {}
}
