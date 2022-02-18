import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';




@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})

export class ColorSliderComponent implements AfterViewInit{
  colors = ['#ff0000', '#00ff00', '#0000ff', '#9708af', '#012345', '#666420']    // list to store all the colors that should be available in the color picker
  color_weights = [2,1,1,4,2,5]       // weights of the color (how much of the available space each color field takes)
  selectedColor = 0     // index of the currently selected color
  sliderPosition = 0     // the position of the slider, normalized between 0 and 1
  isDragging = false    // if the slider is currently being dragged

  @ViewChild('color_slider') color_slider_element!:ElementRef<HTMLDivElement>;    // reference to the slider component, to compute relative positions etc.

  constructor() {
    if(this.colors.length != this.color_weights.length){
      throw new Error("The list of colors and their weights must have equal length!")
    }
  }

  // initialize the slider after startup
  ngAfterViewInit() {
    this.updateSelectedColor()
  }

  // sets the colors to random values, set as many colors as given in nColors
  setRandomColorsAndWeights(nColors:number){
    let colors: string[] = []
    let color_weights: number[] = []
    for (let i = 0; i < nColors; i++) {
      // split the random number to r,g and b value and merge them properly padded to give a new color
      let color = Math.round(Math.random()*0xffffff)
      let r = this.padZeros(color.toString(16).substring(0,2),2)
      let g = this.padZeros(color.toString(16).substring(2,4),2)
      let b = this.padZeros(color.toString(16).substring(4,6),2)
      let color_string = '#'+r+g+b
      colors.push(color_string)
      color_weights.push(1+Math.floor(Math.random()*10))
    }
    this.setColors(colors,color_weights)
  }

  // set new colors for the color-slider
  setColors(colors:string[], color_weights:number[]){
    if(colors.length != color_weights.length){
      throw new Error("The list of colors and their weights must have equal length!")
    }
    if(colors.length>0){
      let validColors = true
      for(let i=0;i<colors.length;i++){
        let color = colors[i]
        if(!(color.length == 7 && color.startsWith('#') && !isNaN(parseInt(color.substring(1), 16)))){
          validColors = false
          break
        }
      }
      if(validColors) {
        this.colors = colors
        this.color_weights = color_weights
      }
    }
    this.selectedColor = 0
    this.sliderPosition = 0
  }

  /// getters

  // get the color that is currently selected
  getSelectedColor(){
    if(!(0<=this.selectedColor && this.selectedColor<this.colors.length)){
      throw new Error("SelectedColor holds a bad index!")
    }
    return this.colors[this.selectedColor]
  }

  // compute the inverse of the selected color, to have better contrast to display the color-string on top of the background that previews the selected color
  getInverseColor(){
    // split the color into its components, invert each part of it separately, then merge to inverted color
    let r = parseInt('0x'+this.getSelectedColor().substring(1,3))
    let g = parseInt('0x'+this.getSelectedColor().substring(3,5))
    let b = parseInt('0x'+this.getSelectedColor().substring(5,7))
    let r_inv = this.padZeros((0xff-r).toString(16),2)
    let g_inv = this.padZeros((0xff-g).toString(16),2)
    let b_inv = this.padZeros((0xff-b).toString(16),2)
    return '#'+r_inv+g_inv+b_inv
  }
  // helper function to transform a number (given as a string) to a two digit hex-string (padded with zeros), so it can be interpreted as a color
  padZeros(str:string, len:number){
    if(len<0)len=0
    str = str.replace('0x', '').replace('#', '')
    let padded = ''
    for (let i = 0; i < len-str.length; i++) {
      padded += '0'
    }
    return padded + str
  }

  /// functional logic for slider

  // check, which color is currently selected and update the 'selectedColor' index
  updateSelectedColor(){
    // get all the colorFields
    let colorFieldElements = (this.color_slider_element.nativeElement.firstChild as HTMLDivElement).children
    // get the pixel-position of the slider within the component
    let sliderPositionInComponent = this.sliderPosition * this.color_slider_element.nativeElement.clientWidth

    // find the colorField, that corresponds to the position of the slider
    for (let i = 0; i < colorFieldElements.length; i++) {
      let colorField = colorFieldElements[i] as HTMLDivElement
      let colorFieldStart = this.getHorizontalPositionInComponent(colorField.offsetLeft)
      let colorFieldEnd = this.getHorizontalPositionInComponent(colorField.offsetLeft+colorField.clientWidth)
      if(colorFieldStart<=sliderPositionInComponent && sliderPositionInComponent<=colorFieldEnd){
        this.selectedColor = i
        return
      }
    }
  }

  // maps a given position to the range within this component. if the position is outside the component, it will be set to the edge(left or right)
  getHorizontalPositionInComponent(position:number):number{
    let componentWidth = this.color_slider_element.nativeElement.clientWidth
    let relativeX = position - this.color_slider_element.nativeElement.offsetLeft

    // keep position within the bounds of the component
    if(relativeX < 0){
      relativeX = 0
    }
    if(relativeX > componentWidth){
      relativeX = componentWidth
    }
    return relativeX
  }

  // compute the position of the slider from the mouse position that was clicked
  updateSliderPosition(mouseX:number){
    mouseX = this.getHorizontalPositionInComponent(mouseX)
    let componentWidth = this.color_slider_element.nativeElement.clientWidth
    this.sliderPosition=mouseX/componentWidth
  }

  // transform the sliderPosition to a value that css can use to move the element position (sliderPosition [0,1] cssValue['-50%','50%'])
  sliderPositionToCssValue(){
    return (this.sliderPosition*100-50)+'%'
  }

  // update the color from the position that was clicked
  moveSlider(mouseX:number){
    this.updateSliderPosition(mouseX)
    this.updateSelectedColor()
  }


  /// input event handling

  // update the color on MouseClick and start dragging
  onMouseDown(event:MouseEvent){
    this.isDragging = true
    this.moveSlider(event.clientX)
  }

  // drag the slider around, if dragging has already started
  onMouseMove(event:MouseEvent){
    if(this.isDragging){
      this.moveSlider(event.clientX)
    }
  }

  // stop dragging, whenever the mouse button is released
  @HostListener('mouseup', ['$event'])
  onMouseUp(){
    this.isDragging = false
  }
}
