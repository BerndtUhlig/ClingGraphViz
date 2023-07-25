import json

import clingo
import clingraph
import os
from django.http import HttpResponse, HttpResponseBadRequest


def encode_and_make_graph(program: (str), encoding: (str)):
    print("Clingo control")
    ctl = clingo.Control()
    ctl.load(program)
    ctl.load(encoding)
    ctl.ground(context=clingraph.clingo_utils.ClingraphContext())
    models = []
    print("Creating factbase")
    fb = clingraph.Factbase()
    with ctl.solve(yield_=True) as handle:
        for model in handle:
            print("Adding model")
            fb.add_model(model)
            print(fb.get_facts())
            break
    if len(fb.get_facts()) <= 0:
        return HttpResponseBadRequest("Your program and encoding do not produce a viable graph.")
    print("Factbase with length > 0")
    graphs = clingraph.compute_graphs(fb, graphviz_type="digraph")
    clingraph.render(graphs, format="svg")
    with open('out/default.svg', 'r') as svg_file:
        svg_content = svg_file.read()
    print("Done. Sending response...")
    raw = {"data":svg_content}
    js = json.dumps(raw)
    response = HttpResponse(js, content_type='image/svg+xml', status=200)
    response['Content-Disposition'] = 'attachment; filename="default.svg'
    return response