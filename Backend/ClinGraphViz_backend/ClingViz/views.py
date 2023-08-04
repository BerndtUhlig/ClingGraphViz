import os

import clingo
import clingraph
from django.http import HttpResponseBadRequest, HttpResponse
import ast
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .contexts import Option, OptionsList, VizContext, createOptionsList, NodeOptions
from clorm.clingo import Control as ClormControl


# Create your views here.
import json

@require_http_methods(["POST"])
@csrf_exempt
def mockViz(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError as e:
        return HttpResponseBadRequest("An error occured: {msg}".format(msg=e.msg))

    if not "user_input" in body.keys():
        return HttpResponseBadRequest("The request body did not contain 'user_input'")

    print(body)
    with open('out/color.svg', 'r') as svg_file:
        svg_content = svg_file.read()

    optionsList = OptionsList([
        NodeOptions("1","node", options=[Option(type="text",name="change_color", state="hi"), Option(type="checkbox",name="change_child",state=False)]),
        NodeOptions("2","node" , [Option(type="checkbox", name="change_colores", state=False)]),
        NodeOptions("3","node", [Option(type="checkbox", name="change_shape", state=True)]),
        NodeOptions("4","node", [Option(type="checkbox", name="change_color", state=False)]),
        NodeOptions("5","node", [Option(type="checkbox", name="change_color", state=True)]),
        NodeOptions("6","node", [Option(type="checkbox", name="change_color", state=False)]),
    ])

    raw = {"data":svg_content, "option_data": optionsList.toJson()}
    js = json.dumps(raw)
    return HttpResponse(js, content_type='application/json', status=200)




@require_http_methods(["PUT"])
@csrf_exempt
def graphUpdate(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError as e:
        return HttpResponseBadRequest("An error occured: {msg}".format(msg=e.msg))

    if not "user_input" in body.keys():
        return HttpResponseBadRequest("The request body did not contain user inputs")

    user_input = body["user_input"]
    ctl = clingo.Control()
    ctl.load("./encodings/program.lp")
    ctl.add(user_input)
    ctl.ground()
    models = []
    with ctl.solve(yield_=True) as handle:
        for model in handle:
            models.append(model.symbols(atoms=True))

    ctl.load("./encodings/encoding.lp")
    ctl.add(models[0].__str__())
    ctl.ground()
    fb = clingraph.Factbase()
    with ctl.solve(yield_=True) as handle:
        for model in handle:
            fb.add_model(model)
            break

    ctl.load("./encodings/options-encoding.lp")
    ctl.add(models[0].__str__())
    options_models = []
    clormCtl = ClormControl(unifier=[VizContext])
    with clormCtl.solve(yield_=True) as handle:
        for model in handle:
            options_models.append(model.facts(atoms=True))
            break

    oL:OptionsList = createOptionsList(options_models[0])
    graph = clingraph.compute_graphs(fb)
    clingraph.render(graph, format="svg")
    with open('out/default.svg', 'r') as svg_file:
        svg_content = svg_file.read()
    print("Done. Sending response...")
    raw = {"data": svg_content, "option_data": oL.toJson()}
    js = json.dumps(raw)
    response = HttpResponse(js, content_type='application/json', status=200)
    return response






