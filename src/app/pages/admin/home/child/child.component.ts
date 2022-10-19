import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { decrement, increment } from '../../action/home.actions';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styles: [],
})
export class ChildComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
  incrementCounter() {
    this.store.dispatch(increment());
  }
  decrementCounter() {
    this.store.dispatch(decrement());
  }
}
