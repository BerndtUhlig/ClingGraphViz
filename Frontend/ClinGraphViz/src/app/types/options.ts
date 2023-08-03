export interface Option {
    name: string,
    type: string
}

export interface NodeOptions {
    id: string,
    compType: string
    options: Option[]
}