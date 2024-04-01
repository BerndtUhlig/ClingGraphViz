in(P) :- user_input(node,P,select,in_out,in).
out(P) :- user_input(node,P,select,in_out,out).

in(X) :- arg(X), not okOut(X), not undec(X).

