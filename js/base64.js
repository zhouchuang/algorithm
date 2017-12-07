var Base64={};
Base64.compress=function(type,base64String){
    var nodeController = new NodeController();
    for(var i=0;i<base64String.length;i++){
        nodeController.addChar(base64String.substring(i,i+1));
    }
    return CompressUtil.reSpellCode(base64String,nodeController.nodeMap);
};
Base64.decompression=function(code16String){
    var unCompressBase64String  = "";
    var code48Len = Math.floor(code16String.length/3);
    for(var i=0;i<code48Len;i++){
        var code48Binary = CompressUtil.chinese2Binary(code16String.substring(i*3,(i+1)*3));
        var fullCode48Binary = "";
        for(var str of code48Binary.split(" ")){
            fullCode48Binary+='0000000000000000'.substr(str.length)+str;
        }
        fullCode48Binary = CompressUtil.codeTransCode(fullCode48Binary,6," ");
        for(var b of fullCode48Binary.split(" ")){
            unCompressBase64String+= CompressUtil.decodeTable[b];
        }
    }
    return unCompressBase64String;
}
var Node = (function(char){
    function _node(char){
        var _this = this;
        if(_this instanceof _node){
            _this.num = 0;
            _this.binary = '';
            _this.instance = function(char){
                _this.binary = CompressUtil.codeTable[char];
                _this.char = char;
            }(char)
        }else{
            return new _node(char);
        }
    }
    _node.prototype = {
        constructor: _node,
        type:'Node',
        increase:function(){
            this.num++;
        }
    }
    return _node;
})();


var NodeController=(function(char){
    function _controller( char){
        var _this = this;
        if(_this instanceof _controller){
            _this.size=0;
            _this.list = [];
            _this.nodeMap={};
        }else{
            return new _controller(binary,char);
        }
    }
    _controller.prototype = {
        constructor: _controller,
        type:'NodeController',
        addChar:function(char){
            var node = this.nodeMap[char]||this.newInstanceNode(char);
            node.increase();
            this.nodeMap[char] =node; 
        },
        newInstanceNode:function(char){
            this.size ++;
            return new Node(char);
        },
        toList:function(){
            if(this.list.length==0){
                for(i in this.nodeMap){
                    this.list.push(this.nodeMap[i]);
                }
            }
            return this.list;
        }
        
    }
    return _controller;
})();

var CompressUtil = {
    int2Binary6:function (num){
        var mods = [0,0,0,0,0,0];
        var i = 0;
        while(num > 0){
            mods[i]=num%2;
            num  =  Math.floor(num/2);
            i++;
        }
        return mods.reverse().join('');
    },
    binary2Chinese:function(str){
        var result = [];
        var list = str.split(" ");
        for(var i=0;i<list.length;i++){
                var item = list[i];
                var asciiCode = parseInt(item,2);
                var charValue = String.fromCharCode(asciiCode);
                result.push(charValue);
        }
        return result.join("");
    },
    chinese2Binary:function(str){
        var result = [];
        var list = str.split("");
        for(var i=0;i<list.length;i++){
            if(i != 0){
                result.push(" ");
            }
            var item = list[i];
            var binaryStr = item.charCodeAt().toString(2);
            result.push(binaryStr);
        }   
        return result.join("");
    },
    codeTransCode:function(codes,len,insert){
        var newCode = "";
        var size = codes.length/len;
        for(var i=0;i<size;i++){
            newCode+= (codes.substring(i*len,(i+1)*len)+(i==size-1?'':insert));
        }
        return newCode;
    },
    codeTransCode6:function(codes){
        var code  = [];
        for(var i=0;i<codes.length/6-1;i++){
            code.push(codes.substring(i*6,(i+1)*6));
        }
        return code;
    },
    reSpellCode:function(base64String,nodeMap){
        var newString  = "";
        var tempBinary48 = "";
        for(var i=0;i<base64String.length;i++){
            tempBinary48+=nodeMap[base64String.substring(i,i+1)].binary;
            if(i%8==7){
                newString  += CompressUtil.binary2Chinese(CompressUtil.codeTransCode(tempBinary48,16," "));
                tempBinary48 ="";
            }
        }
        return newString;
    },
    desc:function(list){
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
    },
    asc:function(list){
        var tempCMN = {};
        for(var i=0;i<list.length;i++){
            for(var j=i+1;j<list.length;j++){
                if(list[i].num >list[j].num){
                    tempCMN = list[i];
                    list[i] = list[j];
                    list[j] = tempCMN;
                }
            }
        }
        return list;
    },
    codeTable:{'A':'000000','B':'000001','C':'000010','D':'000011','E':'000100','F':'000101','G':'000110','H':'000111','I':'001000','J':'001001','K':'001010','L':'001011','M':'001100','N':'001101','O':'001110','P':'001111','Q':'010000','R':'010001','S':'010010','T':'010011','U':'010100','V':'010101','W':'010110','X':'010111','Y':'011000','Z':'011001','a':'011010','b':'011011','c':'011100','d':'011101','e':'011110','f':'011111','g':'100000','h':'100001','i':'100010','j':'100011','k':'100100','l':'100101','m':'100110','n':'100111','o':'101000','p':'101001','q':'101010','r':'101011','s':'101100','t':'101101','u':'101110','v':'101111','w':'110000','x':'110001','y':'110010','z':'110011','0':'110100','1':'110101','2':'110110','3':'110111','4':'111000','5':'111001','6':'111010','7':'111011','8':'111100','9':'111101','+':'111110','/':'111111'},    
    decodeTable:{'000000':'A','000001':'B','000010':'C','000011':'D','000100':'E','000101':'F','000110':'G','000111':'H','001000':'I','001001':'J','001010':'K','001011':'L','001100':'M','001101':'N','001110':'O','001111':'P','010000':'Q','010001':'R','010010':'S','010011':'T','010100':'U','010101':'V','010110':'W','010111':'X','011000':'Y','011001':'Z','011010':'a','011011':'b','011100':'c','011101':'d','011110':'e','011111':'f','100000':'g','100001':'h','100010':'i','100011':'j','100100':'k','100101':'l','100110':'m','100111':'n','101000':'o','101001':'p','101010':'q','101011':'r','101100':'s','101101':'t','101110':'u','101111':'v','110000':'w','110001':'x','110010':'y','110011':'z','110100':'0','110101':'1','110110':'2','110111':'3','111000':'4','111001':'5','111010':'6','111011':'7','111100':'8','111101':'9','111110':'+','111111':'/'},
};









