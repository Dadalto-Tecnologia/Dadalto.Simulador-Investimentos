import { IPoupanca } from "@/interfaces/IPoupanca";

export class Poupanca implements IPoupanca {
    data: Date | undefined;
    valor: number | undefined;

    constructor(data?: IPoupanca) {
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

    static fromJS(data: any): Poupanca {
        data = typeof data === 'object' ? data : {};
        let result = new Poupanca();
        result.init(data);
        return result;
    }
}
