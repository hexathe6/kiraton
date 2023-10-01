function __loader_parse(loadfile)
{
  loadfile = loadfile.split("\n");
  for(let st of loadfile)
  {
    let el = document.createElement("script");
    document.getElementsByTagName("head")[0].append(el);
    if(st.includes("=> "))
    {
      st = st.split("=> ");
      el.onload = eval("() => {" + st[1] + "}");
    }
    else {st = [st];}
    el.src = st[0];
  }
}

async function __loader_init()
{
  for(let s of document.getElementsByTagName("script"))
  {
    if(s.getAttribute("loadfile") != null && s.getAttribute("loadfile") != "")
    {
      let _loadfile = await fetch(s.getAttribute("loadfile"));
      _loadfile = await _loadfile.text();
      __loader_parse(_loadfile);
    }
  }
}
