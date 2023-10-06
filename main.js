
// TODO
//
// - split halos into their edges and fills

// drag targets. used for click-and-drag
// NOT IMPLEMENTED/USED
var drag_target = null;
var last_drag_target = null;
// set policy: on mousedown, set `drag_target` to the element the mouse is on
// ----------: on mouseup, set `last_drag_target` to `drag_target` and set `drag_target` to null

// click positions. used for click-and-drag
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
// ZOOMING IS NOT IMPLEMENTED
var cp = {x: 0, y: 0, zoom: 1};

// old camera position, for click-and-dragging the screen around
var cp_old = {x: 0, y: 0, zoom: 1};

// "canvas", currently an svg element with id="c" (set on init)
var c;

// list of buildings, containing all their non-graphical/backend data
var buildings = [];
// format: array of {id: <number>, type: <building type [string]>, pos: <position [{x,y}]>, connections: [list of road ids], [other attributes]}

// next available ids for buildings
var next_building_ids = [0];
// set policy: on building creation: if there's only one element, increment `next_building_ids[0]`
// ----------: --------------------: if there's more than one element, `pop` the last element
// ----------: on building destruction, `push` its building id here

// lists of 'halo's (colored rings around buildings that indicate range)
var halos = {};
// format: {<halo type>: [list of halos], ...}

// visibility of each type of halo
var halos_on = {};
// format: {type: true/false, ...}

// list of roads (they connect buildings)
var roads = [];
// format: [list of {id: id, roadinfo: {road info}, connectends: [id of building a, id of building b]}]
// roadinfo format: {level: road level} // i might add more later
// definition note: connectends are the things that get connected by a connection 

// next available ids for buildings
var next_road_ids = [0];
// set policy: on road creation: if there's only one element, increment `next_road_ids[0]`
// ----------: ----------------: if there's more than one element, `pop` the last element
// ----------: on road destruction, `push` its road id here

// allows 'comparisons' between multiple function arguments more concisely
// arguments: func -> a single-argument function (like (a) => x.y[a])
// ---------: arg -> an array of values to pass to `func`
// ---------: comp: -> a 2-argument "comparison" function (like (a,b) => (a || b)). should be commutative.
function multivalue_compare(func,arg,comp)
{
  let a = func(arg[0]);
  for(let i = 1; i < arg.length; i++)
  {
    a = comp(a,func(arg[i]));
  }
  return a;
}

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
function createbuilding_inner(type,pos)
{
  let id;
  if(next_building_ids.length == 1)
  {
    id = next_building_ids[0];
    next_building_ids[0]++;
  }
  else {id = next_building_ids.pop();}

  buildings.push({id: id, type: type, pos: pos});
  _createbuilding(id,type,pos);
  if(type == "node")
  {
    // traffic node specific things here
  }
  return id;
}

// does what it says
// arguments: id -> id of building to destroy
function destroybuilding(id)
{
  for(let b = 0; b < buildings.length; b++)
  {
    if(buildings[b].id == id)
    {
      _destroybuilding(b);
      next_building_ids.push(b);
      buildings.splice(b,1);
    }
  }
  for(let b = 0; b < roads.length; b++)
  {
    if(multivalue_compare((a) => (roads[b].connectends[a] == id),[0,1],(a,b) => (a || b)))
    {
      _destroy_road(roads[b].id);
      destroy_road(roads[b].id)
    }
  }
}

// does what it says
// arguments: id -> id of road to destroy
function destroy_road(id)
{
  next_road_ids.push(id);
  for(let i = 0; i < roads.length; i++)
  {
    if(roads[i].id == id) {roads.splice(i,1);}
  }
}

// connects two buildings together with a road
// arguments: a -> id of building a
// ---------: b -> id of building b
// ---------: roadinfo -> properties of the road
function connect_buildings(a,b,roadinfo)
{
  let id;
  if(next_road_ids.length == 1)
  {
    id = next_road_ids[0];
    next_road_ids[0]++;
  }
  else {id = next_road_ids.pop();}

  roads.push({id: id, roadinfo: roadinfo, connectends: [a,b]});
  _create_road(roads[roads.length-1]);
}

// arguments: type -> building type
// ---------: pos -> building position as {x,y}
// ---------: from -> building id of the building from which this building is constucted
function createbuilding(type,pos,from)
{
  let id = createbuilding_inner(type,pos);
  connect_buildings(from,id,{});
}

// toggles a group of halos by building type
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
  
  createbuilding_inner("node", {x: 500, y: 500});
  createbuilding("node", {x: 400, y: 500}, 0);
  createbuilding("node", {x: 450, y: 400}, 1);
  //destroybuilding(0);
}

