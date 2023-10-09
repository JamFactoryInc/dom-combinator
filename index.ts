
const P = "p"
    
type HTMLElementTypeMap = {
    p: HTMLParagraphElement,
    h1: HTMLHeadingElement,
}

class VirtElement<const T extends keyof HTMLElementTypeMap> {
    type!: keyof HTMLElementTypeMap
    element!: HTMLElementTypeMap[T extends keyof HTMLElementTypeMap ? T : never]
    children!: ChildrenRecord
    events!: EventRecord<DomEventType>
    
    constructor(type: T) {
        this.element = document.createElement(type) as HTMLElementTypeMap[T extends keyof HTMLElementTypeMap ? T : never]
    }

    // static of<T extends string & HTMLElementType>(): VirtElement<T> {
    //     return new VirtElement<>(T)
    // }
}

type VirtElementRecord<T extends keyof HTMLElementTypeMap> = Record<T, VirtElement<T>>
type ChildrenRecord = Record<keyof HTMLElementTypeMap, VirtElementRecord<keyof HTMLElementTypeMap>>
type EventRecord<T extends DomEventType> = Record<T, (event: DomEventTypeMap[T]) => void>
type DomEventType = "onClick" | "mouseEnter"

type DomEventTypeMap = {
    onClick: PointerEvent,
    mouseEnter: MouseEvent
}
type DomEvent =
    | {type: "onClick", event: PointerEvent}
    | {type: "mouseEnter", event: MouseEvent}


interface ElementSpawner {

}

let x = new VirtElement("h1")
x.children.h1
