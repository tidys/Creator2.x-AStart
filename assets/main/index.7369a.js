window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AStar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05f35CaCepNEpykvXMMJg4o", "AStar");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __assign = this && this.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Point = void 0;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Point = function() {
      function Point(x, y) {
        this.G = 0;
        this.H = 0;
        this.F = 0;
        this.father = null;
        this.is_close = false;
        this.x = x;
        this.y = y;
      }
      return Point;
    }();
    exports.Point = Point;
    var AStar = function(_super) {
      __extends(AStar, _super);
      function AStar() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      AStar.getRoute = function(start, end, map, size) {
        var _this = this;
        this.is_find = false;
        this.arr_open = [];
        this.pppp = null;
        this.start = __assign({}, start);
        this.end = __assign({}, end);
        this.map = new Map();
        map.forEach(function(value, key) {
          _this.map.set(key, __assign({}, value));
        });
        this.size = size;
        map.get(this.start.x + this.start.y * this.size.width).G = 0;
        var route = new Array();
        try {
          this.search(this.start);
        } catch (error) {
          console.error("\u4f4d\u7f6e\u4e0d\u5bf9");
          return route;
        }
        this.pppp && this.getFather(this.pppp, route);
        return route;
      };
      AStar.search = function(point) {
        var _this = this;
        if (point.x == this.end.x && point.y == this.end.y) {
          this.is_find = true;
          this.pppp = point;
          return;
        }
        var arr = this.getAround(point);
        arr.forEach(function(p) {
          _this.setFather(p, point);
        });
        this.arr_open.sort(this.compare);
        this.arr_open.forEach(function(pp, index, arr) {
          pp.is_close && arr.splice(index, 1);
          _this.is_find || _this.search(pp);
        });
      };
      AStar.getAround = function(point) {
        point.is_close = true;
        var arr = new Array();
        var index;
        var p;
        if (0 != point.y) {
          index = point.x + (point.y - 1) * this.size.width;
          p = this.map.get(index);
          if (p && !p.is_close) {
            arr.push(this.map.get(index));
            this.arr_open.push(this.map.get(index));
          }
        }
        if (point.y + 1 != this.size.height) {
          index = point.x + (point.y + 1) * this.size.width;
          p = this.map.get(index);
          if (p && !p.is_close) {
            arr.push(this.map.get(index));
            this.arr_open.push(this.map.get(index));
          }
        }
        if (0 != point.x) {
          index = point.x - 1 + point.y * this.size.width;
          p = this.map.get(index);
          if (p && !p.is_close) {
            arr.push(this.map.get(index));
            this.arr_open.push(this.map.get(index));
          }
        }
        if (point.x + 1 != this.size.width) {
          index = point.x + 1 + point.y * this.size.width;
          p = this.map.get(index);
          if (p && !p.is_close) {
            arr.push(this.map.get(index));
            this.arr_open.push(this.map.get(index));
          }
        }
        return arr;
      };
      AStar.setFather = function(son, father) {
        if (!son.father || son.father.G > father.G) {
          son.father = father;
          son.G = son.father.G + 1;
          son.H = Math.abs(son.x - this.end.x) + Math.abs(son.y - this.end.y);
          son.F = son.G + son.H;
        }
      };
      AStar.compare = function(p1, p2) {
        return p1.F > p2.F ? 1 : -1;
      };
      AStar.getFather = function(point, route) {
        var father = point.father;
        father && this.getFather(father, route);
        route.push(point);
      };
      AStar.start = null;
      AStar.end = null;
      AStar.map = null;
      AStar.size = null;
      AStar.arr_open = [];
      AStar.pppp = null;
      AStar.is_find = false;
      AStar = __decorate([ ccclass ], AStar);
      return AStar;
    }(cc.Component);
    exports.default = AStar;
    cc._RF.pop();
  }, {} ],
  index: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62ec0cdYUlN5bQZkBvtBefO", "index");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AStar_1 = require("./util/AStar");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Map = null;
        _this.Folder_box = null;
        _this.Folder_route = null;
        _this.Node_start = null;
        _this.Node_end = null;
        _this.Node_go = null;
        _this.Prefab_route = null;
        _this.layer_road = null;
        _this.layer_wall = null;
        _this.start_point = null;
        _this.end_point = null;
        _this.map_point = new Map();
        _this.route = [];
        _this.size = null;
        _this.i = 0;
        return _this;
      }
      NewClass.prototype.onLoad = function() {
        this.readMap();
      };
      NewClass.prototype.readMap = function() {
        this.layer_road = this.Map.getLayer("road").getComponent(cc.TiledLayer);
        this.layer_wall = this.Map.getLayer("wall").getComponent(cc.TiledLayer);
        this.size = this.Map.getMapSize();
        for (var x = 0; x < this.size.width; x++) for (var y = 0; y < this.size.height; y++) {
          var tiled = this.layer_road.getTiledTileAt(x, y, true);
          if (0 != tiled.gid) {
            var point = new AStar_1.Point(x, y);
            this.map_point.set(x + y * this.size.width, point);
          }
        }
        for (var x = 0; x < this.size.width; x++) for (var y = 0; y < this.size.height; y++) {
          var tiled = this.layer_wall.getTiledTileAt(x, y, true);
          0 != tiled.gid && this.map_point.delete(x + y * this.size.width);
        }
      };
      NewClass.prototype.setStart = function() {
        this.start_point = this.getRandomPoint();
        this.Node_start.setPosition(this.layer_road.getTiledTileAt(this.start_point.x, this.start_point.y, false).node.position);
      };
      NewClass.prototype.setEnd = function() {
        this.end_point = this.getRandomPoint();
        this.Node_end.setPosition(this.layer_road.getTiledTileAt(this.end_point.x, this.end_point.y, false).node.position);
      };
      NewClass.prototype.getRandomPoint = function() {
        var r = Math.floor(Math.random() * this.size.width * this.size.height);
        var point = this.map_point.get(r);
        point || (point = this.getRandomPoint());
        return point;
      };
      NewClass.prototype.getRoute = function() {
        var _this = this;
        if (!this.start_point) {
          console.error("\u4f60\u8fd8\u6ca1\u6709\u8bbe\u7f6e\u8d77\u70b9");
          return;
        }
        if (!this.end_point) {
          console.error("\u4f60\u8fd8\u6ca1\u6709\u8bbe\u7f6e\u7ec8\u70b9");
          return;
        }
        this.route = AStar_1.default.getRoute(this.start_point, this.end_point, this.map_point, this.size);
        0 == this.route.length && console.log("\u6ca1\u6709\u627e\u5230\u8def\u5f84");
        this.Folder_route.removeAllChildren();
        this.i = 0;
        this.route.forEach(function(point) {
          var tiled = _this.layer_road.getTiledTileAt(point.x, point.y, false);
          var node = cc.instantiate(_this.Prefab_route);
          _this.Folder_route.addChild(node);
          node.setPosition(tiled.node.position);
        });
      };
      NewClass.prototype.move = function() {
        var _this = this;
        if (this.i == this.route.length) return;
        var point = this.route[this.i++];
        cc.tween(this.Node_go).to(.2, {
          position: this.layer_road.getTiledTileAt(point.x, point.y, false).node.position
        }).call(function() {
          _this.move();
        }).start();
      };
      __decorate([ property(cc.TiledMap) ], NewClass.prototype, "Map", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "Folder_box", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "Folder_route", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "Node_start", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "Node_end", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "Node_go", void 0);
      __decorate([ property(cc.Prefab) ], NewClass.prototype, "Prefab_route", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {
    "./util/AStar": "AStar"
  } ]
}, {}, [ "index", "AStar" ]);