
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
}

type DomEventTypeMap = {
    onClick: PointerEvent,
    mouseEnter: MouseEvent
}
type DomEvent =
    | { type: "onClick", event: PointerEvent }
    | { type: "mouseEnter", event: MouseEvent }

type VElementChildren = {
    [key in keyof HTMLElementTypeMap]?: VElement.VElement<key>
}

type VElementEventCallbacks = {
    [key in keyof DomEventTypeMap]?: (event: DomEventTypeMap[key]) => void
}

type VElementSpecialMethods = {
    ul: { add: typeof VElement.create }
}

namespace VElement {
    export declare interface VElement<T extends string & keyof HTMLElementTypeMap> {
        type: keyof HTMLElementTypeMap,
        element: HTMLElementTypeMap[T],
        children: VElementChildren,
        events: VElementEventCallbacks,
        methods: VElementSpecialMethods[T extends keyof VElementSpecialMethods ? T : never]
    }

    function implSpecial<const T extends keyof HTMLElementTypeMap>(type: T): VElementSpecialMethods[T extends keyof VElementSpecialMethods ? T : never] {
        switch (type) {
            case "ul":
                return { add: create } as VElementSpecialMethods["ul"]
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
            methods: implSpecial(type)
        }
        vElement.element.textContent = content;
        return vElement;
    }
}


interface ElementSpawner {

}

let x = VElement.create("ul")
let b = x.methods.add("h1")
