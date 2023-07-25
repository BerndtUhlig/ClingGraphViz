import os

from django.http import HttpResponseBadRequest, HttpResponse
import ast
import scripts.reify_ast
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import helperFuncs


# Create your views here.
import json

@require_http_methods(["POST"])
@csrf_exempt
def clingviz(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError as e:
            return HttpResponseBadRequest("An error occured: {msg}".format(msg=e.msg))

        if not all(key in body.keys() for key in ["ast","program","encoding"]):
            return HttpResponseBadRequest("The file did not contain \"ast\", \"program\", or \"encoding\"")


        print("JSON received, preparing files.")
        f1 = open("program.lp", "w")
        f2 = open("encoding.lp", "w")
        program = json.dumps(body["program"])
        encoding = json.dumps(body["encoding"])
        f1.write(ast.literal_eval(program))
        f2.write(ast.literal_eval(encoding))
        f1.flush()
        f2.flush()
        print("files prepared, checking AST")
        if body["ast"]:

            print("Done. Sending output to file...")
            f1.close()
            #TODO: Change this to a "with" statement
            f1 = open("program.lp", "w")
            f1.write(output)
            f1.flush()
            print("Done. Starting clingraph...")
            response = helperFuncs.encode_and_make_graph("program.lp", "ClingViz/viz.lp")
            return response
        else:
            print("Regular graph requested: ")
            response = helperFuncs.encode_and_make_graph("program.lp", "encoding.lp")
            return response
    else:
        pass
