import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { LoaderService } from 'src/app/@core/broadcaster/loader.service';
import { ReportService } from '../report.service';
import { ShareQuizDataService } from '../share-quiz-data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService,
    private pageLoader: LoaderService
  ) { 
    this.pageLoader.pageLoader.emit({ showLoader: true });
  }

  public forms = {
    basic: true,
    goals: true,
    budget: true,
    riskMagement: true,
    wealthMagement: true,
  } ;

  ngOnInit(): void {
   
    console.log("in oninit");
    
    this.service.getQuizInfo()
      .subscribe({
        next: (q) => {
          this.quizService.setQuiz(q.answer);
        },
        error: (e) => {
          this.router.navigate(['/error']);
          // alert("PLEASE ENSURE YOU HAVE ADDED THE CORRECT ID ELSE THE FORMS WILL NOT WORK AS EXPECTED");
        }
      })
  }


  onActivate(activatedComponentReference) {
console.log(activatedComponentReference);

  console.log("form",activatedComponentReference.budgetingForm?.valid);

  this.pageLoader.pageLoader.emit({ showLoader: true });
  this.quizService.castQuiz.subscribe({
    next: (_form) => {
if(_form){
  this.pageLoader.pageLoader.emit({ showLoader: false });
  console.log("details")
  this.forms.basic =  (Object.keys(_form.basic).length) == 0;
  this.forms.goals =  (Object.keys(_form.goals).length) == 0;
  this.forms.budget =  (Object.keys(_form.budget).length) == 0;
  this.forms.riskMagement =  (Object.keys(_form.risk_funds).length) == 0;
}
    }
  });

  }

  scrollInToview(element) {
    element.srcElement.scrollIntoView({ behavior: "smooth", inline: "center" });
    // element.srcElement.scrollIntoViewIfNeeded();
  }


}
