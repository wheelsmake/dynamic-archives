/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as localUtils from "./index";
/**看清我是**S**！！*/
export function createSDN(args :sDNcreateArgs) :sourceDN{
    checkArgs("s", args);
    const result = {
        name: args.name,
        methods: "methods" in args ? args.methods! : {},
        fetch: args.fetch,
        value: undefined,
        frequency: args.frequency,
        nexts: []
    };
    utils.generic.constantize(result);
    return result;
}
/**看清我是**T**！！*/
export function createTDN(args :tDNcreateArgs) :transDN{
    checkArgs("t", args);
    const result :anyObject = {};
    result.name = args.name;
    result.methods = "methods" in args ? args.methods! : {};
    //决定是否为缓存传递节点
    if("frequency" in args) result.frequency = args.frequency;
    //else 这里什么都不做
    if("get" in args) result.get = args.get;
    else result.get = function() :any{
        return this.value; //这里的this是精心设计好的，不会是数据节点本身
    };
    if("set" in args) result.set = args.set;//todo:
    else result.set = function(data :any) :any{
        this.value = data; //同L29
    }
    result.prevs = [];
    result.nexts = [];
    utils.generic.constantize(result);
    return (result as transDN);
}
/**看清我是**E**！！*/
export function createEDN(args :eDNcreateArgs) :exportDN{
    checkArgs("e", args);
    const result = {
        name: args.name,
        methods: "methods" in args ? args.methods! : {},
        export: args.export,
        prevs: []
    };
    utils.generic.constantize(result);
    return result;
}

function checkArgs(type :"s" | "t" | "e", args :any/*只能写any，否则第一个if后全是never因为ts认为第一个if一定会走，
                有时候觉得ts反而增加了逻辑的难度，这是变量的验证期啊，你ts怎么知道别人传进来的一定是对的？？？？？*/) :void{
    //重用字符串
    const a = "args", b = "DNCreateArgs", c = " is invalid";
    //没name
    if(!("name" in args)) utils.generic.E(a, b, args, `${a}.name${c}`);
    //methods不符合规范（不完全验证，因为貌似没有可以不用循环判断一个对象里是否都是某类型的方法）
    //没关系，methods我们不需要验证太多，等到调用的时候让开发者自己懵逼吧
    //note: typeof xxx == "type" 是可以的，typeof运算比比较运算优先级高
    //并且其实"sth" in obj的in运算也比比较运算优先级高
    else if("methods" in args && typeof args.methods != "object") utils.generic.E(a, b, args, `${a}.methods${c}`);
    else switch(type){
        case "s":
            //fetch不对劲
            if(!("fetch" in args) || typeof args.fetch != "function") utils.generic.E(a, `s${b}`, args, `${a}.fetch${c}`);
            //frequency不对劲
            else if(!("frequency" in args) || typeof args.frequency != "number" || args.frequency < 0) utils.generic.E(a, `s${b}`, args, `${a}.frequency${c}`);
            break;
        case "t":
            //frequency不是数字或小于0（等于0则为常量）
            //没frequency则创建普通传递节点，否则创建缓存传递节点
            if("frequency" in args && (typeof args.frequency != "number" || args.frequency < 0)) utils.generic.E(a, `t${b}`, args, `${a}.frequency${c}`);
            break;
        case "e":
            //export不对劲
            if(!("export" in args) || typeof args.export != "function") utils.generic.E(a, `e${b}`, args, `${a}.export${c}`);
            break;
        default:
            //绝不会走到这里
            utils.generic.EE("?");
            break;
    }
}