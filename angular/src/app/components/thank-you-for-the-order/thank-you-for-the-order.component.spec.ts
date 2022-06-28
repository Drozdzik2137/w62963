import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThankYouForTheOrderComponent } from './thank-you-for-the-order.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ThankYouForTheOrderComponent', () => {
  let component: ThankYouForTheOrderComponent;
  let fixture: ComponentFixture<ThankYouForTheOrderComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankYouForTheOrderComponent ],
      imports: [RouterTestingModule],
      providers: [ThankYouForTheOrderComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouForTheOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
