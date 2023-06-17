import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/@core/broadcaster/loader.service';
import { NavbarHelperService } from 'src/app/@core/broadcaster/navbar-helper.service';
import { scrollTo } from 'src/app/@core/modules';
import { IBASIC, IBUDGET, IWEALTH } from '../models';
import { ReportService } from '../report.service';

interface IReport {
  finergy: {
    score: number,
    heading: string,
    note: string
  }
  goals: Idata[],
  budget: Idata,
  forms: {
    wealth:IWEALTH,
    budget:IBUDGET,
    basic:IBASIC,
  },
  risk: Idata,
  wealth: Idata
}
interface Idata {
  heading: string,
  score: number,
  note: string,
  amount: number,
  subtext: string,
  comments: { label: string, text: string }[]
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  constructor(private navHelper: NavbarHelperService, private pageLoader: LoaderService, private reportService: ReportService) { 
    this.pageLoader.pageLoader.emit({ showLoader: true });
  }

  habitScore:boolean = false;
  wantsStatus:boolean = false;
  needsStatus:boolean = false;

  report: IReport = {
    finergy: { score: 0, heading: "", note: "" },
    goals: [],
    forms:{
      wealth:{
        monthly: false,
        ppf: false,
        sip: false,
        rent: false,
        assets: []
      },
      budget:{
        household: false,
        transport: false,
        rent: false,
        loan: false,
        personal: false,
        entertainment: false,
        food: false,
      },
      basic:{
        birthDate: '',
        kidCount: 0,
        rented: false,
        familyIncome: 0
      },
    },
    budget: {
      heading: '', score: -1, note: '', amount: 0, subtext: '', comments: []
    },
    risk: {
      heading: '', score: -1, note: '', amount: 0, subtext: '', comments: []
    },
    wealth: {
      heading: '', score: -1, note: '', amount: 0, subtext: '', comments: []
    },


  }


  ngOnInit(): void {
    window.scroll(0, 0);
    // this.navHelper.navbarHelper.emit({ hideNav: true });

    //reports calls
    this.reportService.getPreReport().subscribe((res => {
      console.log(res);
      this.report = res;
      this.checkStatus(this.report.forms)
      this.pageLoader.pageLoader.emit({ showLoader: false });
    }))
  }

  checkStatus(answers){
    let habit = Object.keys(answers.wealth).reduce((value, key) => {
      answers.wealth[key] == true && (value[key] = answers.wealth[key]);
      return value;
    }, {});


    let needs = [answers.budget.rent,answers.budget.household,answers.budget.transport,answers.budget.loan]
    let wants = [answers.budget.personal,answers.budget.entertainment,answers.budget.food]

    let needsScore = needs.filter(x => x == true).length*100 / 4
    let wantsScore = wants.filter(x => x == true).length*100 / 3

    
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
    // console.log(this.activeDropDowns, 'this.activeDropDowns');
    if(key == "goal0"){
      scrollTo('.goal1', 400)
    }
    else if(key == "goal1"){
      scrollTo('.scrollBudget', 400)
    }
    else if(key == "budgetManagement"){
      scrollTo('.scrollRisk', 400)
    }
    else if(key == "riskManagement"){
      scrollTo('.scrollWealth', 410)
    }
    else if(key == "wealthManagement"){
      scrollTo('.scrollNext',400)
    }
    if (this.activeDropDowns.includes(key)) {
      this.activeDropDowns = this.activeDropDowns.filter((item) => {
        return item !== key;
      });
    } else {
      return this.activeDropDowns.push(key);
    }
  }

  // setColor(value) {
  //   return getColor(value);
  // }
  scaleButton: boolean = false;
  scrollbottom(event) {
    event?.stopPropagation();
    scrollTo('.scrollNext');
    this.scaleButton = true;
    setTimeout(() => {
      this.scaleButton = false;
    }, 2000);
  }

  getPdfFile() {
    this.reportService.getReportPDF();
  }
}
