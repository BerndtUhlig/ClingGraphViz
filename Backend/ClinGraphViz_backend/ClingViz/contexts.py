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

class Option:
    def __init__(self, type:str, name:str, compType: str):
        self.type = type
        self.name = name
        self.compType = compType

    def __eq__(self, other):
        if isinstance(other, Option):
            return other.name == self.name and other.type == self.type and other.compType == self.compType
        else:
            return False

class NodeOptions:
    def __init__(self, id: int, options: list[Option]):
        self.id = id
        self.options = options

    def addOption(self, option:Option) -> None:
        for selfOption in self.options:
            if selfOption == option:
                return

        self.options.append(option)

    def toJson(self) -> str:
        try:
            objJson = json.dumps(self)
            return objJson
        except json.JSONDecodeError as err:
            raise Exception("The nodeOptions object could not be encoded into a json! Error: " + err.msg)

class OptionsList:
    def __init__(self, options: list[NodeOptions]):
        self.options = options

    def add(self,id:int, option:Option):
        for opt in self.options:
            if opt.id == id:
                opt.addOption(option)
                return

        self.options.append(NodeOptions(id,[option]))

    def toJson(self) -> list[str]:
        jsonList = []
        for item in self.options:
            jsonItem = item.toJson()
            jsonList.append(jsonItem)

        return jsonList

def createOptionsList(atoms: FactBase) -> OptionsList:
    oL = OptionsList([])
    solution = atoms.query(VizContext).select(VizContext.id,VizContext.name, VizContext.type).all()
    for s in solution:
        oL.add(s[0],Option(s[1],s[2]))

    return oL

