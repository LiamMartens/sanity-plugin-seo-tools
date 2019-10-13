export interface IType<O = Record<string, any>> {
    name: string;
    hidden?: boolean;
    level: number;
    type: string;
    fields: any[];
    options: O;
}