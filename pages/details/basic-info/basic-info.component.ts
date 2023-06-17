import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Constants } from './basic-info-constant';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import Rolldate from '../../../@theme/components/rolldate'
import { scrollTo } from 'src/app/@core/modules';
import { ReportService } from '../../report.service';
import { ShareQuizDataService } from '../../share-quiz-data.service';
import { IBASIC } from '../../models';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  @Output() valueChange = new EventEmitter();

  public _constant = new Constants().constant;

  numberOfKidsOptions = this._constant.numberOfKids
  houseTypeOptions = this._constant.houseType

  birthDateInputs = this._formBuilder.group({
    day: ['', [Validators.required]],
    month: ['', [Validators.required]],
    year: ['', [Validators.required]]
  })

  basicInfoForm = this._formBuilder.group({
    DateOfBirth: ['', [Validators.required, this.validateBirthDate]],
    NumberOfKids: [-1, [Validators.required, Validators.min(0)]],
    HouseType: ['', [Validators.required]],
    TotalFamilyEarning: new FormControl<number | null>(null, [Validators.required, Validators.min(1000), Validators.max(10000000)])
    // TotalFamilyEarning: [0, [Validators.required, Validators.min(1000), Validators.max(10000000)]]

  })

  priorBasicInfo: IBASIC;

  loading: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService
  ) { }


  ngOnInit(): void {
    this.showbirthDateInputsPicker();


    this.quizService.castQuiz.subscribe({
      next: (q) => {

        if (!q || !q.basic || Object.keys(q.basic).length == 0) {
          return;
        }
        this.priorBasicInfo = q.basic;
        this.basicInfoForm.setValue({
          DateOfBirth: q.basic.birthDate,
          NumberOfKids: q.basic.kidCount,
          HouseType: q.basic.rented ? 'Rented' : 'Own',
          TotalFamilyEarning: q.basic.familyIncome
        });
        let split = q.basic.birthDate.split("-");
        this.birthDateInputs.setValue({ day: split[0], month: split[1], year: split[2] });
      }
    });
  }


  showbirthDateInputsPicker() {
    let endYear: any = moment().subtract(18, 'years').format("YYYY");
    let startYear: any = endYear - 60
    new Rolldate({
      el: '#dateOfBirth',
      format: 'DD-MM-YYYY',
      beginYear: startYear,
      endYear: endYear,
      minStep: 1,
      trigger: 'tap',
      confirm: (date) => {
        date = date.split('-');
        console.log(date);

        //#YYYY
        this.birthDateInputs.patchValue({
          year: date[2],
        })
        //#MM
        this.birthDateInputs.patchValue({
          month: date[1],
        })
        //#DD
        this.birthDateInputs.patchValue({
          day: date[0],
        })

        if (this.birthDateInputs.valid) {
          let day: any = this.birthDateInputs.value.day
          let month: any = this.birthDateInputs.value.month
          let year: any = this.birthDateInputs.value.year
          this.basicInfoForm.patchValue({
            DateOfBirth: day + "-" + month + "-" + year
          })
        }
      },
      cancel: () => {
        this.markbirthDateInputsTouched()
      }
    })
  }

  markbirthDateInputsTouched() {
    this.basicInfoForm.controls.DateOfBirth.markAsTouched()
  }

  //#DROPDOWN
  activeDropDowns: any[] = [];
  dropDownMenu(event, key) {
    event?.stopPropagation()
    return (this.activeDropDowns = [key]);
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
  get birthDate() {
    return this.basicInfoForm.get('DateOfBirth');
  }
  get numberOfKids() {
    return this.basicInfoForm.get('NumberOfKids');
  }
  get houseType() {
    return this.basicInfoForm.get('HouseType');
  }
  get totalFamilyEarning() {
    return this.basicInfoForm.get('TotalFamilyEarning');
  }
  /* =======#END GET METHODS======== */


  /* =====#VALIDATIONS===== */
  //BirthDate
  validateBirthDate(control: FormControl) {
    let birthDate = moment(control.value, 'DD-MM-YYYY', true);
    if (birthDate.isValid()) {
  
      scrollTo('.scrollNext', 0)
      return null;
    } else {
      return { invalidBirthDate: true };
    }
  }

  checkValid(event, control) {
    // event?.stopPropagation()
    console.log(this.basicInfoForm.get(control));
    
    if (this.basicInfoForm.get(control)?.valid) {
      scrollTo('.scrollNext', 0)
    }
  }
  /* =====#END VALIDATIONS===== */

  //#SAVE FORM
  saveForm(event) {
    event?.stopPropagation()
    this.basicInfoForm.markAllAsTouched();
    console.log(this.houseType?.errors);
    
    console.log(this.basicInfoForm.errors, "basicInfo", this.basicInfoForm.valid);
    if (this.basicInfoForm.valid) {
      this.saveBasicnfo();
    }
  }



  saveBasicnfo() {
    let bs = this.basicInfoForm.value;
    this.loading = true;
    let basic = {
      birthDate: bs.DateOfBirth || "01-01-1975",
      kidCount: bs.NumberOfKids || 0,
      familyIncome: bs.TotalFamilyEarning || 0,
      rented: bs.HouseType?.toLowerCase() !== 'own' ? true : false,
    };

    if (this.priorBasicInfo &&
      this.priorBasicInfo.birthDate == basic.birthDate &&
      this.priorBasicInfo.familyIncome == basic.familyIncome &&
      this.priorBasicInfo.kidCount == basic.kidCount &&
      this.priorBasicInfo.rented == basic.rented
    ) {
      this.loading = false;
      this._router.navigate(['/details/goals']);
      return;
    }
    this.service.saveBasicInfo(basic).subscribe({
      next: (q) => {
        console.log(q);
        this.quizService.setQuiz(q.answer);
        this.loading = false;
        this._router.navigate(['/details/goals']);
      },
      error: (err) => {
        this.loading = false;
        console.log("[ERROR] saving budget info");
      }
    })



  }


  scrollParent(event){
    event?.stopPropagation();
    scrollTo('.submitButton', 300);
  }

}
