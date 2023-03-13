import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CoordinationModalComponent } from 'src/app/@standalone/shared-forms/coordination/coordination-modal.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-coordination',
  templateUrl: './coordination.component.html',
  styles: [],
})
export class CoordinationComponent implements OnInit {
  form = this.fb.group({
    coordinacion: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {}

  openModal() {
    this.modalService.show(CoordinationModalComponent);
  }
}
