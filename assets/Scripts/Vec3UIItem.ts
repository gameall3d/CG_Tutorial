// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3, EditBox, find, EventHandler, TERRAIN_HEIGHT_BASE } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Vec3UIItem')
export class Vec3UIItem extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private _data: Vec3 = new Vec3();
    private _xInputText!: EditBox;
    private _yInputText!: EditBox;
    private _zInputText!: EditBox;

    start () {
        // Your initialization goes here.
        this._xInputText = find('X/Value', this.node)?.getComponent(EditBox)!;
        this._yInputText = find('Y/Value', this.node)?.getComponent(EditBox)!;
        this._zInputText = find('Z/Value', this.node)?.getComponent(EditBox)!;

        this.addInputTextListener(this._xInputText, 'x');
        this.addInputTextListener(this._yInputText, 'y');
        this.addInputTextListener(this._zInputText, 'z');

        this.setData(0, 0, 0);
    }

    addInputTextListener(editBox: EditBox, customData: string) {
        const editBoxEventHandler = new EventHandler();
        // This node is the node to which your event handler code component belongs.
        editBoxEventHandler.target = this.node;
        editBoxEventHandler.component = 'Vec3UIItem';
        editBoxEventHandler.handler = 'onInputTextChanged';
        editBoxEventHandler.customEventData = customData;

        editBox.textChanged.push(editBoxEventHandler);
    }

    onInputTextChanged(text: string, editBox:EditBox, customEventData: 'x'|'y'|'z') {
        console.log(customEventData);
        this._data[customEventData] = Number.parseFloat(text);
    }

    public setData(other: Vec3): Vec3;
    public setData(x?: number, y?: number, z?: number): Vec3;
    public setData(x?: number | Vec3, y?: number, z?: number): Vec3 {
        if (x && typeof x === 'object') {
            this._data.x = x.x;
            this._data.y = x.y;
            this._data.z = x.z;
        } else {
            this._data.x = x as number || 0;
            this._data.y = y || 0;
            this._data.z = z || 0;
        }

        this._xInputText.string = ''+this._data.x;
        this._yInputText.string = ''+this._data.y;
        this._zInputText.string = ''+this._data.z;
        return this._data;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
