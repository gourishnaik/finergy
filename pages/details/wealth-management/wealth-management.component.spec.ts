import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthManagementComponent } from './wealth-management.component';

describe('WealthManagementComponent', () => {
  let component: WealthManagementComponent;
  let fixture: ComponentFixture<WealthManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WealthManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WealthManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
