import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from './wealth-management-constant';
import { scrollTo } from 'src/app/@core/modules';
import { ReportService } from '../../report.service';
import { ShareQuizDataService } from '../../share-quiz-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wealth-management',
  templateUrl: './wealth-management.component.html',
  styleUrls: ['./wealth-management.component.scss']
})
export class WealthManagementComponent implements OnInit, OnDestroy {
  @ViewChild('wealthGraph', { static: true }) wealthGraph: ElementRef;

  public _constant = new Constants().constant;

  assetsTypeOptions = this._constant.assets

  wealthManagementForm = this._formBuilder.group({
    MonthlySaving: new FormControl<boolean | null>(null, [Validators.required]),
    SipInvestmet: new FormControl<boolean | null>(null, [Validators.required]),
    PpfInvestent: new FormControl<boolean | null>(null, [Validators.required]),
    OwnedAssets: this._formBuilder.array<string[]>([], [Validators.required, Validators.minLength(1)]),
    ExistingSource: new FormControl<boolean | null>(null, [Validators.required]),

  })

  savings: number = 0;
  sip: number = 0;
  nps: number = 0;

  //emojitext: boolean = true;

  loading: boolean = false;
  subscription: Subscription;
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService
  ) { }

  ngOnInit(): void {
    console.log("wealthManagementForm", this.wealthManagementForm.dirty);

    scrollTo('.scrollStart');
    this.subscription = this.quizService.castQuiz.subscribe({
      next: (q) => {
        console.log("in castService")
        if (!q || !q.basic || Object.keys(q.basic).length == 0) {
          return;
        }
        let inc = q.basic.familyIncome;
        this.savings = inc * .15;
        this.sip = inc * .05;
        this.nps = inc * .06;

        if (!q || !q.wealth || Object.keys(q.wealth).length < 1) {
          return;
        }




        this.wealthManagementForm.reset();
        this.wealthManagementForm.patchValue({
          MonthlySaving: q.wealth.monthly || false,
          SipInvestmet: q.wealth.sip || false,
          PpfInvestent: q.wealth.ppf || false,
          ExistingSource: q.wealth?.rent || false,
          OwnedAssets: []
        });
        this.wealthManagementForm.controls.OwnedAssets.clear();
        let assetArr: FormArray = this.ownedAssets;

        if (q.wealth?.assets && q.wealth.assets.length > 0) {
          for (let _asset of q.wealth.assets) {
            assetArr.push(new FormControl(_asset));
          }
          this.assetsTypeOptions.forEach(atype => {
            atype.isSelected = q.wealth.assets.includes(atype.value)
          })
        } else {
          assetArr.push(new FormControl("None"));
          this.assetsTypeOptions[this.assetsTypeOptions.length - 1].isSelected = true;
        }
        this.wealthManagementForm.markAsTouched();
        this.wealthManagementForm.markAsDirty();

        this.calulatePercentage(event)
      }
    });


  }



  /* =======#GET METHODS======== */
  get monthlySaving() {
    return this.wealthManagementForm.get('MonthlySaving');
  }
  get sipInvestmet() {
    return this.wealthManagementForm.get('SipInvestmet');
  }
  get ppfInvestent() {
    return this.wealthManagementForm.get('PpfInvestent');
  }
  get ownedAssets(): FormArray {
    return this.wealthManagementForm.get('OwnedAssets') as FormArray;
  }
  get existingSource() {
    return this.wealthManagementForm.get('ExistingSource');
  }
  /* =======#END GET METHODS======== */

  checkValid(event, control) {
    //this.emojitext = false;
    event?.stopPropagation()
    if (this.wealthManagementForm.get(control)?.valid) {
      scrollTo('.scrollNext', 150)
    }
  }

  assetsSelected(event, asset) {
    if (event) {
      event.stopPropagation();
    }

    this.wealthManagementForm.controls.OwnedAssets.markAsDirty()

    if (asset.value.toLowerCase() == "none") {
      if (event.target.checked) {
        this.assetsTypeOptions.map(obj => {
          if (obj.isSelected == true) {
            obj.isSelected = false
          }
        });
        asset.isSelected = true
        this.ownedAssets.clear()
        this.ownedAssets.push(new FormControl(asset.value));
      } else {
        asset.isSelected = false
        this.ownedAssets.removeAt(this.ownedAssets.controls.indexOf(asset.value));
      }

    } else {
      if (event.target.checked) {
        this.assetsTypeOptions.map(obj => {
          if (obj.value.toLowerCase() == "none") {
            obj.isSelected = false
          }
        });
        asset.isSelected = true
        if (this.ownedAssets.value.includes("None")) {
          this.ownedAssets.clear()
        }
        this.ownedAssets.push(new FormControl(asset.value));
      }
      else {
        asset.isSelected = false
        this.ownedAssets.removeAt(this.ownedAssets.controls.indexOf(asset.value));
      }

    }

    this.calulatePercentage(event)

  }


  percentage = 0;
  percentageEmoji = 0;

  totalQuestions = Object.keys(this.wealthManagementForm.controls).length


  calulatePercentage(event) {

    let step = 14.5; //  16.7
    let stepEmoji = 100;

    this.percentage = 0
    this.percentageEmoji = 0

    let valueObj = this.wealthManagementForm.value;
    let validCount = 0;
    for (let item in valueObj) {
      // console.log(valueObj[item], typeof valueObj[item])
      if (item == 'OwnedAssets') {
        if (valueObj.OwnedAssets && !valueObj.OwnedAssets.includes("None") && valueObj.OwnedAssets.length > 0) {
          this.percentage += step
          this.percentageEmoji += stepEmoji;
          validCount += 1;
          this.percentage = validCount == 1 ? this.percentage + step : this.percentage;
          this.percentageEmoji = validCount == 1 ? this.percentageEmoji + stepEmoji : this.percentageEmoji;
        }
      } else if (typeof valueObj[item] == 'boolean' && valueObj[item]) {
        this.percentage += step
        this.percentageEmoji += stepEmoji;
        validCount += 1;
        this.percentage = validCount == 1 ? this.percentage + step : this.percentage;
        this.percentageEmoji = validCount == 1 ? this.percentageEmoji + stepEmoji : this.percentageEmoji;
      }
    }

    if (!validCount && this.wealthManagementForm.controls.MonthlySaving.valid) {
      this.percentage = step;
      this.percentageEmoji = stepEmoji;
    }
  }

  getDirtyQuestions() {
    let changedProperties: any = [];
    Object.keys(this.wealthManagementForm.controls).forEach((name) => {
      const currentControl = this.wealthManagementForm.controls[name];
      if (currentControl.dirty) {
        changedProperties.push(name);
      }

      // console.log(currentControl, ":", currentControl.dirty);

    });
    // console.log(changedProperties);

    return changedProperties;
  }

  //#SAVE FORM
  saveForm(event) {
    if (event) {
      event.stopPropagation();
    }
    this.wealthManagementForm.markAllAsTouched();
    // console.log(this.wealthManagementForm.value, "wealth management", this.wealthManagementForm.valid);
    if (this.wealthManagementForm.valid) {
      this.updateWealthInfo();
    }
  }

  updateWealthInfo() {
    let w = this.wealthManagementForm.value;
    this.loading = true;
    this.service.saveWealthInfo({
      monthly: w.MonthlySaving || false,
      ppf: w.PpfInvestent || false,
      sip: w.SipInvestmet || false,
      rent: w.ExistingSource || false,
      assets: !w.OwnedAssets || !w.OwnedAssets?.length || w.OwnedAssets?.includes('None') ? [] : <string[]>w.OwnedAssets
    }).subscribe({
      next: (q) => {
        // console.log(q);
        this.quizService.setQuiz(q.answer);
        // this.loading = false;
        this._router.navigate(['/pre-report']);
      },
      error: (err) => {
        // this.loading = false;
        console.log("[ERROR] saving wealth info");
      }
    })
  }

  public fixedElement: boolean = false
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (this.wealthGraph.nativeElement.getBoundingClientRect().top < 153) {
      this.fixedElement = true;
    } else {
      this.fixedElement = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
