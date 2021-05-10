import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  NgZone,
  EventEmitter,
  Output
} from '@angular/core';
import { GestureController } from '@ionic/angular';

// https://forum.ionicframework.com/t/ionic-5-long-press-gesture-example/188746
@Directive({
  selector: '[longPress]'
})
export class LongPressDirective implements AfterViewInit {

  @Output() press = new EventEmitter();
  @Input() delay = 1500;
  private action: any; // not stacking actions

  private longPressActive = false;

  constructor(
                private el: ElementRef,
                private gestureCtrl: GestureController,
                private zone: NgZone
              ) { }

  ngAfterViewInit() {
      this.loadLongPressOnElement();
  }

  loadLongPressOnElement() {
      const gesture = this.gestureCtrl.create({
          el: this.el.nativeElement,
          threshold: 0,
          gestureName: 'long-press',
          onStart: ev => {
              this.longPressActive = true;
              this.longPressAction();
          },
          onEnd: ev => {
              console.log('long press end');
              this.longPressActive = false;
          }
      });
      gesture.enable(true);
  }

  private longPressAction() {
      if (this.action) {
          clearInterval(this.action);
      }
      this.action = setTimeout(() => {
          this.zone.run(() => {
              if (this.longPressActive === true) {
                  this.longPressActive = false;
                  this.press.emit();
              }
          });
      }, this.delay);
  }
}
