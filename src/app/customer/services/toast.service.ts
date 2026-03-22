import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageSubject = new BehaviorSubject<{text: string, type: string} | null>(null);
  message$ = this.messageSubject.asObservable();

  show(message: string, type: string = 'default') {
    this.messageSubject.next({ text: message, type});

    setTimeout(() => {
      this.messageSubject.next(null);
    }, 3000);
  }
}
