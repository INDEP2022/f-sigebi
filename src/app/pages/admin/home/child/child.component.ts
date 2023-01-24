import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { decrement, increment } from '../../action/home.actions';

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
