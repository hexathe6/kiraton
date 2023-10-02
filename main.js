
// TODO
//
// - make `connect_buildings` create a road <use> 

// drag targets. used for click-and-drag
// NOT IMPLEMENTED/USED
var drag_target = null;
var last_drag_target = null;
// set policy: on mousedown, set `drag_target` to the element the mouse is on
// ----------: on mouseup, set `last_drag_target` to `drag_target` and set `drag_target` to null

// click positions. used for click-and-drag
// NOT IMPLEMENTED/USED
var click_start_pos = null;
var click_end_pos = null;
// set policy: on mousedown, set `click_start_pos` to the mouse position
// ----------: on mousemove, set `click_end_pos` to the mouse position
// ----------: on mouseup, set both to null

// global (reliable) mousedown/mouseup detection (started in init)
var mouse_is_down = false;
// set policy: on mousedown, set to true
// ----------: on mouseup, set to false

// camera position, used for panning and zooming
// NOT IMPLEMENTED
var cp = {x: 0, y: 0, zoom: 1};

// old camera position, for click-and-dragging the screen around
// NOT IMPLEMENTED
var cp_old = {x: 0, y: 0, zoom: 1};

// "canvas", currently an svg element with id="c" (set on init)
var c;

// list of buildings, containing all their non-graphical/backend data
var buildings = [];
// format: array of {id: <number>, type: <building type [string]>, pos: <position [{x,y}]>, connections: [list of road ids], [other attributes]}

// lists of 'halo's (colored rings around buildings that indicate range)
var halos = {};
// format: {<halo type>: [list of halos], ...}

// visibility of each type of halo
var halos_on = {};
// format: {type: true/false, ...}

// list of roads (they connect buildings)
var roads = [];
// format: [list of {roadinfo: {road info}, [id of building a, id of building b]}]

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
  _createbuilding(type,pos);
  if(type == "node")
  {
    // traffic node specific things here
  }
}

function connect_buildings(a,b)
{
  
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

// click-and-drag (mousedown handling)
function cad_down(e)
{
  drag_target = e.target;
  click_start_pos = {x: e.clientX, y: e.clientY};
  document.addEventListener("mousemove",cad_move);


}

// click-and-drag (mousemove handling)
function cad_move(e)
{
  click_end_pos = {x: e.clientX, y: e.clientY};
  cp = {x: cp_old.x + (click_end_pos.x - click_start_pos.x), y: cp_old.y + (click_end_pos.y - click_start_pos.y)};
  //console.log("gothere");
  _update_camera();
}

// click-and-drag (mouseup handling)
function cad_up(e)
{
  document.removeEventListener("mousemove",cad_move);

  cp = {x: cp_old.x + (click_end_pos.x - click_start_pos.x), y: cp_old.y + (click_end_pos.y - click_start_pos.y)};
  cp_old = cp;
}


// main init
function init()
{
  // base mouse handling
  document.addEventListener("mousedown",(e) => {mouse_is_down = true; cad_down(e)});
  document.addEventListener("mouseup",(e) => {mouse_is_down = false; cad_up(e)});

  c = document.getElementById("c");
  _init();

  // halo types
  halos.building_node = [];
  
  halos_on.building_node = true;
  
  createbuilding("node", {x: 500, y: 500});
  createbuilding("node", {x: 400, y: 500});
}

