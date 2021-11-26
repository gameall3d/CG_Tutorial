
import { _decorator, Component, Node, Prefab, Layout, Sprite, instantiate, Color, UITransform } from 'cc';
const { ccclass, property, type } = _decorator;

@ccclass('FakeScreen')
export class FakeScreen extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @type(Prefab)
    public tilePrfb!: Prefab;

    private _width: number = 40;
    private _height: number = 30;
    private tileSize = 10;

    private _tiles: Sprite[] = [];

    start () {
        // [3]

        let contentSize = this.getComponent(UITransform)!.contentSize;
        this._width = contentSize.x / this.tileSize;
        this._height = contentSize.y / this.tileSize;
        
        let layout: Layout|null = this.getComponent(Layout);

        if (layout) {
            const totalTiles = this._width * this._height;

            for (let i = 0; i < totalTiles; i++) {
                let tile = instantiate(this.tilePrfb) as Node;
                tile.parent = this.node;
                this._tiles.push(tile.getComponent(Sprite)!);
            }
        }

        this.draw(10, 10, Color.GREEN);
    }

    public clear(color: Color = Color.BLACK) {
        this._tiles.forEach((tile) => {
            tile.color = color;
        });
    }

    public draw(x: number, y: number, color: Color) {
        this._tiles[x * this._width + y].color = color;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
