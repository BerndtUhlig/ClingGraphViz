context("node",N,"select","select_color",C) :- node(N), color(C),  user_input("node",N,select,"select_color",C).
select_option("select_color",C) :- color(C).