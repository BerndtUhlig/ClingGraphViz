node(1..6).

edge(
    (1,2); (1,3); (1,4);
    (2,4); (2,5); (2,6);
    (3,4); (3,5);
    (5,6)
).

color(red; green; blue).

{ assign(N, C) : color(C) } = 1 :- node(N).
assign(N,C) :- color(C), node(N), user_input("node",N,select,"select_color",C)
:- edge((N, M)), assign(N, C), assign(M, C).
