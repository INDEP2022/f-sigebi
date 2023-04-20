import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
//Components
import { AddPenaltiesComponent } from '../add-penalties/add-penalties.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-customers-penalties',
  templateUrl: './customers-penalties.component.html',
  styles: [],
})
export class CustomersPenaltiesComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private clientPenalty: ClientPenaltyService
  ) {
    super();
    this.service = this.clientPenalty;
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
    this.prepareForm();
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

  openForm(penalty?: any) {
    this.openModal({ penalty });
  }
}
