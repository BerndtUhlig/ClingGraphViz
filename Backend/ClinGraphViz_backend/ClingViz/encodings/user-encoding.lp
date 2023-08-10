ast_show(node, N)  :- ast_node(N,type,_), user_input(node,N,select,show_children,true).

#show user_input/5.
#show ast_show/2.