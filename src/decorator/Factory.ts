const factory: {[key: string]: any} = {};

export function Resource (attrName: string) {
    return (target: any, propertyKey: string) => {

        Object.defineProperty(target, propertyKey, {
            get ():  any {
                return factory[attrName];
            }
        });
    };
}

export function Service (injectName: string) {
    return (target: any) => {
        target.prototype.injectName = injectName;
    };
}

export function Repository (injectName: string) {
    return (target: any) => {
        target.prototype.injectName = injectName;
    };
}

export {factory};
