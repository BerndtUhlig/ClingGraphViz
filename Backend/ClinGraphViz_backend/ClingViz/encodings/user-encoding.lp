show(M, node) :- node(N), node(M), edge((N,M)), user_input(node,N,checkbox,show_children, true).

#show user_input/5.
