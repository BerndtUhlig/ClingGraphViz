import os
import clingo
import clingraph
from django.http import HttpResponseBadRequest, HttpResponse
import ast
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .contexts import Input_Option, OptionsList, Option_Context, createOptionsList, NodeOptions, Select_Option_Class, Select_Option
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

    opt = Select_Option_Class(name="select_color", state="Green", options=["Blue", "Green", "Red"])
    print(opt.type)
    optionsList = OptionsList([
        NodeOptions("1","node", options=[Input_Option(type="text", name="change_color", state="hi"), Select_Option_Class(name="select_color", state="Green", options=["Blue", "Green", "Red"])]),
        NodeOptions("2","node", [Input_Option(type="checkbox", name="change_colores", state=False)]),
        NodeOptions("3","node", [Input_Option(type="checkbox", name="change_shape", state=True)]),
        NodeOptions("4","node", [Input_Option(type="checkbox", name="change_color", state=False)]),
        NodeOptions("5","node", [Input_Option(type="checkbox", name="change_color", state=True)]),
        NodeOptions("6","node", [Input_Option(type="checkbox", name="change_color", state=False)]),
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
    ctl.load("./ClingViz/encodings/program.lp")

    if len(user_input) > 0:
        ctl.add(user_input)
        ctl.load("./ClingViz/encodings/user-encoding.lp")

    ctl.ground()
    models = []
    with ctl.solve(yield_=True) as handle:
        for model in handle:
            models.append(str(model))

    if len(models) <= 0:
        if len(user_input) > 0:
            return HttpResponseBadRequest("There are no solutions to your program with this user input!")
        else:
            return HttpResponseBadRequest("There are no solutions to your program!")

    modelString = ".\n".join(models[0].split(" "))+"."
    print(modelString)
    ctl = clingo.Control()
    ctl.add(modelString)
    ctl.load("./ClingViz/encodings/encoding.lp")
    ctl.ground()
    fb = clingraph.Factbase()
    with ctl.solve(yield_=True) as handle:
        for model in handle:
            fb.add_model(model)
            break

    if len(fb.get_facts()) <= 0:
        return HttpResponseBadRequest("Your program and your clingraph encoding do not return a model (or do not return one that can be used by clingraph)")

    options_models = []
    clormCtl = ClormControl(unifier=[Option_Context, Select_Option])
    clormCtl.add(modelString)
    clormCtl.load("./ClingViz/encodings/options-encoding.lp")
    clormCtl.ground()
    with clormCtl.solve(yield_=True) as handle:
        for model in handle:
            print(model)
            facts = model.facts(atoms = True, terms = True)
            options_models.append(facts)
            break

    if(len(options_models) <= 0):
        return HttpResponseBadRequest("Could not solve your options encoding with your program output. No options will be displayed")

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






