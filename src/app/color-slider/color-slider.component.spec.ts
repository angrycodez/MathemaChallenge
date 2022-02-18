import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have color selected', () => {
      expect(component.getSelectedColor).toBeTruthy()
    })

    it('color should be changable by moving slider', ()=>{
      expect(component.sliderPosition).toBeLessThan(0.5)
      let color = component.getSelectedColor()
      component.moveSlider(component.color_slider_element.nativeElement.clientWidth) // drag the slider to the right
      expect(component.getSelectedColor()).not.toEqual(color)
    })

    it('slider should always stay in legit range', ()=>{
      expect(component.sliderPosition).toBeGreaterThanOrEqual(0)
      expect(component.sliderPosition).toBeLessThanOrEqual(1)
      component.moveSlider(-100) // drag the slider way out of the screen (to the left)
      expect(component.sliderPosition).toEqual(0)
      component.moveSlider(9999) // drag the slider way out of the screen (to the right)
      expect(component.sliderPosition).toEqual(1)
    })

    it('should be able to initialize a new set of colors',()=>{
      let initial_colors = component.colors
      let initial_weights = component.color_weights
      let new_colors = ['#000000','#ffffff']
      let new_weights = [1,1]
      component.setColors(new_colors, new_weights)
      expect(component.colors).toEqual(new_colors)
      expect(component.colors).not.toEqual(initial_colors)
      expect(component.color_weights).toEqual(new_weights)
      expect(component.color_weights).not.toEqual(initial_weights)

      // test with bad input
      new_weights = [1]
      let successfully_called_method_with_bad_input
      try {
        component.setColors(new_colors, new_weights)
        successfully_called_method_with_bad_input = true
      }catch (Error){
        successfully_called_method_with_bad_input = false
      }
      expect(successfully_called_method_with_bad_input).toBeFalse()


    })

    it('should be able to initialize the colors randomly. bad inputs should not affect the current state', ()=>{
      let initial_number_of_colors = component.colors.length
      component.setRandomColorsAndWeights(-2)
      expect(component.colors.length).toEqual(initial_number_of_colors)
      component.setRandomColorsAndWeights(5)
      expect(component.colors.length).toEqual(5)
      component.setRandomColorsAndWeights(20)
      expect(component.colors.length).toEqual(20)
      component.setRandomColorsAndWeights(-2)
      expect(component.colors.length).toEqual(20)
      component.setRandomColorsAndWeights(0)
      expect(component.colors.length).toEqual(20)
    })

    it('should be able to invert colors to display text on colored background with high contrast', ()=>{
        expect(component.getSelectedColor()).toEqual('#ff0000')
        expect(component.getInverseColor()).toEqual('#00ffff')
    })

  it('should add correct padding to hex number strings',()=>{
    let a = 0xff.toString(16)
    expect(component.padZeros(a, 2)).toEqual('ff')

    let b = 0xf.toString(16)
    expect(component.padZeros(b, 2)).toEqual('0f')

    let c = 0xfff.toString(16)
    expect(component.padZeros(c, 2)).toEqual('fff')

    expect(component.padZeros('z', -2)).toEqual('z')
    expect(component.padZeros('0xf', 2)).toEqual('0f')
    expect(component.padZeros('#42', 2)).toEqual('42')
  })

  it('should transform normalized slider position to css style', function () {
    let slider_component_element = component.color_slider_element.nativeElement
    component.moveSlider(slider_component_element.offsetLeft)
    expect(component.sliderPosition).toEqual(0)
    expect(component.sliderPositionToCssValue()).toEqual('-50%')

    component.moveSlider(slider_component_element.offsetLeft + slider_component_element.offsetWidth)
    expect(component.sliderPosition).toEqual(1)
    expect(component.sliderPositionToCssValue()).toEqual('50%')

    component.moveSlider(slider_component_element.offsetLeft + slider_component_element.offsetWidth/2)
    expect(component.sliderPosition).toEqual(0.5)
    expect(component.sliderPositionToCssValue()).toEqual('0%')

  });


});
