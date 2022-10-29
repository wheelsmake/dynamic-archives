/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import dataFlow from "./dataFlow";
import * as utils from "../../utils/index";
import * as localUtils from "./utils";
interface registerArgs{
    element :Element;
    tuID? :tuID;
    remove? :boolean;
}
interface renderArgs{
    tuID :tuID;
    element :Element;
    slots? :anyObject;
    removeOuterElement? :boolean;
    insertAfter? :boolean;
    append? :boolean;
    disableDF? :boolean;
}
interface updateArgs{
    tuID :tuID;
    element :Element;
}
export default class template{
    #options :dynamicOptions;
    #templates :templateObject[] = [];
    #instances :instanceObject[] = [];
    #observer :MutationObserver;
    constructor(options :dynamicOptions){
        this.#options = options;
        this.#convertTemplate();
        this.#observer = new MutationObserver(this.#observerCB);
        this.#observer.observe(document.body,{
            childList: true,
            subtree: true
        });
    }
    //注册模板核心方法，不用判断nodynamic dynamic了！
    register(args :registerArgs) :string{
        if(args.tuID !== undefined && !localUtils.checkTUID(args.tuID)) utils.generic.E("tuID", "string with some limitations", `${args.tuID}, read the documentation for help`);
        else if(args.tuID === undefined) args.tuID = localUtils.generateTUID();
        const tem :templateObject = {
            id: args.tuID,
            content: args.element.cloneNode(true) as Element
        };
        this.#templates.push(tem);
        if(args.remove === true) args.element.remove();
        return args.tuID;
    }
    //超级核心方法todo:添加渲染限制
    render(args :renderArgs) :Node[] | void{
        for(let i = 0; i < this.#templates.length; i++){
            if(this.#templates[i].id === args.tuID){
                const content = this.#templates[i].content.cloneNode(true);
                //slots变量替换
                if(content instanceof Element) this.#parseSlots(content, args.slots);
                var nodes :Node[] = [];
                if(args.removeOuterElement === true) nodes = utils.element.getInnerNodes(content);
                else nodes[0] = content;
                return utils.element.render(nodes, args.element, args.insertAfter, args.append, args.disableDF);
            }
        }
        utils.generic.E("tuID", "valid ID that exists", args.tuID);
    }
    update(args :updateArgs) :Element | null{
        for(let i = 0; i < this.#templates.length; i++) if(this.#templates[i].id === args.tuID){
            if(args.element instanceof Element){
                const oldContent = this.#templates[i].content;
                this.#templates[i].content = args.element;
                return oldContent;
            }
            else utils.generic.E("element", "Element", args.element);
        }
        return null;
    }
    delete(tuID :tuID) :Element | null{
        for(let i = 0; i < this.#templates.length; i++) if(this.#templates[i].id === tuID){
            let content = this.#templates[i].content;
            this.#templates.splice(i, 1);
            return content;
        }
        return null;
    }
    getContent(tuID :tuID) :Element | null{
        for(let i = 0; i < this.#templates.length; i++) if(this.#templates[i].id === tuID) return this.#templates[i].content;
        return null;
    }
    existsTUID(tuID :tuID) :boolean{
        for(let i = 0; i < this.#templates.length; i++) if(this.#templates[i].id === tuID) return true;
        return false;
    }
    existsElement(element :Element) :string | null{
        for(let i = 0; i < this.#templates.length; i++) if(this.#templates[i].content.isEqualNode(element)) return this.#templates[i].id;
        return null;
    }
    //获取所有模板
    getTemplates() :templateObject[]{return this.#templates;}
    getInstance(tuID :tuID) /*:instanceObject | instanceObject[]*/{
        //todo:传入tuid，获取已实例化的模板列表
        /*return [{
            reference: ,
            slots:[

            ]
        }];*/
    }
    #parseSlots = (target :Element, argSlots? :anyObject) :void=>{
        const slots = utils.element.e("slot", target) as HTMLSlotElement[]; //用非id的css选择器就一定返回Node[]
        //console.log(slots);
        for(let j in argSlots) if(argSlots[j] === undefined) delete argSlots[j];  //预先把魔法字扔掉，可以省复杂度
        if(argSlots !== undefined && slots.length != 0) for(let i = 0; i < slots.length; i++){ //用一个attribute比遍整个args.slot
            const attr = slots[i].getAttribute("name"), isHTMLSlot = slots[i].getAttribute("html") === "";
            if(attr === null || attr === "") continue;
            for(let j in argSlots) if(j === attr){
                const content = argSlots[j];
                //if(content === undefined) continue; //魔法字 //预先扔掉省复杂度#L118
                if(isHTMLSlot) slots[i].innerHTML = content;
                else slots[i].innerText = content;
            }
        }
        if(slots.length != 0) for(let i = 0; i < slots.length; i++){ //转换slots节点到文本节点
            const par = slots[i].parentElement!;
            utils.element.hatch(slots[i], true);
            par.normalize();
        }
    }
    #getTemplateObject = (tuID :tuID) :object | null=>{
        for(let i = 0; i < this.#templates.length; i++) if(this.#templates[i].id === tuID) return this.#templates[i];
        return null;
    }
    //observer回调方法
    #observerCB = (resultList :MutationRecord[], observer :MutationObserver) :void=>{
        for(let i = 0; i < resultList.length; i++) for(let j = 0; j < resultList[i].addedNodes.length; j++){
            const ele = resultList[i].addedNodes[j];
            if(!(ele instanceof Element)) return; //不处理文本注释节点
            //template增量注册
            if(ele instanceof HTMLTemplateElement/*t && ele.getAttribute("nodynamic") === null //放到convertTemplate里面做，不要混乱分工*/) this.#convertTemplate(ele);
            //释放tuid检测与渲染模板
            if(this.getContent(ele.tagName.toLowerCase())){
                //识别模板变量并插入
                //const slots = utils.e("slots", ele) as HTMLSlotElement[]; //note:自定义标签名元素设置的innerHTML无法使用querySelectorAll，只能遍历节点
                var slots :HTMLSlotElement[] = [];
                for(let i = 0; i < ele.childNodes.length; i++){
                    const child = ele.childNodes[i] as Node;
                    if(child instanceof Element && child.tagName === "SLOT") slots.push(child as HTMLSlotElement);
                }
                //console.log(ele.childNodes, ele.innerHTML, ele, slots);
                var argSlots :anyObject = {};
                for(let i = 0; i < slots.length; i++){
                    const name = slots[i].getAttribute("name");
                    if(name === null || name === "") continue; //到#parseSlots后会处理这种没name的玩意
                    argSlots[name] = slots[i].innerHTML; //到#parseSlots后还有个innerText挡住呢
                }
                //console.log(argSlots);
                ele.innerHTML = ""; //全部清空，slots已经提取出来了
                this.render({
                    tuID: ele.tagName.toLowerCase(),
                    element: ele,
                    slots: argSlots
                });
                utils.element.hatch(ele, true);
            }
        }
    }
    //从template增量注册与起始注册混用方法，检测template声明式attribute。
    #convertTemplate = (template_input? :HTMLTemplateElement) :void=>{
        const goRender = (template :HTMLTemplateElement) :void=>{
            if(template.getAttribute("nodynamic") === null){
                var tuid = template.getAttribute("tuid");
                if(!tuid || !localUtils.checkTUID(tuid)) tuid = localUtils.generateTUID();
                //干掉template的shadow dom
                const el = document.createElement("div"), children = utils.element.getInnerNodes(template.content);
                for(let i = 0; i < children.length; i++) el.appendChild(children[i]);
                //提前remove掉dynamic的template
                if(template.getAttribute("dynamic") !== null) template.remove();
                this.register({
                    element: el,
                    tuID: tuid,
                    remove: true //这里不写是因为传入的是游离dom //argument:到底写不写？
                });
            }
        };
        if(template_input === undefined){
            const templates = document.querySelectorAll("template");
            for(let i = 0; i < templates.length; i++) goRender(templates[i]);
        }
        else goRender(template_input);
    }
}