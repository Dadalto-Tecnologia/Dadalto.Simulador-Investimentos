import { IIPCA } from "@/interfaces/IPCA";

export class IPCA implements IIPCA {
    VALDATA: Date | undefined;
    VALVALOR: number | undefined;

    constructor(data?: IIPCA) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.VALDATA = _data["VALDATA"] ? new Date(_data["VALDATA"].toString()) : <any>undefined;
            this.VALVALOR = _data["VALVALOR"] ? parseFloat(_data["VALVALOR"]) : <any>undefined;
        }
    }

    static fromJS(data: any): IPCA {
        data = typeof data === 'object' ? data : {};
        let result = new IPCA();
        result.init(data);
        return result;
    }
}
