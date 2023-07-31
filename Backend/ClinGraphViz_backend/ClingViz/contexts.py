import json

from clorm import Predicate, ConstantField, IntegerField, refine_field, StringField, FactBase


class VizContext(Predicate):
    node = refine_field(ConstantField, ["node","edge"])
    id = IntegerField
    type = refine_field(ConstantField, ["checkbox","text"]) # TODO: Add the other HTML input types.
    name = StringField

class user_input(Predicate):
    node = refine_field(ConstantField, ["node","edge"])
    id = IntegerField
    type = refine_field(ConstantField, ["checkbox", "text"])  # TODO: Add the other HTML input types.
    name = StringField
    value = StringField


class NodeOptions:
    def __init__(self, id: int, options: set[str]):
        self.id = id
        self.options = options

    def addOption(self, option:str) -> None:
        self.options.add(option)

    def toJson(self) -> str:
        try:
            objJson = json.dumps(self)
            return objJson
        except json.JSONDecodeError as err:
            raise Exception("The nodeOptions object could not be encoded into a json! Error: " + err.msg)

class OptionsList:
    def __init__(self, options: list[NodeOptions]):
        self.options = options

    def add(self,id:int, option:str):
        for opt in self.options:
            if opt.id == id:
                opt.addOption(option)
                return
        self.options.append(NodeOptions(id,set(option)))

    def toJson(self) -> list[str]:
        jsonList = []
        for item in self.options:
            jsonItem = item.toJson()
            jsonList.append(jsonItem)

        return jsonList

def createOptionsList(atoms: FactBase) -> OptionsList:
    oL = OptionsList([])
    solution = atoms.query(VizContext).select(VizContext.id,VizContext.name).all()
    for s in solution:
        oL.add(s[0],s[1])

    return oL

