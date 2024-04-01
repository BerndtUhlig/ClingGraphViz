option_context(node,P,select,in_out, out) :- arg(P), okOut(P).
option_context(node,P,select,in_out, in) :- arg(P), in(P).
option_context(node,P,select,in_out,undec) :- arg(P), undec(P).
select_option(in_out, in).
select_option(in_out, out).
select_option(in_out, undec).

#show select_option/2.
#show option_context/5.
