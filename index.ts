
type PrivateVElement<T> = VElement<any & T>
type MethodsOf<T> = { [K in keyof T]: T[K] }

type HTMLElementTypeMap = {
    // text
    p: HTMLParagraphElement,
    h1: HTMLHeadingElement,
    h2: HTMLHeadingElement,
    h3: HTMLHeadingElement,
    h4: HTMLHeadingElement,
    h5: HTMLHeadingElement,
    h6: HTMLHeadingElement,
    pre: HTMLPreElement,
    li: HTMLLIElement,
    //layout
    ul: HTMLUListElement,
    ol: HTMLOListElement,
    br: HTMLBRElement,
    // structure
    title: HTMLTitleElement,
    html: HTMLHtmlElement,
    head: HTMLHeadElement,
    style: HTMLStyleElement,
    div: HTMLDivElement,
    body: HTMLBodyElement,
    section: HTMLElement
    nav: HTMLElement,
    footer: HTMLElement,
    header: HTMLElement,
    article: HTMLElement,
    // input
    button: HTMLButtonElement,
    input: HTMLInputElement,
    textarea: HTMLTextAreaElement,
    label: HTMLLabelElement,
    option: HTMLOptionElement,
    select: HTMLSelectElement,
    form: HTMLFormElement,
    datalist: HTMLDataListElement,
    optgrout: HTMLOptGroupElement,
    // formatting
    i: HTMLElement,
    em: HTMLElement,
    b: HTMLElement,
    kbd: HTMLElement,
    s: HTMLElement,
    span: HTMLSpanElement,
    strong: HTMLSpanElement,
    sub: HTMLElement,
    sup: HTMLElement,
    u: HTMLElement,
    // media
    img: HTMLImageElement,
    svg: SVGElement,
    script: HTMLScriptElement,
}

type VElementSpecialMethods = {
    ul: MethodsOf<ReturnType<typeof ListElementImpl>>,
    ol: MethodsOf<ReturnType<typeof ListElementImpl>>,
}
function ListElementImpl(self: VElement<any>) {
    return {
        add: <const ElementType extends keyof HTMLElementTypeMap>(type: ElementType, content: string = ""): VElement<ElementType> => {
            let newChild: VElement<ElementType> = Virt.create(type, content);
            self.children[type]?.push(newChild);
            self.element.appendChild(newChild.element)
            return newChild;
        }
    }
};

type PatternMapper<ReturnType> = {
    [key in keyof HTMLElementTypeMap]?: (element: VElement<key & keyof Partial<HTMLElementTypeMap>>) => ReturnType
} & {
    "_": (element: VElement<any>) => ReturnType
}

function BaseElementImpl(self: any) {
    return {
        map: <T>(callbacks: PatternMapper<T>) => {
            let callback = callbacks[(<VElement<any>>self).type]
            callback
                ? callback(self as any)
                : callbacks._(self)
        }
    }
}

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
    & ReturnType<typeof BaseElementImpl>

namespace Virt {
    function implSpecial<const T extends keyof HTMLElementTypeMap>(self: VElement<T>, createdElementType: T): VElementSpecialMethods[T extends keyof VElementSpecialMethods ? T : never] {
        switch (createdElementType) {
            case "ul": case "ol": return ListElementImpl(self)
            default:
                return {} as VElementSpecialMethods[never]
        }
    }

    function implSpecialRuntime(self: VElement<any>, createdElementType: keyof HTMLElementTypeMap): any {
        switch (createdElementType) {
            case "ul": case "ol": return ListElementImpl(self)
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
        return { ...vElement, ...implSpecial(vElement, type)} as unknown as VElement<T>;
    }

    export function fromUnknown(element: HTMLElement | null): VElement<any> | null {
        if (!element) return null;
        let newElement = {
            type: element.tagName,
            element: element,
            children: {},
            events: {},
        } as VElement<any>
        for (let i = 0; i < element.children.length; i++) {
            element.children.item(i)
        }
        return { ...newElement, ...implSpecialRuntime(newElement, element.tagName as keyof HTMLElementTypeMap) }
    }
}

function getElementsOfType<const T extends keyof HTMLElementTypeMap>(type: T): HTMLCollectionOf<HTMLElementTypeMap[T]> {
    return document.getElementsByTagName(type) as HTMLCollectionOf<HTMLElementTypeMap[T]>
}

type Keys = keyof HTMLElementTypeMap
type Test = <T>([...Keys], _: (arg: VElement<any>) => T) => T
let x: Keys = "article"

let ulElement = Virt.create("ul", "ul!")
ulElement.add("h1", "h1!")

function test0

function test1<Params extends { } >(...params: Parameters<Params>) {
    const _params: Parameters<{ }> = params;
    return 1
}

getElementsOfType("body").item(0)?.appendChild(ulElement.element)

let unknownElement = Virt.fromUnknown(document.getElementById("test-element"))


unknownElement?.map({
    h1: (_) => {  },
    _: (_) => { }
})

console.log(getElementsOfType("body").item(0))

let olElement = Virt.create("ol")
olElement.add("h1")

let x2 = Virt.create("p")
console.log("wow")
