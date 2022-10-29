/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
interface dataNodeBase{
    name :string;
    //现在由扩展分别定义
    //methods :Record<string, Function>;
}
interface transDN extends dataNodeBase{
    methods :{
        get() :any;
        update(data :any) :any;
        [x :string] :Function;
    }
    prevs :prevDN[];
    nexts :nextDN[];
    value :any;
    frequency :number;
}
interface exportDN extends dataNodeBase{
    methods :{
        export() :void;
    }
    prevs :prevDN[];
}

type dataNode = transDN | exportDN;