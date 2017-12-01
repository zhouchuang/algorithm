var Node = (function(){
    var binary = '';
    var char = '';
    function _node(binary, char){
        var _this = this;
        if(_this instanceof _node){
            _this.binary = binary;
            _this.char = char;
            _this.addLeftNode=function(left){
                _this.left = left;
            };
            _this.addRightNode= function(right){
                _this.right = right;
            };
        }else{
            return new _node(binary,char);
        }
    }
    _node.prototype = {
        constructor: _node,
        left:{},
        right:{},
        weight:0
    }
    return _node;
})();

var CharMapNum = (function(char){
    function _cmn(char){
        var _this = this;
        if(_this instanceof _cmn){
            _this.increase = function(){
                _this.num++;
            };
            _this.instance = function(char){
                _this.char = char;
            }(char)
        }else{
            return new _cmn(binary,char);
        }
    }
    _cmn.prototype = {
        constructor: _cmn,
        char:'',
        num:0
    }
    return _cmn;
})();

var Hfm= (function(){
    function _hfm(){
        var _this = this;
        if(_this instanceof _hfm){
            _this.addNode=function(node){
                _this.nodes.push(node);
            }
        }else{
            return new _hfm();
        }
    }
    _hfm.prototype={
        constructor:_hfm,
        nodes:[],
        node:{name:'tom'}
    }
    return _hfm;
})();
var CharMapCharAndNum=(function(char){
    var list  = [];
    function _map( char){
        var _this = this;
        if(_this instanceof _map){
            _this.addChar=function(char){
                var cmu = _this[char]||_this.newInstanceCharMapNum(char);
                cmu.increase();
                _this[char] = cmu; 
            };
            _this.newInstanceCharMapNum=function(char){
                _this.size ++;
                return new CharMapNum(char);
            };
            _this.orderlyList=function(){
                if(list.length==0){
                    for(var i in _this){
                        list.push(_this[i]);
                    }
                    var tempCMN = {};
                    for(var i=0;i<list.length;i++){
                        for(var j=i+1;j<list.length;j++){
                            if(list[i].num <list[j].num){
                                tempCMN = list[i];
                                list[i] = list[j];
                                list[j] = tempCMN;
                            }
                        }
                    }
                    return list;
                }else{
                    return list;
                }
            };
        }else{
            return new _map(binary,char);
        }
    }
    _map.prototype = {
        constructor: _map,
        size:0
    }
    return _map;
})();

var CodeUtil = {
    int2Binary:function (num){
        return '0001';
    }
};

var base64String = "data:image/jpg;base64,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";

var cmcn = new CharMapCharAndNum();
for(var i=0;i<base64String.length;i++){
    cmcn.addChar(base64String.substring(i,i+1));
}

var hfm = new Hfm();
var list = cmcn.orderlyList();
for(cmn of list){
    var node  = new Node(CodeUtil.int2Binary(cmn.num),cmn.char);
    hfm.addNode(cmn);
}
// console.log(hfm);
var node = new Node('1','a');
var node1 = new Node('2','b');
var node2 = new Node('3','c');
node.addLeftNode(node1);
node.addRightNode(node2);
console.log(node);


