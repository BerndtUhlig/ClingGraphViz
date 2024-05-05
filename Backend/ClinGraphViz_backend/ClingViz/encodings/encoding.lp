node(I) :- arg(I).
edge((A,B)) :- att(A,B).

#show node/1.
#show edge/1.
#show attr(node,N,style,filled):node(N).
#show attr(node,N,fillcolor,green) : node(N), in(N).
#show attr(node,N,fillcolor,red) : node(N), not in(N), not undec(N).
#show attr(node,N,fillcolor,white) : node(N), undec(N).
#show attr(edge, (A,B), arrowhead, "normal"): edge((A,B)), att(A,B).
#show attr(edge, (A,B), dir, "forward"): edge((A,B)), att(A,B).