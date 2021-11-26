import { Color, Node, Vec3, utils, primitives, Vec2, gfx, MeshRenderer, director, Material } from "cc";
import ControllerShape from "./ControllerShape";
import { IMeshPrimitive, ICreateMeshOption, IAddMeshToNodeOption } from "./Defines";

const flat = (arr: any, fn: any) => {
    return arr.map(fn).reduce((acc: any, val: any) => acc.concat(val), []);
};


class ControllerUtils{
    public static frustum(
        isOrtho: boolean,
        orthoHeight: number,
        fov: number,
        aspect: number,
        near: number,
        far: number,
        color: Color,
        opts: any = {},
    ) {
        const frustumData = ControllerShape.calcFrustum(isOrtho, orthoHeight, fov, aspect, near, far, true);
        const frustumNode = this.createShapeByData(frustumData, color, opts);
        frustumNode.name = 'Frustum';

        return frustumNode;
    }

    public static createMesh(primitive: IMeshPrimitive, opts: ICreateMeshOption = {}) {
        // prepare data
        let primitiveData: primitives.IGeometry = {
            primitiveMode: primitive.primitiveType,
            positions: flat(primitive.positions, (v: Vec3) => [v.x, v.y, v.z]),
            indices: primitive.indices,
            minPos: primitive.minPos,
            maxPos: primitive.maxPos,
        };

        if (primitive.normals) {
            primitiveData.normals = flat(primitive.normals, (v: Vec3) => [v.x, v.y, v.z]);
        }
        if (primitive.uvs) {
            primitiveData.uvs = flat(primitive.uvs, (v: Vec2) => [v.x, v.y]);
        }

        let customAttributes = primitiveData.customAttributes;
        if (opts.dashed) {
            if (!customAttributes) {
                customAttributes = [];
            }

            let lineDistances: number[] = [];
            for (let i = 0; i < primitive.positions.length; i += 2) {
                let start = primitive.positions[i];
                let end = primitive.positions[i + 1];
                lineDistances[i] = (i === 0) ? 0 : lineDistances[ i - 1];
                lineDistances[i + 1] = lineDistances[i] + Vec3.distance(start, end);
            }

            customAttributes.push({
                attr: new gfx.Attribute('a_lineDistance', gfx.Format.R32F),
                values: lineDistances,
            });
        }

        primitiveData.customAttributes = customAttributes;

        // create
        const mesh = utils.createMesh(primitiveData);

        // set double sided flag for raycast
        const subMesh = mesh.renderingSubMeshes[0];
        const info = subMesh.geometricInfo;
        if (info) {
            info.doubleSided = primitive.doubleSided;
        }
        // cache vb buffer for vb update
        const vbInfo = mesh.struct.vertexBundles[0].view;
        const ibInfo = mesh.struct.primitives[0].indexView;
        // @ts-ignore
        subMesh.vBuffer = mesh.data.buffer.slice(vbInfo.offset, vbInfo.offset + vbInfo.length);
        // @ts-ignore
        subMesh.iBuffer = mesh.data.buffer.slice(ibInfo.offset, ibInfo.offset + ibInfo.length);
        return mesh;
    }

    public static addMeshToNode(node: any, mesh: any, opts: IAddMeshToNodeOption = {}) {
        const model = node.addComponent(MeshRenderer);
        const defines: any = {};
        // if (!opts.forwardPipeline) {
        //     model._sceneGetter = director.root.ui.getRenderSceneGetter();
        // } else {
        //     defines.USE_FORWARD_PIPELINE = true;
        // }
        defines.USE_FORWARD_PIPELINE = true;

        if (opts.dashed) {
            defines.USE_DASHED_LINE = true;
        }

        model.mesh = mesh;
        // const cb = model.onEnable.bind(model);
        // model.onEnable = () => {
        //     cb();
        // };
         // don't show on preview cameras
        const pm = mesh.renderingSubMeshes[0].primitiveMode;
        let technique = 0;
        let effectName = 'unlit';
        // if (opts.effectName) {
        //     effectName = opts.effectName;
        // } else {
        //     if (opts.unlit) {
        //         technique = 1;
        //     } else if (opts.texture) {
        //         technique = 3;
        //     } else {
        //         if (pm < GFXPrimitiveMode.TRIANGLE_LIST) {
        //             technique = opts.noDepthTestForLines ? 1 : 2; // unlit
        //         }
        //     }
        // }

        const mtl = new Material();
        const states: any = {};
        if (opts.cullMode) {
            states.rasterizerState = { cullMode: opts.cullMode };
        }
        if (pm !== gfx.PrimitiveMode.TRIANGLE_LIST) {
            states.primitive = pm;
        }
        if (opts.priority) {
            states.priority = opts.priority;
        }

        mtl.initialize({ effectName, technique, states, defines });
        // if (opts.alpha !== undefined) {
        //     node.modelColor.a = opts.alpha;
        // }
        // mtl.setProperty('mainColor', node.modelColor);
        model.material = mtl;
        node.modelComp = model;
    }

    public static setNodeMaterialProperty(node: any, propName: string, value: any) {
        if (node && node.modelComp) {
            node.modelComp.material.setProperty(propName, value);
        }
    }

    public static setMeshColor(node: any, c: Color) {
        let alpha = c.a;
        if (node.modelColor) {
            alpha = node.modelColor.a;
        }
        node.modelColor = c.clone();
        node.modelColor.a = alpha;
        this.setNodeMaterialProperty(node, 'mainColor', node.modelColor);
    }

    public static createShapeByData(shapeData: IMeshPrimitive, color: Color, opts: any = {}) {
        const shapeNode: Node = new Node(opts.name);
        this.addMeshToNode(shapeNode, this.createMesh(shapeData, opts), opts);
        this.setMeshColor(shapeNode, color);

        return shapeNode;
    }
}

export default ControllerUtils;
