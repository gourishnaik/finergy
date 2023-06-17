import { Component, ElementRef, HostBinding, OnInit, ViewChild, } from '@angular/core';
import { Constants } from './goals-info-constant';
import { FormBuilder, Validators, FormControl, FormArray, FormGroup, } from '@angular/forms';
import { scrollTo } from 'src/app/@core/modules';
import { FEES, FutureValueInflation, FutureValueHoliday, FutureValueLoan } from 'src/app/helpers';
import { Router } from '@angular/router';
import { ReportService } from '../../report.service';
import { ShareQuizDataService } from '../../share-quiz-data.service';
import { trigger, transition, state, style, animate } from '@angular/animations';



interface IFormContent {
  [k: string]: {
    title: string,
    svg: string,
    stat: string,
    text: string
  }
}

interface IKid {
  yearsLeft: number,
  age: number,
  profession: string,
  normal: number,
  premier: number
}
@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
  animations: [
    trigger('move', [
      transition(':increment', [style({ transform: 'scale(0.8)' }), animate('600ms ease', style({ transform: 'scale(1.3)' }))]),
      transition(':decrement', [style({ transform: 'scale(0.8)' }), animate('600ms ease', style({ transform: 'scale(1.3)' }))]),
      // transition(':increment', [style({ transform: 'scale(0.5)' }), animate('1s ease', style({ transform: 'scale(1)' }))]),
    ])
  ],
})

export class GoalsComponent implements OnInit {
  @ViewChild('goalVectors', { static: true }) goalVectors: ElementRef;
  collapse: boolean = false;
  //  hide: boolean = false;
  formContent: IFormContent = {
    "retirement": {
      title: "Build fund for retirement",
      svg: "money.svg",
      stat: "80%",
      text: "of urban Indians are not ready for retirement"
    },
    "trip": {
      title: "Trip abroad with family",
      svg: "aeroplane.svg",
      stat: "32%",
      text: "of travellers get into credit card debts when they travel abroad for a holiday"
    },
    "child-education": {
      title: "Invest in child’s education",
      svg: "student.svg",
      stat: "40%",
      text: "of parents use their retirement fund for funding their children’s education"
    },
    "loan-free": {
      title: "Pay off loans",
      svg: "creditcard.svg",
      stat: "26%",
      text: "of Indians say they have more debt than before the pandemic"
    },
    "earn-rent": {
      title: "Generate rental income",
      svg: "money-bag.svg",
      stat: "14%",
      text: "of self-employed and salaried people have a source of rental income"
    },
    "marriage": {
      title: "Save for marriage",
      svg: "marriage.svg",
      stat: "25%",
      text: "of Millennials say that they want to save to fund their own wedding expenses"
    }
  }
  public _constant = new Constants().constant;

  futureGoalsList = this._constant.futureGoals;
  educationDegree = this._constant.eductionDegree;
  retirementAge = this._constant.retirementAge;
  childsAge = this._constant.childsAge;
  // travelCost = this._constant.travelCost;
  travelCost: { min: number, max: number }[] = this._constant.travelCostRanges;



  avgRetAge = 60;
  currentYear = new Date().getFullYear();
  BIRTHDATE: string = '';
  kidCount: number = 0;


  retGoalInfo: FormGroup = this._formBuilder.group({
    age: new FormControl<number | null>(null, [Validators.required, Validators.max(99), Validators.maxLength(2)]),
    yearsLeft: new FormControl<number | null>(null, [Validators.required]),
    current: new FormControl<number | null>(null, [Validators.required, Validators.min(1000), Validators.max(10000000)]),
    future: new FormControl<number | null>(0),
  });


  tripGoalInfo: FormGroup = this._formBuilder.group({
    yearsLeft: new FormControl<number | null>(null,),
    year: new FormControl<number | null>(null, [Validators.required, Validators.min(this.currentYear), Validators.max(this.currentYear + 10)]),
    // current: new FormControl<{ min: number, max: number }>({ min: 0, max: 0 }, [Validators.required]),
    current: this._formBuilder.group({
      min: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      max: new FormControl<number>(0, [Validators.required])

    }),

    future: new FormControl<{ min: number, max: number }>({ min: 0, max: 0 }),
  });

  ;

  kidGoalInfo: FormGroup = this._formBuilder.group({
    insurance: new FormControl<boolean | null>(null, [Validators.required]),
    kids: this._formBuilder.array<{ yearsLeft: number, age: number, profession: string, normal: number, premier: 0 }>([], [Validators.required])
  });

  loanGoalInfo: FormGroup = this._formBuilder.group({
    yearsLeft: new FormControl<number | null>(null),
    year: new FormControl<number | null>(null, [Validators.required, Validators.min(this.currentYear + 1), Validators.max(this.currentYear + 30)]),
    current: new FormControl<number | null>(null, [Validators.required, Validators.min(1000), Validators.max(10000000)]),
    future: new FormControl<number | null>(null),
  });

  rentGoalInfo: FormGroup = this._formBuilder.group({
    yearsLeft: new FormControl<number | null>(null),
    year: new FormControl<number | null>(null, [Validators.required, Validators.min(this.currentYear + 1), Validators.max(this.currentYear + 30)]),
    current: new FormControl<number | null>(null, [Validators.required, Validators.min(10000), Validators.max(1000000)]),
    future: new FormControl<number | null>(null),
  });

  marriageGoalInfo: FormGroup = this._formBuilder.group({
    yearsLeft: new FormControl<number | null>(null),
    year: new FormControl<number | null>(null, [Validators.required, Validators.min(this.currentYear), Validators.max(this.currentYear + 15), Validators.maxLength(4)]),
    current: new FormControl<number | null>(400000, [Validators.required]),
    future: new FormControl<number | null>(null),
  });


  goals = this._formBuilder.group({
    FutureGoals: this._formBuilder.array(
      [],
      [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
    ),
  });

  loading: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService
  ) { }


  ngOnInit(): void {
    scrollTo('.scrollStart');

    // this.calcExpectedAmount();
    // this.calcExpectedTripCost();
    // this.calcEducationCost();
    // this.calcLoanCost();
    // this.calcRentCost();
    // this.calcMarriageCost();

    this.quizService.castQuiz.subscribe({
      next: (q) => {
        // console.log("QUIZzzzzZZZzzz Goal", q, q?.goals, q?.goal_meta);

        if (!q) {
          return;
        }
        if (q && q.basic && Object.keys(q.basic).length == 0) {
          //TODO add redirect to basic
          //  console.log("I should redirect")
          return;
        }
        // this.Dob = q?.basic.birthDate;
        if (!q.basic.kidCount) {
          this.futureGoalsList = this._constant.futureGoals.filter(fg => fg.value !== 'child-education');
        }
        this.BIRTHDATE = q.basic.birthDate;
        let birth_year = Number(this.BIRTHDATE.split("-")[2]);
        let age = this.currentYear - birth_year;
        // console.log("my age is", age)
        this.retGoalInfo.controls['age'].addValidators(Validators.min(age + 1));


        this.kidCount = q.basic.kidCount;
        if (this.kidCount > 0 && q.goals.length == 0) {
          this.resetKidsForm();
        }



        if (!q || !q.goal_meta || Object.keys(q.goal_meta).length == 0) {
          return;
        }

        console.log('goal_meta-------', q.goal_meta);
        for (let meta in q.goal_meta) {
          let info = q.goal_meta[meta];
          console.log('meta-------', meta);

          switch (meta) {
            case "retirement":
              this.retGoalInfo.setValue({
                age: info?.age || null,
                yearsLeft: info?.yearsLeft || null,
                current: info?.current || null,
                future: info?.future || null
              });

              break;
            case "trip":
              this.tripGoalInfo.setValue({
                yearsLeft: info?.yearsLeft || null,
                year: info?.year || null,
                current: info?.current || { min: 0, max: 0 },
                future: info?.current || { min: 0, max: 0 },
              });

              break;
            case "child-education":
              this.kidGoalInfo.reset();
              // this.kidGoalInfo.setValue({
              //   insurance: info.insurance || false,
              //   kids: []
              // });
              this.kidGoalInfo.patchValue({ insurance: info.insurance || false })
              let count = info.kids.length || 0;
              if (count > 0) {
                for (let i = 0; i < count; i++) {
                  this.kids.push(this.createKidForm());
                }
                for (let i = 0; i < count; i++) {
                  this.kids.at(i).setValue(info.kids[i])
                }
              }

              break;
            case "loan-free":
              this.loanGoalInfo.setValue({
                year: info?.year || 0,
                yearsLeft: info?.yearsLeft || 0,
                current: info?.current || 0,
                future: info?.future || 0
              });

              break;
            case "earn-rent":
              this.rentGoalInfo.setValue({
                year: info?.year || null,
                yearsLeft: info?.yearsLeft || null,
                current: info?.current || null,
                future: info?.future || null
              });
              break;
            case "marriage":
              this.marriageGoalInfo.setValue({
                year: info?.year || null,
                yearsLeft: info?.yearsLeft || null,
                current: info?.current || null,
                future: info?.future || null
              });
              break;
            default:
              console.error("ain't no goal like this yo!!")
          }
        }


        // this.onRetYearChanged();


        // this.futureGoals.setValue(q.goals);
        this.goals.patchValue({ 'FutureGoals': q.goals });
        for (let g of q.goals) {
          this.futureGoals.push(new FormControl(g));
        }

        for (let fg of this.futureGoalsList) {
          fg.isSelected = q.goals.includes(fg.value);
        }
      }
    });

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



  checkActiveDropDown(key) {
    return this.activeDropDowns.includes(key);
  }

  closeDropDown(key) {
    return (this.activeDropDowns = this.activeDropDowns.filter((item) => {
      return item !== key;
    }));

  }
  /* =======#GET METHODS======== */
  get futureGoals(): FormArray {
    return this.goals.get('FutureGoals') as FormArray;
  }

  get retirementcurrent() {
    return this.retGoalInfo.get('current');
  }

  get retireage() {
    return this.retGoalInfo.get('age');
  }

  get tripstart() {
    return this.tripGoalInfo.get('year');
  }

  get loanpayyear() {
    return this.loanGoalInfo.get('year')
  }

  get loanpayamount() {
    return this.loanGoalInfo.get('current')
  }

  get marriagesaving() {
    return this.marriageGoalInfo.get('year')
  }
  get renttargetyear() {
    return this.rentGoalInfo.get('year')
  }
  get rentincome() {
    return this.rentGoalInfo.get('current')
  }
  get tripamount() {
    return this.tripGoalInfo.get('current') as FormGroup;
  }
  get childsplan() {
    return this.kidGoalInfo.get('insurance')
  }

  goalsSelected(event, goal) {

    if (event) {
      event.stopPropagation();
    }
    if (event.target.checked) {
      let sel = this.futureGoalsList.filter(fg => fg.isSelected)
      if (sel.length == 2) {
        for (let s of sel) {
          s.isSelected = false;
        }
        this.futureGoals.clear();
      }
      goal.isSelected = true;
      this.futureGoals.push(new FormControl(goal.value));
      if (goal.value == "child-education") {
        this.resetKidsForm();
      }
      return;
    } else {
      goal.isSelected = false;
      let index = this.futureGoals.value.findIndex(eachvalue => eachvalue == goal.value);
      this.futureGoals.removeAt(index)
      return;
    }
  }


  // goalsSelected(event, goal) { }


  saveGoals(event: Event) {

    if (event) {
      event.stopPropagation();
      //this.collapse = !this.collapse;

      if (this.futureGoals.valid) {
        this.collapse = true;
        scrollTo('.box',-160);
      }
      else {
        this.collapse = false;
      }




    }
    this.goals.markAllAsTouched();






  }

  onMonthlyExpChanged() {
    this.calcExpectedAmount();
  }


  onRetYearChanged() {
    let birth_year = Number(this.BIRTHDATE.split("-")[2]);
    let age = this.currentYear - birth_year;

    let retAge = this.retGoalInfo.value['age'];
    if (age < retAge) {
      this.retGoalInfo.patchValue({ yearsLeft: retAge - age });
      this.calcExpectedAmount();
    }
  }

  calcExpectedAmount() {
    let yearsLeft = this.retGoalInfo.value['yearsLeft'];
    if (!yearsLeft) {
      this.onRetYearChanged();
      return;
    }
    this.retGoalInfo.patchValue({ future: FutureValueInflation(this.retGoalInfo.value['current'], yearsLeft) });
  }

  calcExpectedTripCost() {
    let range = this.tripGoalInfo.value['current'];
    let yearsLeft = this.tripGoalInfo.value['yearsLeft'];
    this.tripGoalInfo.patchValue({
      future: {
        min: FutureValueHoliday(range.min, yearsLeft),
        max: FutureValueHoliday(range.max, yearsLeft),
      }
    });

  }

  selectedTripRange(range: { min: number, max: number }) {
    this.tripGoalInfo.patchValue({ current: range })
    this.calcExpectedTripCost();
  }


  // dropDownSelected(value, control){
  //   console.log(control,"control");
  //   control.patchValue({ year: value });
  //   let year = this.tripGoalInfo.value['year'];
  //   control.patchValue({ yearsLeft: year - this.currentYear });
  // }


  onTripYearChange(value) {
    this.tripGoalInfo.patchValue({ year: value });
    let year = this.tripGoalInfo.value['year'];
    // if (this.currentYear > year) {
    //   return;
    // }
    this.tripGoalInfo.patchValue({ yearsLeft: year - this.currentYear });
    this.calcExpectedTripCost();
  }

  calcEducationCost() {
    for (let kidIdx in this.kids.controls) {
      this.calcPerKidCost(Number(kidIdx));
    }
  }

  calcPerKidCost(idx: number) {
    let kid: FormGroup = this.kids.at(idx) as FormGroup;
    let prof = kid.value['profession'], age = kid.value['age'], yearsLeft = 0;
    if (prof == 'mba' || prof == 'ca') {
      yearsLeft = 20 - age;
    } else {
      yearsLeft = 17 - age;

    }
    kid.patchValue({ yearsLeft: yearsLeft });
    kid.patchValue({ normal: FutureValueInflation(FEES[prof].normal, yearsLeft) });
    kid.patchValue({ premier: FutureValueInflation(FEES[prof].premier, yearsLeft) });
  }


  calcLoanCost() {
    let curr = this.loanGoalInfo.value['current'];
    let yearsLeft = this.loanGoalInfo.value['yearsLeft'] || 0;
    this.loanGoalInfo.patchValue({ future: FutureValueLoan(curr, yearsLeft) });
  }

  onLoanAmountChange() {
    this.calcLoanCost();
  }



  onLoanYearChange(value) {
    this.loanGoalInfo.patchValue({ year: value });
    let year = value || this.currentYear + 1;
    console.log(year, typeof year)
    if (this.currentYear > year) {
      return;
    }
    this.loanGoalInfo.patchValue({ yearsLeft: (year - this.currentYear) });
    this.calcLoanCost();
  }

  calcMarriageCost() {
    let curr = this.marriageGoalInfo.value['current'];
    let yearsLeft = this.marriageGoalInfo.value['yearsLeft'];
    this.marriageGoalInfo.patchValue({ future: FutureValueInflation(curr, yearsLeft) });
  }

  selectKidDegree(degree: string, index: number) {
    this.kids.at(index).patchValue({ profession: degree.toLowerCase() });
    // formArray.at(index).patchValue({ profession: degree.toLowerCase() });
    this.calcPerKidCost(index);
  }

  onKidAgeChange(i: number, age: number) {
    this.kids.at(i).patchValue({ age: age });

    this.calcPerKidCost(i);
    //  console.log("age is" + i)
  }

  expectedRentChange() {
    this.calcRentCost();

  }




  onRentTargetChange(value) {
    this.rentGoalInfo.patchValue({ year: value });
    this.calcRentCost();
  }

  calcRentCost() {
    let curr = this.rentGoalInfo.value['current'];
    let x = (curr * 100 / 6) * 12
    let yl = this.rentGoalInfo.value['year'] - this.currentYear;
    this.rentGoalInfo.patchValue({ yearsLeft: yl });
    this.rentGoalInfo.patchValue({ future: FutureValueInflation(x, yl) })
  }



  saveGoalMeta() {

    let valid: boolean[] = [this.futureGoals.valid];
    let goal_meta = {};
    for (let goal of this.futureGoals.value) {
      switch (goal) {
        case "retirement":
          console.log(this.retGoalInfo.valid, goal);
          this.retGoalInfo.markAllAsTouched();
          valid.push(this.retGoalInfo.valid);
          goal_meta[goal] = this.retGoalInfo.value;
          break;
        case "trip":
          console.log(this.tripGoalInfo.valid, goal);
          this.tripGoalInfo.markAllAsTouched();

          valid.push(this.tripGoalInfo.valid);
          goal_meta[goal] = this.tripGoalInfo.value;
          break;
        case "child-education":
          console.log(this.kidGoalInfo.valid, goal);
          this.kidGoalInfo.markAllAsTouched();

          valid.push(this.kidGoalInfo.valid);
          goal_meta[goal] = this.kidGoalInfo.value;
          break;
        case "loan-free":
          console.log(this.loanGoalInfo.valid, goal);
          this.loanGoalInfo.markAllAsTouched();

          valid.push(this.loanGoalInfo.valid);
          goal_meta[goal] = this.loanGoalInfo.value;
          break;
        case "earn-rent":
          console.log(this.rentGoalInfo.valid, goal);
          this.rentGoalInfo.markAllAsTouched();

          valid.push(this.rentGoalInfo.valid);
          goal_meta[goal] = this.rentGoalInfo.value;
          break;
        case "marriage":
          console.log(this.marriageGoalInfo.valid, goal);
          this.marriageGoalInfo.markAllAsTouched();
          valid.push(this.marriageGoalInfo.valid);
          goal_meta[goal] = this.marriageGoalInfo.value;
          break;
        default:
          console.error("ain't no goal like this yo!!")
      }

    }
    if (valid.filter(v => !!v).length == 3) {
      this.loading = true;
      this.service.saveGoalInfo(this.futureGoals.value, goal_meta)
        .subscribe({
          next: (q) => {
            this.quizService.setQuiz(q.answer);
            this.loading = false;
            this.router.navigate(['/details/budgeting']);
          },
          error: (err) => {
            this.loading = false;
            console.log("[ERROR] saving goal info");
          }
        })
    }
  }


  get kids() {
    return this.kidGoalInfo.controls["kids"] as FormArray;
  }

  createKidForm(): FormGroup {
    return this._formBuilder.group({
      yearsLeft: [0, Validators.required],
      age: [null, Validators.required],
      profession: ['', Validators.required],
      normal: [0, Validators.required],
      premier: [null, Validators.required],
    })
  }

  resetKidsForm() {
    console.log("IM IN RESETKIDS")
    this.kids.clear();
    let kidCount = this.kidCount;
    for (let i = 0; i < kidCount; i++) {
      this.kids.push(this.createKidForm());
    }
    // this.calcEducationCost();
  }

  toggleGoalsList() {

    if (this.collapse) {
      this.collapse = false;
    }

  }


  onMarriageYearChange(value) {

    this.marriageGoalInfo.patchValue({ year: value });
    let year = this.marriageGoalInfo.value['year']
    if (this.currentYear > year) {
      return;
    }

    this.marriageGoalInfo.patchValue({ yearsLeft: year - this.currentYear });
    this.calcMarriageCost();
  }


  scrollDone(){
    scrollTo('.scrollDone',230);
    scrollTo('.scrollDoneNext',230);
  }

  scrollMonth(event){
    event?.stopPropagation();
    scrollTo('.retAge');
  }
  scrollAge(event){
    event?.stopPropagation();
    scrollTo('.expYear');
  }
  scrollPrincipal(event){
    event?.stopPropagation();
    scrollTo('.principal');
  }
  scrollRental(event){
    event?.stopPropagation();
    scrollTo('.rentalInc');
  }

}



