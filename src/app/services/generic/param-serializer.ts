import { HttpParams } from '@angular/common/http';

export class ParamSerializer {
    serialize(val: any, params?: HttpParams, prefix?: string): string {
        if (params === null || params === undefined) {
            params = new HttpParams();
        }

        if (!val) {
            return '';
        }

        if (typeof val === 'object') {
            params = this.serializeObject(val, params, '');
        }

        return params.toString();
    }

    private serializeObject(obj: Object, params?: HttpParams, prefix?: string): HttpParams {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const myPrefix = prefix ? prefix + '.' + key : key;

                if (Array.isArray(obj[key])) {
                    params = this.serializeArray(obj[key], params, myPrefix);
                } else if (typeof obj[key] === 'boolean') {
                    params = params.append(myPrefix, obj[key]);
                } else if (typeof obj[key] === 'string' && obj[key] !== '') {
                    params = params.append(myPrefix, obj[key]);
                } else if (typeof obj[key] === 'number') {
                    params = params.append(myPrefix, obj[key]);
                } else if (obj[key] === null || obj[key] === undefined) {
                    // do nothing
                } else if (typeof obj[key] === 'object') {
                    params = this.serializeObject(obj[key], params, myPrefix);
                }
            }
        }

        return params;
    }

    private serializeArray(arr: Array<any>, params?: HttpParams, prefix?: string): HttpParams {
        for (let key = 0; key < arr.length; key++) {
            const myPrefix = prefix + '[' + key + ']';

            if (Array.isArray(arr[key])) {
                params = this.serializeArray(arr[key], params, myPrefix);
            } else if (typeof arr[key] === 'boolean') {
                params = params.append(myPrefix, arr[key]);
            } else if (typeof arr[key] === 'string' && arr[key] !== '') {
                params = params.append(myPrefix, arr[key]);
            } else if (typeof arr[key] === 'number') {
                params = params.append(myPrefix, arr[key]);
            } else if (arr[key] === null || arr[key] === undefined) {
                // do nothing
            } else if (typeof arr[key] === 'object') {
                params = this.serializeObject(arr[key], params, myPrefix);
            }
        }

        return params;
    }


}
