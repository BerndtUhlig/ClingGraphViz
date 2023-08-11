option_context(node,N,checkbox,"show_children",true) :- show(N,node), show((N,M),edge), show(M,node).
option_context(node,N,checkbox,"show_children",false) :- -show(N,node).
option_context(node,N,checkbox,"show_children",false) :- show(N,node), not show((N,_),edge).

#show option_context/5.
