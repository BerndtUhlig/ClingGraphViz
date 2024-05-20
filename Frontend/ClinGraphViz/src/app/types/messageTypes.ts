import { NodeOptions } from "./options"

export interface GraphRequest {
    user_input: string,
    semantic: string
}

export interface GraphResponse {
    data: string[],
    option_data: NodeOptions[]
    semantic_names: string[];
}
