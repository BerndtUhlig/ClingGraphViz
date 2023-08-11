show(1, node).
node(1..6).

edge(
    (1,2); (1,3); (1,4);
    (2,4); (2,5); (2,6);
    (3,4); (3,5);
    (5,6)
).

color(red; green; blue).

{ assign(N, C) : color(C) } = 1 :- show(N, node).

:- edge((N, M)), assign(N, C), assign(M, C).

-show(N, node) :- node(N), not show(N, node).
-show(N, edge) :- edge(N), not show(N, edge).

:- show(N, _), -show(N,_).

show((N,M), edge) :- edge((N,M)), show(N, node), show(M, node).

#show show/2.
#show assign/2.
#show -show/2.