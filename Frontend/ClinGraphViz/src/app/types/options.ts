export interface Option {
    name: string,
    type: string,
    state: any
}

export interface NodeOptions {
    id: string,
    compType: string
    options: Option[]
}