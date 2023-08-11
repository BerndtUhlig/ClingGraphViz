node(N) :- show(N, node).
edge(M) :- show(M,edge).

#show attr(node, N, style, filled): show(N, node).
#show attr(node, N, color, C) : assign(N, C).
