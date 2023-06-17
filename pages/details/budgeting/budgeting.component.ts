import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { scrollTo } from 'src/app/@core/modules';

import { ReportService } from '../../report.service';
import { ShareQuizDataService } from '../../share-quiz-data.service';

@Component({
  selector: 'app-budgeting',
  templateUrl: './budgeting.component.html',
  styleUrls: ['./budgeting.component.scss']
})
export class BudgetingComponent implements OnInit {
  @ViewChild('budgetStatusBar', { static: true }) budgetStatusBar: ElementRef;

  budgetingForm = this.formBuilder.group({
    HouseholdBudget: new FormControl<boolean | null>(null, [Validators.required]),
    TransportBudget: new FormControl<boolean | null>(null, [Validators.required]),
    RentBudget: new FormControl<boolean | null>(null, [Validators.required]),
    LoanBudget: new FormControl<boolean | null>(null, [Validators.required]),
    PersonalCareBudget: new FormControl<boolean | null>(null, [Validators.required]),
    EntertainmentBudget: new FormControl<boolean | null>(null, [Validators.required]),
    EatingOutBudget: new FormControl<boolean | null>(null, [Validators.required])
  })
  household = 0.25;
  transport: number = 0;
  rent: number = 0;
  loan: number = 0;

  personal: number = 0.05;
  entertainment: number = 0.05;
  food: number = 0;


  HouseRented: boolean = false;
  loading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService
  ) {
  }

  //item: any;
  public fixedElement: boolean = false

  ngOnInit(): void {


    scrollTo('.scrollStart',-40);

    let inc = 0;

    this.quizService.castQuiz.subscribe({
      next: (q) => {
        // console.log("QUIZzzzzZZZzzz Budget", q?.budget);
        if (!q || !q.basic || Object.keys(q.basic).length == 0) {
          return;
        }

        this.HouseRented = q.basic.rented;

        // console.log(this.HouseRented, " this.HouseRented");

        if (!this.HouseRented) {
          this.budgetingForm.patchValue({ RentBudget: true });
        }






        // console.log("house rented response" + " " + this.HouseRented)

        //console.log("data is" + q)
        inc = q.basic.familyIncome;
        this.household = inc * 0.25;

        this.personal = inc * 0.05;
        this.entertainment = inc * 0.05;

        if (inc > 130999) {
          this.transport = inc * 0.09;
        } else if (inc > 54990) {
          this.transport = 7000;
        } else if (inc < 24991) {
          this.transport = inc * 0.09;
        } else if (inc < 54990) {
          this.transport = 5000;
        }

        this.rent = q.basic.rented ? inc * 0.15 : 0;
        this.loan = inc * 0.30;

        if (inc < 19999) {
          this.entertainment = 800;
        } else if (inc > 79999) {
          this.entertainment = 5000;
        } else if (inc > 19999) {
          this.entertainment = inc * 0.04;
        }

        if (inc < 19999) {
          this.food = 0;
        } else if (inc > 100000) {
          this.food = 5000;
        } else if (inc > 19999) {
          this.food = inc * 0.03;
        }

        if (!q || !q.budget || Object.keys(q.budget).length < 1) {
          return;
        }
        this.budgetingForm.setValue({
          HouseholdBudget: q.budget.household || false,
          TransportBudget: q.budget.transport || false,
          RentBudget: q.budget.rent || false,
          LoanBudget: q.budget.loan || false,
          PersonalCareBudget: q.budget.personal || false,
          EntertainmentBudget: q.budget.entertainment || false,
          EatingOutBudget: q.budget.food || false
        });
        this.calulatePercentage(undefined);
      }
    });


  }


  /* =======#GET METHODS======== */
  get householdBudget() {
    return this.budgetingForm.get('HouseholdBudget');
  }
  get transportBudget() {
    return this.budgetingForm.get('TransportBudget');
  }
  get rentBudget() {
    return this.budgetingForm.get('RentBudget');
  }
  get loanBudget() {
    return this.budgetingForm.get('LoanBudget');
  }
  get personalCareBudget() {
    return this.budgetingForm.get('PersonalCareBudget');
  }
  get entertainmentBudget() {
    return this.budgetingForm.get('EntertainmentBudget');
  }
  get eatingOutBudget() {
    return this.budgetingForm.get('EatingOutBudget');
  }
  /* =======#END GET METHODS======== */
  checkValid(event, control) {
    event?.stopPropagation()
    if (this.budgetingForm.get(control)?.valid) {
      scrollTo('.scrollNext', 90)
    }
  }


  percentage: any = 0;
  totalQuestions = Object.keys(this.budgetingForm.controls).length;
  calulatePercentage(event) {
    event?.stopPropagation()
    let belowBudgetCount = 0
    Object.values(this.budgetingForm.value).forEach(element => {
      element && belowBudgetCount++
    });
    this.percentage = (belowBudgetCount * 100) / this.totalQuestions
  }


  activeDropDowns: any[] = [];
  dropDownMenu(key) {
    if (this.activeDropDowns.includes(key)) {
      this.activeDropDowns = this.activeDropDowns.filter((item) => {
        return item !== key;
      });
    } else {
      return this.activeDropDowns.push(key);
    }
  }

  //   enableWantsSection(event){
  // event?.stopPropagation();
  //     if (!this.activeDropDowns.includes('budgetingWants')) 
  //   this.dropDownMenu('budgetingWants')
  //   }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.innerWidth <= 991) {
      // console.log(this.budgetStatusBar.nativeElement.getBoundingClientRect().top);

      if (this.budgetStatusBar.nativeElement.getBoundingClientRect().top < 153) {
        this.fixedElement = true;
      } else {
        this.fixedElement = false;
      }
    }
  }


  //#SAVE FORM
  saveForm(event) {
    event?.stopPropagation();
    this.budgetingForm.markAllAsTouched();
    console.log(this.budgetingForm.value, "basicInfo", this.budgetingForm.valid);
    if (this.budgetingForm.valid) {
      this.saveBudgetInfo();
    }
  }

  saveBudgetInfo() {
    let b = this.budgetingForm.value;
    this.loading = true;
    this.service.saveBudgetInfo({
      household: b.HouseholdBudget || false,
      transport: b.TransportBudget || false,
      rent: b.RentBudget || false,
      loan: b.LoanBudget || false,
      personal: b.PersonalCareBudget || false,
      entertainment: b.EntertainmentBudget || false,
      food: b.EatingOutBudget || false,
    }).subscribe({
      next: (q) => {
        console.log(q);
        this.quizService.setQuiz(q.answer);
        this.loading = false;
        this._router.navigate(['/details/risk-management']);
      },
      error: (err) => {
        this.loading = false;
        console.log("[ERROR] saving budget info");
      }
    })
  }
}
