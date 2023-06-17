
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/@core/broadcaster/loader.service';
import { scrollTo } from 'src/app/@core/modules';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.scss']
})
export class FinalReportComponent implements OnInit {

  currentYear =  new Date().getFullYear();
  report;
  reportss;
  pageLoaded:boolean = false;
  habitScore:boolean = false; 
  wantsStatus:boolean = false;
  needsStatus:boolean = false;


  constructor(private reportService: ReportService,private pageLoader: LoaderService,) {
    this.pageLoader.pageLoader.emit({ showLoader: true });
   }



  ngOnInit(): void {
    window.scroll(0, 0);
  this.reportService.getReport().subscribe({
    next: (res) => {
      this.report = res;
      this.pageLoader.pageLoader.emit({ showLoader: false }); 
      console.log(this.report);
      this.pageLoaded= true;
      this.checkStatus(this.report.answers)
    },
    error(err) {
      console.log("server error", err)
    },
  });
  }

  //#AUDIT POLICY
  auditPolicy(key , value){
console.log('key:', key ,'value:', value );

  }

  checkStatus(answers){
    let habit = Object.keys(answers.wealth).reduce((value, key) => {
      answers.wealth[key] == true && (value[key] = answers.wealth[key]);
      return value;
    }, {});

    let needs = [answers.budget.rent,answers.budget.household,answers.budget.transport,answers.budget.loan]
    let wants = [answers.budget.personal,answers.budget.entertainment,answers.budget.food]

    let needsScore = needs.filter(x => x == true).length*100 / 4
    let wantsScore = wants.filter(x => x == true).length*100 / 4

    
    if(needsScore >= 70){
      this.needsStatus = true
    }else{
      this.needsStatus = false
    }
    if(wantsScore >= 70){
      this.wantsStatus = true
    }else{
this.wantsStatus = false
    }
    
    let score = Object.keys(habit).length*100 / 4
    if(score>=70){
      this.habitScore = true;
    }else{
      this.habitScore = false; 
    }
  }

  activeDropDowns: any[] = [];
  dropDownMenu(key) {
    console.log(this.activeDropDowns, 'this.activeDropDowns');
    if (this.activeDropDowns.includes(key)) {
      this.activeDropDowns = this.activeDropDowns.filter((item) => {
        return item !== key;
      });
    } else {
      return this.activeDropDowns.push(key);
    }
  }

  scaleButton: boolean = false;
  scrollbottom(event) {
    event?.stopPropagation();
    scrollTo('.scrollNext');
    this.scaleButton = true;
    setTimeout(() => {
      this.scaleButton = false;
    }, 2000);
  }

}
