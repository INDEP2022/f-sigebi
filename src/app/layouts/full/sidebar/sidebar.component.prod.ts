import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import MetisMenu from 'metismenujs';
import {
  MenuPermission,
  Submenu,
} from 'src/app/core/interfaces/menu-permission.interface';
import { IMenuItem } from 'src/app/core/interfaces/menu.interface';
import { AuthService } from 'src/app/core/services/authentication/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
    `
      .scrollbar-menu {
        --scrollbar-thumb-color: #10312b;
        --scrollbar-thumb-hover-color: var(--scrollbar-thumb-color);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef: any;
  @Input() isCondensed = false;
  private menu: any;
  public menuItems: IMenuItem[] = [];

  menus: MenuPermission[] = [];

  @ViewChild('sideMenu') sideMenu: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const roles = this.authService.accessRoles();
    roles.some((rol: any) =>
      rol.menus.some(
        (menu: any) => {
          this.menus.push(menu);
        }
        //menu.screen === screenId &&
        //menu.permissions[permission] == PERMISSION_ENABLED
      )
    );
    this.initialize();
  }

  ngAfterViewInit() {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
    this._scrollElement();
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
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
  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName('mm-active').length > 0) {
        const currentPosition: any =
          document.getElementsByClassName('mm-active')[0];
        let position = currentPosition.offsetTop;
        if (position > 500) {
          this.scrollRef.scrollTo({ top: position + 300, duration: 0 });
        }
        // if (this.scrollRef.SimpleBar !== null)
        //   this.scrollRef.SimpleBar.getScrollElement().scrollTop =
        //     position + 300;
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: string) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
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

  /**
   * Initialize
   */
  private initialize(): void {
    //ordenar menu por parentId 0
    this.menus.sort(function (a, b) {
      if (a.parentid < b.parentid) {
        return -1;
      }
      if (a.parentid > b.parentid) {
        return 1;
      }
      return 0;
    });

    const menusOPID = this.menus.filter(menu => menu.parentid == 0);
    const menusWPID = this.menus.filter(menu => menu.parentid !== 0);

    this.menuItems = menusOPID.map(menu => {
      const global: IMenuItem = {} as IMenuItem;
      global.label = menu.description;
      global.parentId = menu.parentid;
      global.subItems = [];
      global.id = menu.id;
      if (global.parentId == 0) global.icon = 'bx-folder';

      if (menu.submenus.length > 0) {
        global.subItems = this.searchChild(menu.submenus);
      } else {
        global.link = menu.name;
      }

      return global;
    });

    menusWPID.map((menuWPID: any) => {
      const isPresent = this.menuItems.findIndex(
        menu => menu.id === menuWPID.parentid
      );

      if (isPresent != -1) {
        const global: IMenuItem = {} as IMenuItem;
        global.label = menuWPID.description;
        global.parentId = menuWPID.parentid;
        global.subItems = [];
        global.id = menuWPID.id;
        if (global.parentId == 0) global.icon = 'bx-folder';

        if (menuWPID.submenus.length > 0) {
          global.subItems = this.searchChild(menuWPID.submenus);
        } else {
          global.link = menuWPID.name;
        }

        this.menuItems[isPresent].subItems.push(global);
      } else {
        //TODO:SEARCH IN CHILDS
        this.isPresentRc(menuWPID);
      }
    });
  }

  private isPresentRc(menuWPID: any): any {
    this.menuItems = this.menuItems.map(menu => {
      if (menu.subItems.length > 0) {
        let isPresent = menu.subItems.findIndex(
          msi => msi.id === menuWPID.parentid
        );

        if (isPresent != -1) {
          const global: IMenuItem = {} as IMenuItem;
          global.label = menuWPID.description;
          global.parentId = menuWPID.parentid;
          global.subItems = [];
          global.id = menuWPID.id;
          if (global.parentId == 0) global.icon = 'bx-folder';

          if (menuWPID.submenus.length > 0) {
            global.subItems = this.searchChild(menuWPID.submenus);
          } else {
            global.link = menuWPID.name;
          }
          menu.subItems[isPresent].subItems.push(global);
        } else {
          //TODO:SEARCH IN CHILDS
          let childs = menu.subItems;
          do {
            childs.map(child => {
              isPresent = child.subItems.findIndex(
                msi => msi.id === menuWPID.parentid
              );

              if (isPresent != -1) {
                const global: IMenuItem = {} as IMenuItem;
                global.label = menuWPID.description;
                global.parentId = menuWPID.parentid;
                global.subItems = [];
                global.id = menuWPID.id;

                if (menuWPID.submenus.length > 0) {
                  global.subItems = this.searchChild(menuWPID.submenus);
                } else {
                  global.link = menuWPID.name;
                }
                child.subItems[isPresent].subItems.push(global);
              } else {
                childs = child.subItems;
              }
            });
          } while (isPresent != -1);

          return menu;
        }
      }

      return menu;
    });
  }

  private searchChild(subMenu: Submenu[]): IMenuItem[] {
    let subItemsArray: IMenuItem[] = [];
    for (const sub of subMenu) {
      const subItems: IMenuItem = {} as IMenuItem;
      subItems.label = sub.description;
      subItems.parentId = sub.parentid;
      subItems.id = sub.id;
      subItems.subItems = [];
      if (sub.submenus.length > 0) {
        subItems.subItems = this.searchChild(sub.submenus);
      } else {
        subItems.link = sub.name;
      }
      subItemsArray.push(subItems);
    }

    return subItemsArray;
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
  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: IMenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }
}
