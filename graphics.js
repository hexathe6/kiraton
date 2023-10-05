// list of svg layers, keyed to what they are
var _layers = {};
// format: {<layer purpose>: <g> element, ...}

// list of svg elements for each building. required to be in the same order as the main `buildings` list
var _buildings = [];
// format: [{id: id, el: element}, ...]

// list of halo layers, keyed to type
var _halos = {};
// format: {<halo type>: <g> element, ...}

// list of the halo elements with their corresponding building ids
var _halo_els = [];
// format: [{id: id, el: element}, ...]

// list of road elements
var _roads = [];
// format: [{id: id, el: road element}, ...]

// create building elements
function _createbuilding(id,type,pos)
{
  if(type == "node")
  {
    let xh = createsvgel("use");
    setAttributes(xh,{href: "#building_node_defs_halo", x: pos.x, y: pos.y});
    _halos.building_node.append(xh);
    halos.building_node.push(xh);
    _halo_els.push({id: id, el: xh});

    let x = createsvgel("use");
    _layers.buildings.append(x);
    _buildings.push({id: id, el: x});
    setAttributes(x,{href: "#building_node_defs", x: pos.x, y: pos.y});
    x.addEventListener("click", () => {toggle_halos("building_node");}, {capture: true});
  }
}

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
    let xh = createsvgel("ellipse");
    xh.id = "building_node_defs_halo";
    xh.classList.add("building_node_halo");
    setAttributes(xh,{rx: 200, ry: 200});
    cd.append(xh);
  }


  // building types
  {
    let x = createsvgel("ellipse");
    x.id = "building_node_defs";
    x.classList.add("building_node");
    setAttributes(x,{rx: 20, ry: 20});
    cd.append(x);
  }

}

