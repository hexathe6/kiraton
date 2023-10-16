// list of svg layers, keyed to what they are
var _layers = {};
// format: {<layer purpose>: <g> element, ...}

// list of svg elements for each building. required to be in the same order as the main `buildings` list
var _buildings = [];
// format: [{id: id, el: element}, ...]

// <g> layers for halo pieces
var _halo_edge_g;
var _halo_fill_g;

// list of halo layers, keyed to type
var _halos = {};
// format: {<halo type>: <g> element, ...}

// list of the halo elements with their corresponding building ids
var _halo_els = [];
// format: [{id: id, els: {edge: element, fill: element}}, ...]

// list of road elements
var _roads = [];
// format: [{id: id, el: road element}, ...]

// create building elements
function _createbuilding(id,type,pos)
{
  if(type == "node")
  {
    _halo_els.push({id: id, els: {}});

    let xhe = createsvgel("use");
    setAttributes(xhe,{href: "#building_node_defs_halo_edges", x: pos.x, y: pos.y});
    //_halos.building_node.append(xhe);
    _halo_edge_g.append(xhe);
    halos.building_node.push(xhe);
    _halo_els[_halo_els.length-1].els.edge = xhe;
    
    let xhf = createsvgel("use");
    setAttributes(xhf,{href: "#building_node_defs_halo_fill", x: pos.x, y: pos.y});
    //_halos.building_node.append(xhf);
    _halo_fill_g.append(xhf);
    halos.building_node.push(xhf);
    _halo_els[_halo_els.length-1].els.fill = xhf;

    let x = createsvgel("use");
    _layers.buildings.append(x);
    _buildings.push({id: id, el: x});
    setAttributes(x,{href: "#building_node_defs", x: pos.x, y: pos.y});
    x.addEventListener("mousedown", () => {nocad = true; document.addEventListener("mouseup", function enable_cad() {nocad = false; document.removeEventListener("mouseup",enable_cad);});});
    x.addEventListener("click", () => {toggle_halos("building_node");});
    x.addEventListener("click", () => {select_building(id);});
  }
}

// create road elements
// arguments: road -> road object containing id, connectends, and roadinfo
function _create_road(road)
{
  let a;
  let b;
  for(let i = 0; i < buildings.length; i++)
  {
    if(buildings[i].id == road.connectends[0]) {a = buildings[i];}
    if(buildings[i].id == road.connectends[1]) {b = buildings[i];}
  }
  let l = createsvgel("line");
  setAttributes(l,{x1: a.pos.x, y1: a.pos.y, x2: b.pos.x, y2: b.pos.y});
  l.classList.add("road");
  _roads.push({id: road.id, el: l});
  _layers.roads.append(l);
}

// removes building and halo elements by id
function _destroybuilding(id)
{
  for(let i = 0; i < _buildings.length; i++)
  {
    if(_buildings[i].id == id)
    {
      _buildings[i].el.remove();
      _buildings.slice(i,1);
      _halo_els[i].el.remove();
      _halo_els.slice(i,1);
    }
  }
}

// removes a road element by id
function _destroy_road(id)
{
  for(let i = 0; i < _roads.length; i++)
  {
    if(_roads[i].id == id)
    {
      _roads[i].el.remove();
      _roads.slice(i,1);
    }
  }
}

function _toggle_subtab(e)
{
  let el = e.target;
  let es = e.target;
  while(!multivalue_compare((a) => el.classList.contains(a), ["closed","open"], (a,b) => (a || b)))
  {
    el = el.parentElement;
  }
  if(es.tagName != "IMG") {es = es.children[0];}
  if(el.classList.contains("closed"))
  {
    el.classList.remove("closed");
    el.classList.add("open");
    es.setAttribute("src","assets/expand_toggler_close.svg");
  }
  else if(el.classList.contains("open"))
  {
    el.classList.remove("open");
    el.classList.add("closed");
    es.setAttribute("src","assets/expand_toggler_open.svg");
  }
}

// sets camera position
function _update_camera()
{
  let x = document.getElementById("camera");
  setAttributes(x,{style: "transform: translate("+cp.x+"px, "+cp.y+"px)"});
}

// svg defs element
var cd;

// graphics init
function _init()
{
  // get the <defs> for later use
  cd = document.getElementsByTagName("defs")[0];

  // init _layers
  _layers.halos = document.getElementById("halos");
  _layers.roads = document.getElementById("roads");
  _layers.buildings = document.getElementById("buildings");
  
  // halo types
  _halos.building_node = document.getElementById("halos");

  // halo sublayers
  _halo_edge_g = document.getElementById("halos_edges");
  _halo_fill_g = document.getElementById("halos_fills");
  
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

    // original halo, for <use>
    // edge
    let xhe = createsvgel("ellipse");
    xhe.id = "building_node_defs_halo_edges";
    xhe.classList.add("building_node_halo_edges");
    setAttributes(xhe,{rx: 200, ry: 200});
    cd.append(xhe);
    // fill
    let xhf = createsvgel("ellipse");
    xhf.id = "building_node_defs_halo_fill";
    xhf.classList.add("building_node_halo_fill");
    setAttributes(xhf,{rx: 200, ry: 200});
    cd.append(xhf);
  }


  // building types
  {
    let x = createsvgel("ellipse");
    x.id = "building_node_defs";
    x.classList.add("building_node");
    setAttributes(x,{rx: 20, ry: 20});
    cd.append(x);
  }

  for(let el of document.querySelectorAll(".expand_toggler"))
  {
    el.addEventListener("click",(e) => _toggle_subtab(e));
  }

}

