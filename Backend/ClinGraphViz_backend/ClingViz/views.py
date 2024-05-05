import os
import clingo
import clingraph
from django.http import HttpResponseBadRequest, HttpResponse, HttpResponseServerError
import ast
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .contexts import Input_Option, OptionsList, Option_Context, createOptionsList, NodeOptions, Select_Option_Class, Select_Option
from clorm.clingo import Control as ClormControl
from .loggerCallback import ClingoLogger
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

    print(optionsList.toJson())
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
    first_call = len(user_input) > 0
    semantic = body["semantic"]
    print("User Input: " + user_input)
    try:
        ctl = clingo.Control(logger=ClingoLogger.logger, arguments=["--models=0"])
        ctl.load("./ClingViz/encodings/program.lp")

        if first_call:
            ctl.add(user_input)
            ctl.load("./ClingViz/encodings/user-encoding.lp")
            if(semantic not in ["adm","cf2","comp","ground","naive","res_ground","stable"]):
                return HttpResponseBadRequest("Provided semantic not in list")
            ctl.load("./ClingViz/encodings/AFSemantics/"+semantic+".dl")

        ctl.ground()
        models = []
        with ctl.solve(yield_=True) as handle:
            for model in handle:
                symbols = model.symbols(atoms=True, terms=True)
                models.append([str(symbol) for symbol in symbols])

        if len(models) <= 0:
            if len(user_input) > 0:
                return HttpResponseBadRequest("There are no solutions to your program with this user input!")
            else:
                return HttpResponseBadRequest("There are no solutions to your program!")
    except RuntimeError as e:
        return HttpResponseServerError(
            "An error occurred while solving/grounding your program and user input: " + str(e) + "\n" + "Particular: " + ClingoLogger.errorString())

    modelStrings = []
    for model in models:
        mstr:str = ".\n".join(model) + "."
        modelStrings.append(mstr)

    for i in range(len(modelStrings)):
        print("Model No." + str((i+1)) + ":\n")
        print(modelStrings[i])

    fb = []
    try:
        for mstring in modelStrings:
            ctl = clingo.Control(logger=ClingoLogger.logger)
            ctl.load("./ClingViz/encodings/encoding.lp")
            ctl.add(mstring)
            ctl.ground(context=clingraph.clingo_utils.ClingraphContext())
            fbobj = clingraph.Factbase()
            with ctl.solve(yield_=True) as handle:
                for model in handle:
                    fbobj.add_model(model)
                    fb.append(fbobj)
                    break
    except RuntimeError as e:
        return HttpResponseServerError("An error occured during the Clingraph stage: " + str(e) + " Particular: " + ClingoLogger.errorString())

    if len(fb[0].get_facts()) <= 0:
        return HttpResponseBadRequest("Your program and your clingraph encoding do not return a model (or do not return one that can be used by clingraph)")

    options_models = []
    try:
        clormCtl = ClormControl(unifier=[Option_Context, Select_Option], logger=ClingoLogger.logger)
        clormCtl.add(modelStrings[0])
        clormCtl.load("./ClingViz/encodings/options-encoding.lp")
        clormCtl.ground()
        with clormCtl.solve(yield_=True) as handle:
            for model in handle:
                print("OPTION MODEL: \n")
                print(model);
                facts = model.facts(atoms = True, terms = True)
                options_models.append(facts)
                break

        if(len(options_models) <= 0):
            return HttpResponseBadRequest("Could not solve your options encoding with your program output. No options will be displayed")
    except RuntimeError as e:
        return HttpResponseServerError("An error occured during the Option solving stage: " + str(e) + " Particular: " + ClingoLogger.errorString())


   # for i in range(len(fb)):
        #print("Factbase No." + str((i+1)) + ":\n")
        #print(fb[i].get_facts())


    oL:OptionsList = createOptionsList(options_models[0])
    for i in range(len(fb)):
        graph = clingraph.compute_graphs(fb[i])
        clingraph.render(graph, directory="out", name_format="default_"+str(i), format="svg")
    svg_content = []
    for i in range(len(fb)):
        with open('out/default_'+str(i)+'.svg', 'r') as svg_file:
            svg_content.append(svg_file.read())

    for i in range(len(fb)):
        os.remove("out/default_"+str(i)+'.svg')

    print("Done. Sending response...")
    print(oL.toJson())
    raw = {"data": svg_content, "option_data": oL.toJson()}
   # print(svg_content[0])
    #if(len(svg_content) > 0):
        #print(svg_content[1])
    js = json.dumps(raw)
    response = HttpResponse(js, content_type='application/json', status=200)
    return response






