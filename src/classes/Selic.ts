import { ISelic } from "@/interfaces/ISelic";

export class Selic implements ISelic {
    data: Date | undefined;
    valor: number | undefined;

    constructor(data?: ISelic) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.data = _data["data"] ? new Date(_data["data"].toString()) : <any>undefined;
            this.valor = _data["valor"] ? parseFloat(_data["valor"]) : <any>undefined;
        }
    }

    static fromJS(data: any): Selic {
        data = typeof data === 'object' ? data : {};
        let result = new Selic();
        result.init(data);
        return result;
    }
}
