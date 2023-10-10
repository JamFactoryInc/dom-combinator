
type PrivateVElement<T> = VElement<any & T>
type MethodsOf<T> = { [K in keyof T]: T[K] }

type HTMLElementTypeMap = {
    p: HTMLParagraphElement,
    h1: HTMLHeadingElement,
    h2: HTMLHeadingElement,
    h3: HTMLHeadingElement,
    h4: HTMLHeadingElement,
    h5: HTMLHeadingElement,
    h6: HTMLHeadingElement,
    span: HTMLSpanElement,
    ul: HTMLUListElement,
    ol: HTMLOListElement,
}

type VElementSpecialMethods = {
    ul: MethodsOf<ReturnType<typeof ListElementImpl>>,
}
function ListElementImpl(self: VElement<any>) {
    return {
        add: <const ElementType extends keyof HTMLElementTypeMap>(type: ElementType, content: string = ""): VElement<ElementType> => {
            let newChild: VElement<ElementType> = Virt.create(type, content);
            self.children[type]?.push(newChild);
            return newChild;
        }
    }
};

type DomEventTypeMap = {
    onClick: PointerEvent,
    mouseEnter: MouseEvent
}
type DomEvent =
    | { type: "onClick", event: PointerEvent }
    | { type: "mouseEnter", event: MouseEvent }

type VElementChildren = {
    [key in keyof HTMLElementTypeMap]?: VElement<key>[]
}

type VElementEventCallbacks = {
    [key in keyof DomEventTypeMap]?: (event: DomEventTypeMap[key]) => void
}

type VElementAttrs<T extends string & keyof HTMLElementTypeMap> = {
    type: keyof HTMLElementTypeMap,
    element: HTMLElementTypeMap[T],
    children: VElementChildren,
    events: VElementEventCallbacks,
}

type VElementMethodBaseReq<T extends string & keyof HTMLElementTypeMap> = {
    [K in keyof VElementSpecialMethods[T & keyof VElementSpecialMethods]]: 
        VElementSpecialMethods[T & keyof VElementSpecialMethods][K]
    
}
type VElementMethodBaseOpt<T extends string & keyof HTMLElementTypeMap> = {
    [K in keyof VElementSpecialMethods[T & keyof VElementSpecialMethods]]?: 
        VElementSpecialMethods[T & keyof VElementSpecialMethods][K]
}

type VElementBase<T extends string & keyof HTMLElementTypeMap> = {
    [K in keyof VElementAttrs<T>]: VElementAttrs<T>[K]
}

type VElement<T extends string & keyof HTMLElementTypeMap, TempMethods = false> =
    (TempMethods extends true ? VElementMethodBaseOpt<T> : VElementMethodBaseReq<T>)
        & VElementBase<T>

namespace Virt {
    function implSpecial<const T extends keyof HTMLElementTypeMap>(self: VElement<T>, createdElementType: T): VElementSpecialMethods[T extends keyof VElementSpecialMethods ? T : never] {
        switch (createdElementType) {
            case "ul": return ListElementImpl(self)
            default:
                return {} as VElementSpecialMethods[never]
        }
    }

    export function create<const T extends keyof HTMLElementTypeMap>(type: T, content: string = ""): VElement<T> {
        let vElement: VElement<T> = {
            type: type,
            element: document.createElement(type) as HTMLElementTypeMap[T extends keyof HTMLElementTypeMap ? T : never],
            children: {},
            events: {},
        } as VElement<T>
        vElement.element.textContent = content;
        return {...vElement, ...implSpecial(vElement, type)} as unknown as VElement<T>;
    }
}

interface ElementSpawner {

}

let x1 = Virt.create("ul")
let b1 = x1.add("h1")

let x2 = Virt.create("p")
console.log("wow")
