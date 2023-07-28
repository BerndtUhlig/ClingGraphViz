import os

import clingo
import clingraph
from django.http import HttpResponseBadRequest, HttpResponse
import ast
from .scripts import reify_ast
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from . import helperFuncs


# Create your views here.
import json

@require_http_methods(["PUT"])
@csrf_exempt
def graphUpdate(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError as e:
        return HttpResponseBadRequest("An error occured: {msg}".format(msg=e.msg))

    if not "user-input" in body.keys():
        return HttpResponseBadRequest("The request body did not contain user inputs")

    user_input = body["user-input"]
    ctl = clingo.Control()
    ctl.load("./encodings/program.lp")
    ctl.add(user_input)

@require_http_methods(["GET"])
@csrf_exempt
def graphInit():


        ctl = clingo.Control()
        ctl.load("./encodings/program.lp")
        ctl.ground()
        models = []
        with ctl.solve(yield_= True) as handle:
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
        with ctl.solve(yield_=True) as handle:
            for model in handle:
                options_models.append(model.symbols(atoms=True))
                break

        graph = clingraph.compute_graphs(fb)
        clingraph.render(graph,format="svg")
        with open('out/default.svg', 'r') as svg_file:
            svg_content = svg_file.read()
        print("Done. Sending response...")
        raw = {"data": svg_content, "option-data": options_models.__str__()}
        js = json.dumps(raw)
        response = HttpResponse(js, content_type='application/json', status=200)
        return response



