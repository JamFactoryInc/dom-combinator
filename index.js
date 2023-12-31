"use strict";
var _a;
function ListElementImpl(self) {
    return {
        add: (type, content = "") => {
            var _a;
            let newChild = Virt.create(type, content);
            (_a = self.children[type]) === null || _a === void 0 ? void 0 : _a.push(newChild);
            self.element.appendChild(newChild.element);
            return newChild;
        }
    };
}
;
function BaseElementImpl(self) {
    let mapFn = () => (callbacks) => {
        let callback = callbacks[self.type];
        callback
            ? callback(self)
            : callbacks._(self);
    };
    return {
        as: (mapFn),
        map: mapFn()
    };
}
var Virt;
(function (Virt) {
    function implSpecial(self, createdElementType) {
        switch (createdElementType) {
            case "ul":
            case "ol": return ListElementImpl(self);
            default:
                return {};
        }
    }
    function implSpecialRuntime(self, createdElementType) {
        switch (createdElementType) {
            case "ul":
            case "ol": return ListElementImpl(self);
            default:
                return {};
        }
    }
    function create(type, content = "") {
        let vElement = {
            type: type,
            element: document.createElement(type),
            children: {},
            events: {},
        };
        vElement.element.textContent = content;
        return Object.assign(Object.assign({}, vElement), implSpecial(vElement, type));
    }
    Virt.create = create;
    function fromUnknown(element) {
        let newElement = {
            type: element.tagName,
            element: element,
            children: {},
            events: {},
        };
        for (let i = 0; i < element.children.length; i++) {
            element.children.item(i);
        }
        return Object.assign(Object.assign({}, newElement), implSpecialRuntime(newElement, element.tagName));
    }
})(Virt || (Virt = {}));
function getElementsOfType(type) {
    return document.getElementsByTagName(type);
}
let ulElement = Virt.create("ul", "ul!");
ulElement.add("h1", "h1!");
(_a = getElementsOfType("body").item(0)) === null || _a === void 0 ? void 0 : _a.appendChild(ulElement.element);
console.log(getElementsOfType("body").item(0));
let olElement = Virt.create("ol");
olElement.add("h1");
let x2 = Virt.create("p");
console.log("wow");
