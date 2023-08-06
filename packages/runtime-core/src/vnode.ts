/*
 * @Author: 阿喜
 * @Date: 2023-08-03 22:55:38
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-06 17:08:15
 * @FilePath: \vue-mini\packages\runtime-core\src\vnode.ts
 * @Description: 
 * 
 */
import { isArray, isFunction, isObject, isString } from "../../shared/src/index";
import { ShapeFlags } from "../../shared/src/shapeFlags";
import { normalizeClass } from "./normalize";

export const Text = Symbol('Text');
export const Fragment = Symbol('Fragment');
export const Comment = Symbol('Comment');


export interface VNode {
    __is_isVNode: true;
    type: any;
    props: any;
    children: any;
    shapeFlag: number;
}

export function isVNode(value: any): value is VNode {
    return value ? value.__is_isVNode === true : false;
}

export function createVNode(type, props, children): VNode {
    if (props) {
        let { class: klass, style } = props;
        if (klass && !isString(klass)) {
            props.class = normalizeClass(klass);
        }
    }
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT :
        isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
    return createBaseVNode(type, props, children, shapeFlag);
}


export function createBaseVNode(type, props, children, shapeFlag: number): VNode {
    const vnode = {
        __is_isVNode: true,
        type,
        props,
        children,
        shapeFlag
    } as VNode;
    normalizeChildren(vnode, children);
    return vnode;
}

export function normalizeChildren(vnode: VNode, children: unknown) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
        children = [];
        //数组
    } else if (isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN;
        //对象
    } else if (typeof children === 'object') {
        //函数
    } else if (isFunction(children)) {
        //字符串
    } else {
        children = String(children)
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.children = children;
    //按位或运算  代表当前node的类型 后续在render函数中会用到
    vnode.shapeFlag |= type;
}






