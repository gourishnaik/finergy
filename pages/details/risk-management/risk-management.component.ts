import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from './risk-management-constant';
import { scrollTo } from 'src/app/@core/modules';
import { FutureValueInflation } from 'src/app/helpers';
import { ReportService } from '../../report.service';
import { ShareQuizDataService } from '../../share-quiz-data.service';

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.scss']
})
export class RiskManagementComponent implements OnInit {
  @ViewChild('lineGraphWrapper', { static: true }) lineGraphWrapper: ElementRef;

  public _constant = new Constants().constant;

  graphData = this._constant.graphData


  riskManagementForm = this._formBuilder.group({
    HealthRisk: new FormControl<boolean | null>(null, [Validators.required]),
    EmergencyFund: new FormControl<boolean | null>(null, [Validators.required]),
    AccidentFunds: new FormControl<boolean | null>(null, [Validators.required]),
    RetirementFunds: new FormControl<boolean | null>(null, [Validators.required]),
    TermFunds: new FormControl<boolean | null>(null, [Validators.required]),
  })
  emergency: number = 0;
  term: number = 0;
  health: string = '';
  retiremnt: number = 0;
  disability: number = 0;

  loading: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService
  ) { }

  ngOnInit(): void {
    scrollTo('.scrollStart');
    this.quizService.castQuiz.subscribe({
      next: (q) => {
        if (!q || !q.basic || Object.keys(q.basic).length == 0) {
          console.log("PLEASE FILL BASIC FORM");
          return;
        }

        let inc = q.basic.familyIncome || 100000; //default value
        this.emergency = inc * 6;
        this.term = inc * 100;
        this.health = inc < 50000 ? "5 lacs" : inc < 100000 ? "7.5 lacs" : "10 lacs";
        this.disability = inc * 50;


        if (!q || !q.risk_funds || Object.keys(q.risk_funds).length == 0) {
          return;
        }


        let birth_year = Number(q.basic.birthDate.split("-")[2]);
        let age = new Date().getFullYear() - birth_year;
        console.log(age, 60 - age)

        this.retiremnt = FutureValueInflation(inc, 60 - age);
        this.riskManagementForm.patchValue({
          HealthRisk: q.risk_funds.health || false,
          EmergencyFund: q.risk_funds.emergency || false,
          AccidentFunds: q.risk_funds.accident || false,
          RetirementFunds: q.risk_funds.retirement || false,
          TermFunds: q.risk_funds.term || false
        });
        this.renderGraph(q.risk_funds.emergency, 0);
        this.renderGraph(q.risk_funds.accident, 1);
        this.renderGraph(q.risk_funds.term, 2);
        this.renderGraph(q.risk_funds.health, 3);
        this.renderGraph(q.risk_funds.retirement, 4);
      }
    });


  }



  /* =======#GET METHODS======== */
  get healthRisk() {
    return this.riskManagementForm.get('HealthRisk');
  }
  get emergencyFund() {
    return this.riskManagementForm.get('EmergencyFund');
  }
  get termFunds() {
    return this.riskManagementForm.get('TermFunds');
  }
  get accidentFunds() {
    return this.riskManagementForm.get('AccidentFunds');
  }
  get retirementFunds() {
    return this.riskManagementForm.get('RetirementFunds');
  }
  /* =======#END GET METHODS======== */

  checkValid(event, control) {
    event?.stopPropagation()
    if (this.riskManagementForm.get(control)?.valid) {
      scrollTo('.scrollNext', 230)
    }
  }

  //#RENDER GRAPH DATA
  renderGraph(value, index) {
    if (value == true) {
      if (index == 0) {
        this.graphData[index] = { x1: 0, x2: 15, y1: 0, y2: 0, value: value }
      } else {
        this.graphData[index] = { x1: this.graphData[index - 1].x2, x2: this.graphData[index - 1].x2 + 15, y1: this.graphData[index - 1].y2, y2: this.graphData[index - 1].y2, value: value }
      }
    }
    else if (value == false) {
      if (index == 0) {
        this.graphData[index] = { x1: 0, x2: 15, y1: 0, y2: 13, value: value, }
      } else {
        this.graphData[index] = { x1: this.graphData[index - 1].x2, x2: this.graphData[index - 1].x2 + 15, y1: this.graphData[index - 1].y2, y2: this.graphData[index - 1].y2 + 13, value: value, }
      }
    }

    this.graphData.forEach((element, i) => {
      if (element.value != null) {
        if (i != 0) {
          this.graphData[i].y1 = this.graphData[i - 1].y2
          this.graphData[i].x1 = this.graphData[i - 1].x2
          if (this.graphData[i].value == true) {
            this.graphData[i].y2 = this.graphData[i - 1].y2
          } else {
            this.graphData[i].y2 = this.graphData[i - 1].y2 + 13
          }
        }
      }
    });
  }


  // getDirtyQuestions() {
  //   let changedProperties: any = [];
  //   Object.keys(this.riskManagementForm.controls).forEach((name) => {
  //     const currentControl = this.riskManagementForm.controls[name];
  //     if (currentControl.dirty) {
  //       changedProperties.push(name);
  //     }
  //   });
  //   return changedProperties;
  // }



  //#SAVE FORM
  saveForm(event) {
    if (event) {
      event.stopPropagation();
    }
    this.riskManagementForm.markAllAsTouched();
    if (this.riskManagementForm.valid) {
      this.saveRiskInfo();
    }

  }

  saveRiskInfo() {
    let r = this.riskManagementForm.value;
    this.loading = true;
    this.service.saveBRiskInfo({
      emergency: r.EmergencyFund || false,
      accident: r.AccidentFunds || false,
      term: r.TermFunds || false,
      health: r.HealthRisk || false,
      retirement: r.RetirementFunds || false,
    }).subscribe({
      next: (q) => {
        console.log(q);
        this.quizService.setQuiz(q.answer);
        this.loading = false;
        this._router.navigate(['/details/wealth-management']);
      },
      error: (err) => {
        this.loading = false;
        console.log("[ERROR] saving risk info");
      }
    })
  }

  public fixedElement: boolean = false
  @HostListener("window:scroll", [])
  onWindowScroll() {
    // console.log(this.lineGraphWrapper.nativeElement.getBoundingClientRect().top);
    if (this.lineGraphWrapper.nativeElement.getBoundingClientRect().top < 153) {
      this.fixedElement = true;
    } else {
      this.fixedElement = false;
    }
  }

}
