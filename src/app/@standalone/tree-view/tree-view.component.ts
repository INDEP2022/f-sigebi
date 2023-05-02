import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import MetisMenu from 'metismenujs';
import { IMenuItem, ITreeItem } from 'src/app/core/interfaces/menu.interface';
import { TreeNodeComponent } from './tree-node/tree-node.component';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './tree-view.component.html',
  styles: [],
})
export class TreeViewComponent implements OnInit {
  @ViewChild('sideMenu') sideMenu: ElementRef;
  @Input() label: string = 'label';
  @Input() set items(items: ITreeItem[]) {
    let id = 0;
    let subItems: ITreeItem[] = [];
    items.forEach(menu => {
      if (menu.subItems?.length > 0) {
        menu.id = id;
        id = this.setParentId(menu, menu.id);
      } else {
        menu.id = id;
        id++;
      }
      subItems.push(menu);
    });
    this._items = subItems;
  }
  get items() {
    return this._items;
  }
  isCondensed = false;
  private menu: any;
  private _items: ITreeItem[];
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  ngOnChanges() {
    if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  hasItems(item: IMenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  private setParentId(menuItem: IMenuItem, id: number): number {
    menuItem.subItems.forEach(sub => {
      id++;
      sub.id = id;
      sub.parentId = menuItem.id;
      if (sub.subItems?.length > 0) {
        sub.id = id;
        id = this.setParentId(sub, sub.id);
      }
    });
    return id;
  }

  private _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);

    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            //se agrega parentElement por app dinamico
            parent3El.parentElement.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              //se agrega parentElement por app dinamico
              parent4El.parentElement.classList.add('mm-show');

              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                //se agrega parentElement por app dinamico
                parent5El.parentElement.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }

                /*IF MENU NIVEL 3*/
                const parent6El = parent5El.parentElement;
                if (parent6El && parent6El.id !== 'side-menu') {
                  //se agrega parentElement por app dinamico
                  parent6El.parentElement.classList.add('mm-show');
                  parent6El.parentElement.classList.add('mm-active');
                  const childanchor = parent6El.querySelector('.is-parent');
                  if (childanchor && parent6El.id !== 'side-menu') {
                    childanchor.classList.add('mm-show');
                    childanchor.classList.add('mm-active');
                  }

                  const parent7El = parent5El.parentElement;
                  if (parent7El && parent7El.id !== 'side-menu') {
                    //se agrega parentElement por app dinamico
                    parent7El.parentElement.classList.add('mm-show');
                    parent7El.parentElement.classList.add('mm-active');
                    const childanchor = parent7El.querySelector('.is-parent');
                    if (childanchor && parent7El.id !== 'side-menu') {
                      childanchor.classList.add('mm-show');
                      childanchor.classList.add('mm-active');
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private _removeAllClass(className: string) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }
}
