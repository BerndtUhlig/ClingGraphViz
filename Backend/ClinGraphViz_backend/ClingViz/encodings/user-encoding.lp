user_in(P) :- user_input(node,P,select,in_out,in).
user_out(P) :- user_input(node,P,select,in_out,out).

:- in(X), user_out(X).
:- out(X), user_in(X).