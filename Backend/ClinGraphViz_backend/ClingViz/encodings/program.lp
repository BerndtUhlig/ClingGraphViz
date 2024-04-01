arg(a).
arg(b).
arg(c).
arg(d).
arg(e).
arg(f).
att(a,b).
att(b,a).
att(c,b).
att(d,e).
att(e,b).
att(f,a).
att(a,f).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Encoding for naive extensions
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Guess a set S \subseteq A
undec(X) :- arg(X), not in(X), not okOut(X).

%% S has to be conflict-free
:- in(X), in(Y), att(X,Y).

%% Check Maximality

okOut(X) :- in(Y), att(Y,X).
okOut(X) :- in(Y), att(X,Y).
okOut(X) :- att(X,X).
:-  out(X), not okOut(X).

#show okOut/1.
#show in/1.
#show undec/1.
