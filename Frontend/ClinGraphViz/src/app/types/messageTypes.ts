import { NodeOptions } from "./options"

export interface GraphRequest {
    user_input: string,
    semantic: string
}

export interface GraphResponse {
    data: string[],
    option_data: NodeOptions[]
}

export interface SemanticResponse {
    semantic_names: string[];
}
