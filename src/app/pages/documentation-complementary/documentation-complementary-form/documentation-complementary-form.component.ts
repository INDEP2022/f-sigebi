import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SearchUserFormComponent } from '../../request/programming-request-components/schedule-reception/search-user-form/search-user-form.component';

@Component({
  selector: 'app-documentation-complementary-form',
  templateUrl: './documentation-complementary-form.component.html',
  styles: [],
})
export class DocumentationComplementaryFormComponent implements OnInit {
  date = new Date();
  documentComplementaryForm: FormGroup = new FormGroup({});
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  broadStations = new DefaultSelect();
  authoritys = new DefaultSelect();
  valueCheck: string = '';
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.documentComplementaryForm = this.fb.group({
      officeNumber: [null],
      regionalDelegation: ['METROPOLITANA'],
      state: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      broadStation: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      subject: [null],
      radio: [null],
      userReception: [null],
    });
  }

  getStateSelect(state: ListParams) {}

  getTransferentSelect(transferent: ListParams) {}

  getbroadStationSelect(broadStation: ListParams) {}

  getAuthoritySelect(authority: ListParams) {}

  typeUser(event: Event) {
    this.valueCheck = (event.target as HTMLInputElement).value;
  }

  searchUser() {
    const searchUser = this.modalService.show(SearchUserFormComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
