import { Vec2, Vec3 } from "cc";

export interface IMeshPrimitive {
    primitiveType?: number,      // 图元类型
    positions: Vec3[],           // 顶点坐标
    normals?: Vec3[],            // 法线
    uvs?: Vec2[],                // uv坐标
    indices?: number[],          // 顶点索引
    minPos?: Vec3,               // 最小位置
    maxPos?: Vec3,               // 最大位置
    boundingRadius?: number,
    doubleSided?: boolean,       // 是否开启模型的双面检测，用于射线检测
}

export interface ICreateMeshOption {
    dashed?: boolean,             // 使用虚线
}

export interface IMaterialOption {
    effectName?: string,          // 使用的effect名字
    cullMode?: number,            // 剔除类型
    primitive?: number,           // 图元类型
    priority?: number,            // 渲染优先级
    alpha?: number,               // 透明度值
    unlit?: boolean,              // 使用无光照的technique
    texture?: boolean,            // 使用带贴图的technique
    noDepthTestForLines?: boolean // 使用不进行深度测试的technique
    dashed?: boolean,             // 使用虚线
}

export interface IAddMeshToNodeOption extends IMaterialOption {
    forwardPipeline?: boolean   // 是否使用前向渲染管线
}