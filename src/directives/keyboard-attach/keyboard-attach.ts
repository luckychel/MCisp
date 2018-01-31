import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Content, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[keyboardAttach]'
})
export class KeyboardAttachDirective implements OnInit, OnDestroy {
  @Input('keyboardAttach') content: Content;

  private onShowSubscription: Subscription;
  private onHideSubscription: Subscription;
  private onShowWindowSubscription: Subscription;

  constructor(
      private elementRef: ElementRef,
      private keyboard: Keyboard,
      private platform: Platform
  ) {}

  ngOnInit() {
      if (this.platform.is('cordova') && this.platform.is('ios')) {
          this.onShowSubscription = this.keyboard.onKeyboardShow().subscribe(e => this.onShow(e));
          this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.onHide());
      }
  }

  ngOnDestroy() {
      if (this.onShowSubscription) this.onShowSubscription.unsubscribe();
      if (this.onShowWindowSubscription) this.onShowWindowSubscription.unsubscribe();
      if (this.onHideSubscription) this.onHideSubscription.unsubscribe();
  }

  private onShow(e) {
      const keyboardHeight: number = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
      this.setElementPosition(keyboardHeight);
      this.keyboard.disableScroll(true);
  };

  private onHide() {
      this.setElementPosition(0);
      this.keyboard.disableScroll(false);
  };

  private setElementPosition(pixels: number) {
      this.elementRef.nativeElement.style.paddingBottom = pixels + 'px';
      this.content.resize();

      this.onShowWindowSubscription = Observable.timer(0, 1)
          .subscribe(
          ()=>{
              if(window.pageYOffset !== 0){
                  window.scrollTo(0, 0) ;
                  this.onShowWindowSubscription.unsubscribe();

                  setTimeout(()=>{
                      this.content.scrollToBottom(0);
                  },100)
              }
          }
      )
  }
}