import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') active: boolean = false;
  @HostListener('click') onClick() {
    this.active = !this.active;
  }
  constructor() {}
}
