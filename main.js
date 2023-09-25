
// drag targets. used for click-and-drag
// NOT IMPLEMENTED/USED
var drag_target = null;
var last_drag_target = null;

// global (reliable) mousedown/mouseup detection (started in init)
var mouse_is_down = false;

// camera position, used for panning and zooming
// NOT IMPLEMENTED
var cp = {x: 0, y: 0, zoom: 1};

// "canvas", currently an svg element with id="c" (set on init)
var c;

// list of buildings, containing all their non-graphical/backend data
var buildings = [];
// format: array of {type: <building type [string]>, pos: <position [{x,y}]>, [other attributes]}

// list of svg elements for each building. required to be in the same order as the main `buildings` list
var _buildings_graphics = [];
// format: array of elements or objects containing elements

// create an svg element (DRYer than otherwise)
function createsvgel(t)
{
  return document.createElementNS("http://www.w3.org/2000/svg",t);
}

// set multiple attributes on an element
function setAttributes(el,attrs)
{
  for(let a in attrs)
  {
    el.setAttribute(a,attrs[a]);
  }
}

// set multiple css properties at once
function setstyles(el,attrs)
{
  for(let a in attrs)
  {
    el.style[a] = attrs[a];
  }
}

// create new building (logical and graphical)
function createbuilding(type,pos)
{
  buildings.push({type: type, pos: pos});
  _createbuilding_graphical(type,pos);
  if(type == "node")
  {
    // traffic node specific things here
  }
}

// create svg elements
function _createbuilding_graphical(type,pos)
{
  if(type == "node")
  {
    let x = createsvgel("ellipse");
    c.append(x);
    x.classList.add("building-node");
    setAttributes(x,{cx: pos.x, cy: pos.y, rx: 20, ry: 20});
  }
}

// main init
function init()
{
  // base mouse handling
  document.addEventListener("mousedown",(e) => {mouse_is_down = true;});
  document.addEventListener("mouseup",(e) => {mouse_is_down = false;});

  c = document.getElementById("c");

  createbuilding("node", {x: 500, y: 500});
  createbuilding("node", {x: 450, y: 500});
}

