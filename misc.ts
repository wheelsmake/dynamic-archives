/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as localUtils from "./index";
export function checkType(dn :dataNode) :"s" | "t" | "ct" | "e"{
    if("prevs" in dn){
        if("nexts" in dn){
            if("frequency" in dn) return "ct";
            else return "t";
        }
        else return "e";
    }
    else return "s";
}
/**void懂的
 * 
 * **只能返回dataNode，不能确定target是什么类型的dataNode！***/
export function processTarget(data :[dataNode[], sourceDN[], transDN[], exportDN[]], target :string | dataNode) :dataNode | void{
    if(typeof target == "object"){
        if(data[0].indexOf(target) != -1) return target;
        else utils.generic.E("target", undefined, target, "cannot find this datanode");
    }
    else if(typeof target == "string"){
        for(let i = 0; i < data[0].length; i++) if(data[0][i].name === target) return data[0][i];
        utils.generic.E("target", undefined, target, "cannot find this datanode");
    }
    else utils.generic.E("target", "string | dataNode", target);
}