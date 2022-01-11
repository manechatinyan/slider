import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

import {PercentsEnum} from '../../@core/enums/percents.enum';

@Directive({
  selector: '[drag-and-drop]'
})
export class DragAndDropDirective {
  @Input() progressWidth!: number;
  @Input() eachImageWidth!: number;

  @Output() mouseUpEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseDownEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseMoveEvent: EventEmitter<number> = new EventEmitter<number>();

  private dragStarted: boolean = false;
  private percents: typeof PercentsEnum = PercentsEnum;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  mousedown(e: Event): void {
    this.dragStarted = true;
    this.mouseDownEvent.emit();
    this.moveSlider(e);
    const eventListener = (e: Event) => {
      e.stopPropagation();
      this.moveSlider(e);
    };
    document.addEventListener('mousemove', eventListener);
    document.addEventListener('mouseup', (e: Event) => {
      this.dragEnd(e);
      document.removeEventListener('mousemove', eventListener);
    });
  }

  private moveSlider(e: Event): void {
    if (this.dragStarted) {
      const progressElRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
      this.mouseMoveEvent.emit(this.setProgressWidth(e, progressElRect));
    }
  }

  private setProgressWidth(e: any, rect: DOMRect): number {
    if (e.clientX >= rect.right) {
      return this.percents.MAX;
    }
    if (e.clientX <= rect.left) {
      return this.percents.MIN;
    }
    return (e.clientX - rect.left) / rect.width * 100;
  }

  private dragEnd(e: Event): void {
    e.stopPropagation();
    this.dragStarted = false;
    this.mouseUpEvent.emit();
  }
}
