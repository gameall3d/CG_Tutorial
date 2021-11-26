// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, CameraComponent, Color, } from 'cc';
import ControllerUtils from './ControllerUtils';
const { ccclass, property } = _decorator;

@ccclass('CameraGizmo')
export class CameraGizmo extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private _frustumNode: Node|null = null;

    start () {
        // Your initialization goes here.
        let cameraComp = this.node.getComponent(CameraComponent);
        if (cameraComp) {
            const width = cameraComp.camera ? cameraComp.camera.width : 800;
            const height = cameraComp.camera ? cameraComp.camera.height : 600;
            this._frustumNode = ControllerUtils.frustum(false, cameraComp.orthoHeight, cameraComp.fov,
                width/height, cameraComp.near, cameraComp.far, Color.WHITE);
            this._frustumNode.parent = this.node;
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    
}
