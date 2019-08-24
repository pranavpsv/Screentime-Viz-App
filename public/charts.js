var ganttChartSpec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A simple bar chart with ranged data (aka Gantt Chart).",
  "width": 900,
  "height": 600,
  "data": [
    {
      "name": "source_0",
      "url": "/movie",
      "transform": [
        {
          "type": "filter",
          "expr": "datum[\"start (min)\"] !== null && !isNaN(datum[\"start (min)\"])"
        },
        
        {
          "type": "joinaggregate",
          "groupby": ["character"],
          "ops": ["sum"],
          "fields": ["duration"],
          "as": ["total_duration"]
        },
        {
          "type": "window",
          "sort": {"field": ["total_duration","character"], "order": ["descending", "descending"]},
          "ops": ["dense_rank"], "as": ["rank"]
        },
        {
          "type": "filter",
          "expr": "datum.rank <= Characters"
        }
      ]
    }
  ],
  "signals": [
    {"name":"Characters",
   "value":5,
   "bind":{
     "input": "range",
     "max":30,
     "min":1,
     "step":1
   }} 
  ],
  "marks": [
    {
      "name": "marks",
      "type": "rect",
      "from": {"data": "source_0"},
      "encode": {
        "update": {
          "fill": {"scale": "color", "field": "character"},
          "tooltip": {
            "signal": "{\"character\": ''+datum[\"character\"], \"start (min)\": format(datum[\"start (min)\"], \"\"), \"end (min)\": format(datum[\"end (min)\"], \"\")}"
          },
          "x": {"scale": "x", "field": "start (min)"},
          "x2": {"scale": "x", "field": "end (min)"},
          "y": {"scale": "y", "field": "character"},
          "height": {"scale": "y", "band": true}
        }
      }
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "domain": {"data": "source_0", "fields": ["start (min)", "end (min)"]},
      "range": [0, {"signal": "width"}]
    },
    {
      "name": "y",
      "type": "band",
      "domain": {"data": "source_0", "field": "character", "sort": true},
      "range": [0, {"signal": "height"}],
      "paddingInner": 0.1
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {"data": "source_0", "field": "character"},
      "range": {"scheme": "Rainbow"}
    }
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "title": "Movie runtime (min)"
    },
    {
      "scale": "x",
      "orient": "bottom"
    },
    {
      "scale": "y",
      "orient": "left",
      "title": "Characters"
    }
  ]
}
var topCharactersSpec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 500,
  "height": 410,
  "autosize": "fit",

  "signals": [
    {
      "name": "Characters", "value": 8,
      "bind": {"input": "range", "min": 1, "max": 30, "step": 1}
    },
    {
      "name": "op", "value": "sum"
    }
  ],
  "data": [
    {
      "name": "directors",
      "url": '/topchar',
      "transform": [
        {
          "type": "filter",
          "expr": "datum.character != null && datum.duration != null"
        },
        {
          "type": "aggregate",
          "groupby": ["character"],
          "ops": [{"signal": "op"}],
          "fields": ["duration"],
          "as": ["duration"]
        },
        {
          "type": "window",
          "sort": {"field": "duration", "order": "descending"},
          "ops": ["row_number"], "as": ["rank"]
        },
        {
          "type": "filter",
          "expr": "datum.rank <= Characters"
        }
      ]
    }
  ],
  "marks": [
    {
      "type": "rect",
      "from": {"data": "directors"},
      "encode": {
        "update": {
"strokeWidth": {
"value": 0
},
"tooltip": {'signal': 'datum.character + "\'s duration  is " + round(datum.duration) +  " min"'},
"fill": {
"field": "duration",
"scale": "marks.0.encode.update.fill.scale"
},
"fillOpacity": {
"value":1
},
          "x": {"scale": "x", "value": 0},
          "x2": {"scale": "x", "field": "duration"},
          "y": {"scale": "y", "field": "character"},
          "height": {"scale": "y", "band": 1}
        }
      }
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "domain": {"data": "directors", "field": "duration"},
      "range": "width",
      "nice": true
    },
    {
      "name": "y",
      "type": "band",
      "domain": {
        "data": "directors", "field": "character",
        "sort": {"op": "max", "field": "duration", "order": "descending"}
      },
      "range": "height",
      "padding": 0.05
    },
    {
"name": "marks.0.encode.update.fill.scale",
"type": "linear",
"domain": {
"data": "directors",
"field": "duration"
},
"range": {
"scheme": "lightmulti"
    }
}
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "tickCount": 5,
      "title": "Screentime (min)"
    },
    {
      "scale": "y",
      "orient": "left"
    }
  ]
}
var oldGanttChartSpec =  {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A simple bar chart with ranged data (aka Gantt Chart).",
  "autosize": "pad",
  "width": 900,
  "height": 600,
  "config": {
      "view" : {
          "background": null
      }
    },
  "style": "cell",
  "data": [
    {
      "name": "source_0",
      "url": "/movie",
      "format": {
        "type": "json"
      },
      "transform": [
        {
          "type": "filter",
          "expr": "datum[\"start (min)\"] !== null && !isNaN(datum[\"start (min)\"])"
        }
      ]
    }
  ],
  "marks": [
    {
      "name": "marks",
      "type": "rect",
      "style": [
        "bar"
      ],
      "from": {
        "data": "source_0"
      },
      "encode": {
        "update": {
          "fill": {
            "scale": "color",
            "field": "character"
          },
          "tooltip": {
            "signal": "{\"character\": ''+datum[\"character\"], \"start (min)\": format(datum[\"start (min)\"], \"\"), \"end (min)\": format(datum[\"end (min)\"], \"\")}"
          },
          "x": {
            "scale": "x",
            "field": "start (min)"
          },
          "x2": {
            "scale": "x",
            "field": "end (min)"
          },
          "y": {
            "scale": "y",
            "field": "character"
          },
          "height": {
            "scale": "y",
            "band": true
          }
        }
      }
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "domain": {
        "data": "source_0",
        "fields": [
          "start (min)",
          "end (min)"
        ]
      },
      "range": [
        0,
        {
          "signal": "width"
        }
      ],
      "nice": true,
      "zero": true
    },
    {
      "name": "y",
      "type": "band",
      "domain": {
        "data": "source_0",
        "field": "character",
        "sort": true
      },
      "range": [
        0,
        {
          "signal": "height"
        }
      ],
      "paddingInner": 0.1,
      "paddingOuter": 0.05
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": {
        "data": "source_0",
        "field": "character",
        "sort": true
      },
      "range": {
        "scheme": "Rainbow"
      }
    }
  ],
  "axes": [
    {
      "scale": "x",
      "orient": "bottom",
      "grid": false,
      "title": "start (min), end (min)",
      "labelFlush": true,
      "labelOverlap": true,
      "tickCount": {
        "signal": "ceil(width/40)"
      },
      "zindex": 1
    },
    {
      "scale": "x",
      "orient": "bottom",
      "gridScale": "y",
      "grid": true,
      "tickCount": {
        "signal": "ceil(width/40)"
      },
      "domain": false,
      "labels": false,
      "maxExtent": 0,
      "minExtent": 0,
      "ticks": false,
      "zindex": 0
    },
    {
      "scale": "y",
      "orient": "left",
      "grid": false,
      "title": "character",
      "labelOverlap": true,
      "zindex": 1
    }
  ]
}
console.log(vgSpec);
