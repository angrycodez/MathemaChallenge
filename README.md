# MathemaChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# Documenation/Notes a lá Kalle

## Install:

### Requirements

sudo apt install nodejs
(since this installed old version 10.19, use this command instead to get most recent version of nodejs:
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs)

sudo apt install npm
sudo apt install ng-common

### angular cli

npm install - g @angular/cli

### create new project

ng new MathemaChallange

### run server

ng serve -o --poll=2000

### create new component

ng generate component color_slider


## Process:

-Setup empty project

-get debugger running

-create color bar (new component, color array, html elements, css styling)

-draw and add image to show slider arrow

-catch mouse events on component

-compute event position in component and transform to corresponding color

-create field to preview the selected color

-invert selected color to print the color value nicely readable

-create button for random color_slider setup (set random colors and random weights)

-write test cases (i know, probably should have done that earlier/step by step during the process, but was too busy to actually getting used to angular and all the environment)



## Result:

-created freely usable angular component to display a color-bar with a slider to select a color

-the content of the color-bar can be freely adjusted by setting an array for the color-values and one for the color_weight-values



## Known Issues:

-when clicking on the arrow for sliding, the image is getting dragged, and the slider doesn't move smoothly. when releasing the mouseButton, the drag-state keeps active

-the layout for the 'randomize colors'-button is not working properly; it's rather lucky that the position fits the component quite well

(original: docs.txt)
