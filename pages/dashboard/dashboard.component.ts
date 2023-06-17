import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { Constants } from './dashboard-constant';
// import Swal from 'sweetalert2';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import Swal from 'sweetalert2';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
import { LoaderService } from 'src/app/@core/broadcaster/loader.service';
import { ShareQuizDataService } from '../share-quiz-data.service';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public _constant = new Constants().constant;
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  @ViewChild('backContent', { static: true }) backContent: ElementRef;
  @ViewChild('child1', { static: true }) child1: ElementRef;
  @ViewChild('child2', { static: true }) child2: ElementRef;

  vouchers = this._constant.vouchers;
  confirmModel: boolean = false;
  scratchModel: boolean = false;
  vi: number = -1; //voucher Index

  count: number = 0;

  /* ===#FORM=== */
  userDetailsForm = this._formBuilder.group({
    UserName: ['', [Validators.required, this.validateName]],
    UserEmail: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    UserPhoneNumber: ['', [Validators.required, Validators.min(2)]],
  })

  constructor(private renderer: Renderer2,private pageLoader: LoaderService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private service: ReportService,
    private quizService: ShareQuizDataService) {}

  ngOnInit(): void {
    this.openModel();
    this.scratchMe();

    this.service.getQuizInfo()
    .subscribe({
      next: (deatils) => {
      this.userDetailsForm.setValue({
        UserName: deatils?.answer?.customer,
        UserEmail:deatils?.answer?.email,
        UserPhoneNumber:deatils?.answer?.phone
      })


    this.pageLoader.pageLoader.emit({ showLoader: false });
    
      },
      error: (e) => {
        this.router.navigate(['/error']);
        // alert("PLEASE ENSURE YOU HAVE ADDED THE CORRECT ID ELSE THE FORMS WILL NOT WORK AS EXPECTED");
      }
    })

  }


  /* ====#GET METHOD=== */
  get userName(){
    return this.userDetailsForm.get('UserName')
  }
  get userEmail(){
    return this.userDetailsForm.get('UserEmail')
  }
  get userPhoneNumber(){
    return this.userDetailsForm.get('UserPhoneNumber')
  }

  /* ===#VALIDATION=== */
  validateName(control: FormControl) {
    const name = control.value;
    let regexp = /^[^-\s][a-zA-Z_'\s-]+$/;
    if (!regexp.test(name)) {
      return { name: true };
    } else return null;
  }

  factsSlider = {
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    dots: true,
    infinite: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 99999,
        settings: 'unslick',
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // @HostListener('window:load', ['$event'])
  // onPageLoad(event: Event) {
  //   // console.log('loaded', event);
  //   this.pageLoader.pageLoader.emit({ showLoader: false });
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 991) {
      !this.slickModal['el'].nativeElement.classList.contains(
        'slick-initialized'
      ) && this.slickModal.initSlick();
    }
  }
  // /assets/images/headers/details.png
  scratchMe() {
    const scContainer = this.child1.nativeElement;
    const scInfos = this.child2.nativeElement;
    const sc = new ScratchCard('#js--sc--container', {
      scratchType: SCRATCH_TYPE.CIRCLE,
      containerWidth: scContainer.offsetWidth,
      containerHeight: 200,
      imageForwardSrc: '/assets/images/vouchers/scratchCard/scretch.png',
      imageBackgroundSrc: '',
      htmlBackground: '',
      clearZoneRadius: 20,
      nPoints: 0,
      pointSize: 0,
      callback: () => {
        this.vouchersDetails1(this.vi);
        this.vouchers[0].hideCanvas = true;
        console.log("hidecanvas", this.vouchers);
      },
    });

    // Init
    sc.init()
      .then(() => {
        sc.canvas.addEventListener('scratch.move', () => {
          let percent = sc.getPercent().toFixed(0);
          scInfos.innerHTML = percent + '%';
          console.log(percent);
        });
      })
      .catch((error) => {
        // image not loaded
        alert(error.message);
      });
  }

  openModel() {
    this.confirmModel = true;
    this.renderer.addClass(document.documentElement, 'modal-open');
  }


  closeModel() {
    this.confirmModel = false;
    this.renderer.removeClass(document.documentElement, 'modal-open');
  }
  closeScratchModel() {
    this.scratchModel = false;
    this.renderer.removeClass(document.documentElement, 'modal-open');
  }

  scratchOpen(idx: number) {
    // this.scratchMe();
    if(this.count == 0){
      this.vi = idx;
      this.scratchModel = true;
      this.renderer.addClass(document.documentElement, 'modal-open');
      this.count++;
    }
   else
      this.vouchersDetails(0);
    
    
  }
  scratchClose() {
    this.scratchModel = false;
    this.renderer.removeClass(document.documentElement, 'modal-open');
  }

  vouchersDetails1(i: number) {
    console.log(this.vouchers, i);
    let voucher = this.vouchers[i];
    if (!voucher) {
      return;
    }
    this.closeScratchModel();
// <button class="redeem-btn">Redeem after the test</button>
    Swal.fire({
      html: `<div class="vouchers-box vouchers-box-details position-relative">
      
      <img class="img-fluid confittiElement" src="/assets/images/confetti-new.gif" alt="con">
                        <div class="vouchers-box__content-wrapper position-relative">
                        
                            <div class="vouchers-box__content ">

                           
                            <h4 class="vouchers-box__header-title">
                            Congrats! 
                          </h4>

                                <div class="vouchers-box__logo-wrapper">
                                    <img class="vouchers-box__logo" src="/assets/images/vouchers/${voucher.logo}.svg"
                                        alt="${voucher.logo}">
                                   
                                </div>
                                <p class="vouchers-box__sub-text">${voucher.subText}</p>
                                <h4 class="vouchers-box__text-popup">${voucher.popupText}</h4>
                                <div class="voucher-details--mod">
                                <h5 class="vouchers-box__coupon-details">${voucher.detailstitle}</h5>

                                <ul class="vouchers-box__coupon-details--text">
                                  <li> This coupon can be redeemed only on purchasing insurance/plans from Finergy or its agents.</li>
                                  <li> Once redeemed, the cashback will be sent to your account via UPI within 24 hours.</li>
                                  <li>You cannot change or refund purchases made using this voucher. </li>
                                  <li> Valid for one-time use only.</li>
                                </ul>

                                <h5 class="vouchers-box__coupon-details">${voucher.noteText}</h5>
                                </div>
                                 <div class="vouchers-box__footer height-25">
                                 
                                </div>
                            </div>
                        </div>
                    </div>`,
      showConfirmButton: false,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: 'Redeem after the test',
      cancelButtonColor: '#ffd266',
      buttonsStyling: false,
      customClass: {
        container: 'voucher-popup',
        closeButton: 'afterTest'
      },
      didOpen: () => {
        let confittiElement: any =
          Swal.getHtmlContainer()?.querySelector('.confittiElement');
        setTimeout(() => {
          confittiElement.classList.add('hideAnimation');
        }, 1500);
      },
    });
  }
  vouchersDetails(voucherss: any) {
    // this.closeModel();
    let voucher = this.vouchers[voucherss];
    Swal.fire({
      html: `<div class="vouchers-box vouchers-box-details position-relative">
                        <div class="vouchers-box__content-wrapper position-relative">
                        
                            <div class="vouchers-box__content ">

                           

                                <div class="vouchers-box__logo-wrapper">
                                    <img class="vouchers-box__logo" src="/assets/images/vouchers/${voucher.logo}.svg"
                                        alt="${voucher.logo}">
                                   
                                </div>
                                <p class="vouchers-box__sub-text">${voucher.subText}</p>
                                <h4 class="vouchers-box__text-popup">${voucher.popupText}</h4>


                                <div class="voucher-details--mod">
                                <h5 class="vouchers-box__coupon-details">${voucher.detailstitle}</h5>

                                <ul class="vouchers-box__coupon-details--text">
                                  <li> This coupon can be redeemed only on purchasing insurance/plans from Finergy or its agents.</li>
                                  <li> Once redeemed, the cashback will be sent to your account via UPI within 24 hours.</li>
                                  <li>You cannot change or refund purchases made using this voucher. </li>
                                  <li> Valid for one-time use only.</li>
                                </ul>
                                </div>
                                 <div class="vouchers-box__footer">
                                   
                                 <button class="redeem-btn">Redeem Now</button>

                                </div>
                            </div>
                            </div>
                        </div>
                    </div>`,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        container: 'voucher-popup',
      },
      didOpen: () => {
        let confittiElement: any =
          Swal.getHtmlContainer()?.querySelector('.confittiElement');
        setTimeout(() => {
          confittiElement.classList.add('hideAnimation');
        }, 1500);
      },
    });
  }

  submitDetails(event){
    
event?.stopPropagation()
console.log(this.userDetailsForm);
this.closeModel()
if(this.userDetailsForm.valid){
this.userDetailsForm.markAllAsTouched();
this.closeModel()
}
  }
}
