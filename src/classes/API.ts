import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Selic } from "./Selic";
import { URL_SELIC, URL_CDI, URL_IPCA, URL_POUPANCA } from '@/data/urls'
import { CDI } from "./CDI";
import { IPCA } from "./IPCA";
import { Poupanca } from "./Poupanca";

// Cliente responsável por buscar dados históricos da SELIC no serviço público.
export class SelicClient {

    getAll(): Promise<Selic[]> {
        let url_ = URL_SELIC;

        let options_: AxiosRequestConfig = {
            method: "GET",
            url: url_,
            headers: {
                "Accept": "application/json"
            }
        };

        let result = axios.get(url_, options_);
        return result.then((response: AxiosResponse) => this.processGetAll(response));
    };

    protected processGetAll(response: AxiosResponse): Promise<Selic[]> {
        const status = response.status;
        let _headers: any = {};
        if (status === 200) {
            const _responseText = response.data;
            let result200: any = null;
            let resultData200 = _responseText;
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(Selic.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return Promise.resolve<Selic[]>(result200);

        } else if (status !== 200 && status !== 204) {
            const _responseText = response.data;
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }
        return Promise.resolve<Selic[]>(null as any);
    }
}

// Cliente responsável por buscar dados do CDI.
export class CDIClient {

    getAll(): Promise<CDI[]> {
        let url_ = URL_CDI;

        let options_: AxiosRequestConfig = {
            method: "GET",
            url: url_,
            headers: {
                "Accept": "application/json"
            }
        };

        let result = axios.get(url_, options_);
        return result.then((response: AxiosResponse) => this.processGetAll(response));
    };

    protected processGetAll(response: AxiosResponse): Promise<CDI[]> {
        const status = response.status;
        let _headers: any = {};
        if (status === 200) {
            const _responseText = response.data.value;
            let result200: any = null;
            let resultData200 = _responseText;
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(CDI.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return Promise.resolve<CDI[]>(result200);

        } else if (status !== 200 && status !== 204) {
            const _responseText = response.data;
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }
        return Promise.resolve<CDI[]>(null as any);
    }
}

// Cliente responsável por buscar dados do IPCA.
export class IPCAClient {

    getAll(): Promise<IPCA[]> {
        let url_ = URL_IPCA;

        let options_: AxiosRequestConfig = {
            method: "GET",
            url: url_,
            headers: {
                "Accept": "application/json"
            }
        };

        let result = axios.get(url_, options_);
        return result.then((response: AxiosResponse) => this.processGetAll(response));
    };

    protected processGetAll(response: AxiosResponse): Promise<IPCA[]> {
        const status = response.status;
        let _headers: any = {};
        if (status === 200) {
            const _responseText = response.data.value;
            let result200: any = null;
            let resultData200 = _responseText;
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(IPCA.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return Promise.resolve<IPCA[]>(result200);

        } else if (status !== 200 && status !== 204) {
            const _responseText = response.data;
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }
        return Promise.resolve<IPCA[]>(null as any);
    }
}

// Cliente responsável por buscar os rendimentos da poupança.
export class PoupancaClient {

    getAll(): Promise<Poupanca[]> {
        let url_ = URL_POUPANCA;

        let options_: AxiosRequestConfig = {
            method: "GET",
            url: url_,
            headers: {
                "Accept": "application/json"
            }
        };

        let result = axios.get(url_, options_);
        return result.then((response: AxiosResponse) => this.processGetAll(response));
    };

    protected processGetAll(response: AxiosResponse): Promise<Poupanca[]> {
        const status = response.status;        
        let _headers: any = {};
        if (status === 200) {            
            const _responseText = response.data;
            let result200: any = null;
            let resultData200 = _responseText;
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(Poupanca.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return Promise.resolve<Poupanca[]>(result200);

        } else if (status !== 200 && status !== 204) {
            const _responseText = response.data;
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }
        return Promise.resolve<Poupanca[]>(null as any);
    }
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}


function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}