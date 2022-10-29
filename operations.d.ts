/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
interface sDNOperations{
    connectTo(target :string | nextDN) :anyDNOperations;
    disconnectTo(target :string | nextDN) :anyDNOperations;

    existsNext(target :string | nextDN) :boolean;

    fetchNow() :void;
    get frequency() :number;
    set frequency() :void;
    get value() :any; //note:开发模式下生效
}
interface tDNOperations{
    connectTo(target :string | nextDN) :anyDNOperations;
    disconnectTo(target :string | nextDN) :anyDNOperations;
    connectFrom(target :string | prevDN) :anyDNOperations;
    disconnectFrom(target :string | prevDN) :anyDNOperations;

    existsPrev(target :string | prevDN) :boolean;
    existsNext(target :string | nextDN) :boolean;
}
interface ctDNOperations extends tDNOperations{
    updateNow() :void;
    get frequency() :number;
    set frequency() :void;
    get value() :any; //note:开发模式下生效
}
interface eDNOperations{
    connectFrom(target :string | prevDN) :anyDNOperations;
    disconnectFrom(target :string | prevDN) :anyDNOperations;

    existsPrev(target :string | prevDN) :boolean;
}
type anyDNOperations = sDNOperations | tDNOperations | eDNOperations;