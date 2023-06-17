import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBASIC, IBUDGET, IGOALMETA, IMETAPARENT, IQuizAnswer, IRISK, IWEALTH } from './models';

interface IQuizSaveResponse {
  message: string,
  answer: IQuizAnswer
}
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient
  ) { }

  private ansId = localStorage.getItem("quiz_id") || "30086eac-3ae6-4100-ba99-a2753ce8fc0f";

  getPreReport(): Observable<any> {
    return this.http.get(`${environment.api}report/${this.ansId}`);
  }

  getReport(): Observable<any> {
    return this.http.get(`${environment.api}report/${this.ansId}/final`);
  }

  getQuizInfo(): Observable<{ answer: IQuizAnswer }> {
    this.ansId = localStorage.getItem("quiz_id") || "30086eac-3ae6-4100-ba99-a2753ce8fc0f";
    return this.http.get<{ answer: IQuizAnswer }>(`${environment.api}answers/${this.ansId}`);
  }

  saveBasicInfo(basic: IBASIC): Observable<IQuizSaveResponse> {
    return this.http.post<IQuizSaveResponse>(`${environment.api}answers/${this.ansId}/basic`, basic);
  }

  saveGoalInfo(goals: string[], goal_meta: IMETAPARENT): Observable<IQuizSaveResponse> {
    return this.http.post<IQuizSaveResponse>(`${environment.api}answers/${this.ansId}/goals`, { "goals": goals, "goal_meta": goal_meta });
  }

  saveBudgetInfo(budget: IBUDGET): Observable<IQuizSaveResponse> {
    return this.http.post<IQuizSaveResponse>(`${environment.api}answers/${this.ansId}/budget`, budget);
  }

  saveBRiskInfo(risk: IRISK): Observable<IQuizSaveResponse> {
    return this.http.post<IQuizSaveResponse>(`${environment.api}answers/${this.ansId}/risk`, risk);
  }

  saveWealthInfo(wealth: IWEALTH): Observable<IQuizSaveResponse> {
    return this.http.post<IQuizSaveResponse>(`${environment.api}answers/${this.ansId}/wealth`, wealth);
  }

  getReportPDF(): void {
    this.http.get<{ result: string }>(`${environment.api}report/${this.ansId}/final?download=true`)
      .subscribe({
        next: (v: { result: string }) => {
          let year = new Date().getFullYear();
          var filename = `FinergyReport${year}.pdf`;
          this.downloadFile(v.result, filename);
        }
      });
  }

  downloadFile(fileURL, filename) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
      a.download = filename; // Set the file name.
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open('GET', fileURL);
    xhr.send();
  }


  //fetch report

  //fetchreport(): Observable<any>{

  // return this.http.get(`${environment.api}report/${this.ansId}`);
  // }



}
