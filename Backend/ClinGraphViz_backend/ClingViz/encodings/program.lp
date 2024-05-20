

arg(a).
arg(b).
arg(c).
arg(d).
arg(e).
arg(f).
att(a,b).
att(b,a).
att(a,c).
att(b,c).
att(c,d).
att(d,f).
att(e,d).
att(e,f).
att(f,e).

undec(P) :- arg(P), not user_in(P), not user_out(P), not in(P), not out(P).
