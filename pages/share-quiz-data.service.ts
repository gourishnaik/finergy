import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IQuizAnswer } from './models';

@Injectable({
  providedIn: 'root'
})
export class ShareQuizDataService {
  constructor() { }
  private quiz = new BehaviorSubject<IQuizAnswer | undefined>(undefined);
  castQuiz = this.quiz.asObservable();

  setQuiz(q: IQuizAnswer) {
    this.quiz.next(q);
  }
}
