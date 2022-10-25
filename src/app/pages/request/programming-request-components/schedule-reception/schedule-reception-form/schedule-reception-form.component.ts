import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-schedule-reception-form',
  templateUrl: './schedule-reception-form.component.html',
  styles: [],
})
export class ScheduleReceptionFormComponent implements OnInit {
  scheduleForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  users = new DefaultSelect<IUser>();
  date = new Date();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.schedule();
  }

  schedule() {
    this.scheduleForm = this.fb.group({
      radio: ['T.E'],
      userId: [null, [Validators.required]],
      check: [false],
    });
  }

  typeUser(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  confirm() {
    alert('Please enter');
  }

  getUserSelect(user: ListParams) {}
}
