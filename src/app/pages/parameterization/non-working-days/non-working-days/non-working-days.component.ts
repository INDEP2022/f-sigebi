import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NonWorkingDaysModalComponent } from '../non-working-days-modal/non-working-days-modal.component';
import { NONWORKINGDAYS_COLUMNS } from './non-working-days-columns';

@Component({
  selector: 'app-non-working-days',
  templateUrl: './non-working-days.component.html',
  styles: [],
})
export class NonWorkingDaysComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  nonWorkingDaysForm: FormGroup;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: NONWORKINGDAYS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.nonWorkingDaysForm = this.fb.group({
      year: [null, Validators.required],
    });
  }
  openNonWorkingDays(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NonWorkingDaysModalComponent, config);
  }
}
