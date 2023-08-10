option_context(node,N,checkbox,"show_children",true) :- ast_show(node, N), ast_show(edge,(N,M)), ast_show(node,M).
option_context(node,N,checkbox,"show_children",false) :- ast_show(node,N), ast_hide(edge,(N,M)).
{ option_context(node,N,checkbox,"show_children",V) : ast_show(node,N) } = 1 :- ast_node(N,_,_).
#show option_context/5.
