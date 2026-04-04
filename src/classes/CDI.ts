import { ICDI } from "@/interfaces/ICDI";

export class CDI implements ICDI {
    VALDATA: Date | undefined;
    VALVALOR: number | undefined;

    constructor(data?: ICDI) {
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

    static fromJS(data: any): CDI {
        data = typeof data === 'object' ? data : {};
        let result = new CDI();
        result.init(data);
        return result;
    }
}
