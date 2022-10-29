/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
//检查传入的tuid是否符合规则
export function checkTUID(id :string) :boolean{
    const preservedIDs :string[] = ["annotation-xml","color-profile","font-face","font-face-src","font-face-uri","font-face-format","font-face-name","missing-glyph"];
    var isValid = !!id.match("^[a-z0-9][a-z0-9-]+[a-z0-9]$");
    //if(!isValid) console.warn(`The specified tuID is invalid: ${id}. dynamic is going to generate one instead.`);
    if(preservedIDs.indexOf(id) != -1) utils.generic.EE(`The specified tuID is one of the preserved element names: ${id}. See https://html.spec.whatwg.org/#valid-custom-element-name for help.`);
    return isValid;
}
//生成id，abcdefgh-ijk
export function generateTUID() :string{
    return `${utils.generic.randoma2z029(11)}-${utils.generic.randoma2z029(17)}`;
}
export function generateDFID() :string{
    return `dfid-${utils.generic.randoma2z029(24)}`;
}
//检查dfid
export function checkDFID(id :string) :boolean{
    //todo:检查dfID是否合乎标准
    return true;
}