import { NodeOptions } from "./options"

export interface GraphRequest {
    user_input: string
}

export interface GraphResponse {
    data: string,
    option_data: NodeOptions[]
}
