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
    def __init__(self, type:str, name:str):
        self.type = type
        self.name = name


    def __eq__(self, other):
        if isinstance(other, Option):
            return other.name == self.name and other.type == self.type
        else:
            return False

    def toDict(self):
        return {"name":self.name, "type":self.type}
class NodeOptions:
    def __init__(self, id: str,  compType: str, options: list[Option]):
        self.id = id
        self.options = options
        self.compType = compType

    def addOption(self, option:Option) -> None:
        for selfOption in self.options:
            if selfOption == option:
                return

        self.options.append(option)

    def toDict(self):
        options_list = [option.toDict() for option in self.options]
        return {"id": self.id, "compType": self.compType, "options": options_list}


class OptionsList:
    def __init__(self, options: list[NodeOptions]):
        self.options = options

    def add(self,id:int, option:Option):
        for opt in self.options:
            if opt.id == id:
                opt.addOption(option)
                return

        self.options.append(NodeOptions(id,[option]))

    def toJson(self):
        jsonList = []
        for item in self.options:
            jsonItem = item.toDict()
            jsonList.append(jsonItem)

        return jsonList

def createOptionsList(atoms: FactBase) -> OptionsList:
    oL = OptionsList([])
    solution = atoms.query(VizContext).select(VizContext.id,VizContext.name, VizContext.type).all()
    for s in solution:
        oL.add(s[0],Option(s[1],s[2]))

    return oL

