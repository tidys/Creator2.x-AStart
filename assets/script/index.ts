import AStar, { Point } from "./util/AStar";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.TiledMap)
    Map:cc.TiledMap = null;    //地图

    @property(cc.Node)
    Folder_box:cc.Node = null;         //所有方块都在这个node下
    @property(cc.Node)
    Folder_route:cc.Node = null;        //路块在这个节点下

    @property(cc.Node)
    Node_start:cc.Node = null;   //起始节点  红色方块
    @property(cc.Node)
    Node_end:cc.Node = null;     //结束节点  蓝色方块
    @property(cc.Node)
    Node_go:cc.Node = null;      //移动节点  绿色方块
    @property(cc.Prefab)
    Prefab_route:cc.Prefab = null;  //路线提示方块

    layer_road:cc.TiledLayer = null;    //临时记录
    layer_wall:cc.TiledLayer = null;    //临时记录

    start_point:Point = null;     //起始point
    end_point:Point = null;       //结束point
    map_point:Map<number,Point> = new Map();     //地图 索引
    route:Array<Point> = [];    //路线
    size:cc.Size = null;        //地图尺寸

    onLoad(){
        this.readMap();
    }

    /**
     * 读取地图，得到可以走的全部地块索引   （地图的xy是从左上角到右下角）
     */
    readMap(){
        this.layer_road = this.Map.getLayer("road").getComponent(cc.TiledLayer);
        this.layer_wall = this.Map.getLayer("wall").getComponent(cc.TiledLayer);
        this.size = this.Map.getMapSize();
        //地板  全部加进去
        for(let x=0;x<this.size.width;x++){
            for(let y=0;y<this.size.height;y++){
                let tiled =this.layer_road.getTiledTileAt(x,y,true);
                if(tiled.gid!=0){
                    let point = new Point(x,y);
                    this.map_point.set(x+y*this.size.width,point);
                }
            }
        }
        //墙  不要
        for(let x=0;x<this.size.width;x++){
            for(let y=0;y<this.size.height;y++){
                let tiled =this.layer_wall.getTiledTileAt(x,y,true);
                if(tiled.gid!=0){
                    this.map_point.delete(x+y*this.size.width);
                }
            }
        }
    }

    /**
     * 设定一个起始位置
     */
    setStart(){
        this.start_point = this.getRandomPoint();
        this.Node_start.setPosition(this.layer_road.getTiledTileAt(this.start_point.x,this.start_point.y,false).node.position);
    }

    /**
     * 设定一个终点位置
     */
    setEnd(){
        this.end_point = this.getRandomPoint();
        this.Node_end.setPosition(this.layer_road.getTiledTileAt(this.end_point.x,this.end_point.y,false).node.position);
    }

    /**
     * 获取一个随机的point
     */
    getRandomPoint(){
        let r = Math.floor(Math.random()*this.size.width*this.size.height);
        let point = this.map_point.get(r);
        if(!point){
            point = this.getRandomPoint();
        }
        return point;  
    }

    /**
     * 生成路线
     */
    getRoute(){
        if(!this.start_point){
            console.error("你还没有设置起点");
            return;
        }
        if(!this.end_point){
            console.error("你还没有设置终点");
            return;
        }
        //调用工具类获取路线
        this.route = AStar.getRoute(this.start_point,this.end_point,this.map_point,this.size);
        if(this.route.length==0){
            console.log("没有找到路径");
        }
        //黑色方块提示出来看看,先清空之前的
        this.Folder_route.removeAllChildren();
        this.i = 0;
        this.route.forEach(point=>{
            let tiled = this.layer_road.getTiledTileAt(point.x,point.y,false);
            let node = cc.instantiate(this.Prefab_route);
            this.Folder_route.addChild(node);
            node.setPosition(tiled.node.position);
        });
    }

    /**
     * 按照路线移动
     */
    i:number = 0;
    move(){
        if(this.i==this.route.length){  //表示走完了
            return;
        }
        let point = this.route[this.i++];
        cc.tween(this.Node_go).to(.2,{position:this.layer_road.getTiledTileAt(point.x,point.y,false).node.position}).call(()=>{this.move();}).start();
    }
}
