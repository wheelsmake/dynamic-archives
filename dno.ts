/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as localUtils from "./index";
export function connectTo(
    data :[dataNode[], sourceDN[], transDN[], exportDN[]],
    objective :prevDN, target :string | nextDN
) :nextDN | void{
    const targetDN :dataNode = localUtils.misc.processTarget(data, target)!;
    //是否是源节点，源节点不能被连接
    if(data[1].indexOf(targetDN as any) != -1) utils.generic.EE("Source datanodes cannot be connected.");
    //是否已经连接了，重复的不要
    //argument:这里是否需要双边检测？如果可能存在单边连接，则需要这样做。目前仅检测objective方。
    else if(objective.nexts.indexOf(targetDN as nextDN) != -1) utils.generic.E("target", undefined, target, "duplicated next nodes");
    else{
        const targetDN2 = targetDN as nextDN;
        objective.nexts.push(targetDN2);
        targetDN2.prevs.push(objective);
        //这里已经可以确定target是nextDN了
        return targetDN2;
    }
}
export function disconnectTo(
    data :[dataNode[], sourceDN[], transDN[], exportDN[]],
    objective :prevDN, target :string | nextDN
) :nextDN | void{
    const targetDN :dataNode = localUtils.misc.processTarget(data, target)!;
    //是否是源节点
    if(data[1].indexOf(targetDN as any) != -1) utils.generic.EE("Source datanodes cannot be connected, thus wont be disconnected.");
    //是否没有连接argument:与上面一样
    else if(objective.nexts.indexOf(targetDN as nextDN) == -1) utils.generic.E("target", undefined, target, "cannot find it as next nodes");
    else{
        const targetDN2 = targetDN as nextDN;
        utils.generic.precisePop(targetDN2, objective.nexts);
        utils.generic.precisePop(objective, targetDN2.prevs);
        return targetDN2;
    }
}
export function connectFrom(
    data :[dataNode[], sourceDN[], transDN[], exportDN[]],
    objective :nextDN, target :string | prevDN
) :prevDN | void{
    const targetDN :dataNode = localUtils.misc.processTarget(data, target)!;
}
export function disconnectFrom(
    data :[dataNode[], sourceDN[], transDN[], exportDN[]],
    objective :nextDN, target :string | prevDN
) :prevDN | void{
    const targetDN :dataNode = localUtils.misc.processTarget(data, target)!;
}
export function existsPrev(
    data :[dataNode[], sourceDN[], transDN[], exportDN[]],
    objective :nextDN, target :string | prevDN
) :boolean{
    const targetDN :dataNode = localUtils.misc.processTarget(data, target)!;
    return false;
}
export function existsNext(
    data :[dataNode[], sourceDN[], transDN[], exportDN[]],
    objective :prevDN, target :string | nextDN
) :boolean{
    const targetDN :dataNode = localUtils.misc.processTarget(data, target)!;
    return false;
}