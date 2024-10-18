# Frontend - Angular 17 CRUD Application

## Prerequisites
- Node.js and npm installed
- Angular CLI installed

## Setup Instructions

### Step 1: Clone the Repository
`git clone [your-repo-url]`
`cd [your-frontend-folder]`

## Step 2: Install Dependencies
`npm install`

## Step 3: Run the Application
`ng serve -o`
- The application will be served at http://localhost:4200 by default.

## Step 4: Configure Bootstrap
To use Bootstrap, Datatables, sweetalert2, ensure that the styles section in your angular.json file includes the paths like above:

"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css",
  "node_modules/datatables.net-bs5/css/dataTables.bootstrap5.min.css",
  "node_modules/sweetalert2/src/sweetalert2.scss"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.min.js",
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/datatables.net/js/dataTables.min.js",
  "node_modules/datatables.net-bs5/js/dataTables.bootstrap5.min.js"
]

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


