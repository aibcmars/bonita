import Canva from './model/canva';
import './index.scss';

//
// bootstrapping the application
//

// get the environment settings
let w = window,
  d = document,
  e = d.documentElement,
  g = d.getElementsByTagName('body')[0],
  windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
  windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;

// set up the configuration
const headerAndFooterHeight = 200;
const sectionMargin = 20;
const svg = d.getElementById('svg');
const svgWidth = windowWidth - sectionMargin;
const svgHeight = windowHeight - headerAndFooterHeight;

// initialize the application
new Canva(svg, svgWidth, svgHeight);
