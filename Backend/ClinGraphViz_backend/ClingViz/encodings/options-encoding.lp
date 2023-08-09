option_context(node,N,select,"select_color",C) :- node(N), attr(node, N, color, C).
select_option("select_color",C) :- attr(node, N, color, C),option_context(node,N,select,"select_color",C).

#show option_context/5.
#show select_option/2.