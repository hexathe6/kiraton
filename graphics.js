// list of svg layers, keyed to what they are
var _layers = {};
// format: {<layer purpose>: <g> element, ...}

// list of svg elements for each building. required to be in the same order as the main `buildings` list
var _buildings = [];
// format: [array of elements or objects containing elements]

// list of halo layers, keyed to type
var _halos = {};
// format: {<halo type>: <g> element, ...}

// create svg elements
function _createbuilding(type,pos)
{
  if(type == "node")
  {
    let xh = createsvgel("use");
    setAttributes(xh,{href: "#building_node_defs_halo", x: pos.x, y: pos.y});
    _halos.building_node.append(xh);
    halos.building_node.push(xh);

    let x = createsvgel("use");
    _layers.buildings.append(x);
    setAttributes(x,{href: "#building_node_defs", x: pos.x, y: pos.y});
    x.addEventListener("click",() => {toggle_halos("building_node");});
  }
}

function _create_road(a,b,upgrades)
{

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

