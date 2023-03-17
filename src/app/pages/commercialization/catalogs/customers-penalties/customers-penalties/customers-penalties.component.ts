import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { AddPenaltiesComponent } from '../add-penalties/add-penalties.component';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS, COLUMNS2 } from './columns';
import { data } from './data';

@Component({
  selector: 'app-customers-penalties',
  templateUrl: './customers-penalties.component.html',
  styles: [],
})
export class CustomersPenaltiesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: any[] = data;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2;
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      customerId: [null, [Validators.required]],
      penaltyDate: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<AddPenaltiesComponent>): void {
    const modalRef = this.modalService.show(AddPenaltiesComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe((data: any) => {
      //console.log(data);
      //if (data)
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }

  openForm(penalty?: any) {
    this.openModal({ penalty });
  }
}
