
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

// lists of 'halo's (colored rings around buildings that indicate range)
var halos = {};
// format: {type: [list of halos], ...}

// visibility of each type of halo
var halos_on = {};
// format: {type: true/false, ...}

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
    let g = createsvgel("g");
    g.classList.add("group_building_node");
    c.append(g);
    let xh = createsvgel("ellipse");
    g.append(xh);
    xh.classList.add("building_node_halo");
    setAttributes(xh,{cx: pos.x, cy: pos.y, rx: 200, ry: 200});
    halos.building_node.push(xh);
    let x = createsvgel("ellipse");
    g.append(x);
    x.classList.add("building_node");
    setAttributes(x,{cx: pos.x, cy: pos.y, rx: 20, ry: 20});
    x.addEventListener("click",() => {toggle_halos("building_node");});
  }
}

function toggle_halos(type)
{
  halos_on[type] = !halos_on[type];
  let t1 = ["building_node"];
  if(t1.includes(type))
  {
    for(let el of halos[type])
    {
      el.setAttribute("opacity", halos_on[type] ? "100%" : "0%");
    }
  }
}

// svg defs element
var cd;

// graphics init
function _init_graphical()
{
  cd = createsvgel("defs");
  c.append(cd);

  // node 'halo' gradient
  {
    let g = createsvgel("radialGradient");
    g.id = "building_node_grad_halo";
    cd.append(g);
    let s = createsvgel("stop");
    setAttributes(s,{offset: "0%"});
    g.append(s);
    s = createsvgel("stop");
    setAttributes(s,{offset: "100%"});
    g.append(s);
  }

  // halo types
  halos.building_node = [];
}

// main init
function init()
{
  // base mouse handling
  document.addEventListener("mousedown",(e) => {mouse_is_down = true;});
  document.addEventListener("mouseup",(e) => {mouse_is_down = false;});

  c = document.getElementById("c");
  _init_graphical();

  halos_on.building_node = true;
  
  createbuilding("node", {x: 500, y: 500});
  createbuilding("node", {x: 200, y: 500});
}

