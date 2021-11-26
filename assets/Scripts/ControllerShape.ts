import { gfx, Vec3, math } from 'cc';

class ControllerShape {
    public calcFrustum(isOrtho: boolean, orthoHeight: number, fov: number, aspect: number, near: number, far: number, isFOVY: boolean) {
        const points = [];
        const indices = [];
        let nearHalfHeight;
        let nearHalfWidth;
        let farHalfHeight;
        let farHalfWidth;

        if (isOrtho) {
            nearHalfHeight = farHalfHeight = orthoHeight;
            nearHalfWidth = farHalfWidth = nearHalfHeight * aspect;
        } else {
            if (isFOVY) {
                nearHalfHeight = Math.tan(math.toRadian(fov / 2)) * near;
                nearHalfWidth = nearHalfHeight * aspect;

                farHalfHeight = Math.tan(math.toRadian(fov / 2)) * far;
                farHalfWidth = farHalfHeight * aspect;
            } else {
                nearHalfWidth = Math.tan(math.toRadian(fov / 2)) * near;
                nearHalfHeight = nearHalfWidth / aspect;

                farHalfWidth = Math.tan(math.toRadian(fov / 2)) * far;
                farHalfHeight = farHalfWidth / aspect;
            }
        }

        points[0] = new Vec3(-nearHalfWidth, -nearHalfHeight, -near);
        points[1] = new Vec3(-nearHalfWidth, nearHalfHeight, -near);
        points[2] = new Vec3(nearHalfWidth, nearHalfHeight, -near);
        points[3] = new Vec3(nearHalfWidth, -nearHalfHeight, -near);

        points[4] = new Vec3(-farHalfWidth, -farHalfHeight, -far);
        points[5] = new Vec3(-farHalfWidth, farHalfHeight, -far);
        points[6] = new Vec3(farHalfWidth, farHalfHeight, -far);
        points[7] = new Vec3(farHalfWidth, -farHalfHeight, -far);

        for (let i = 1; i < 4; i++) {
            indices.push(i - 1, i);
        }
        indices.push(0, 3);
        for (let i = 5; i < 8; i++) {
            indices.push(i - 1, i);
        }
        indices.push(4, 7);

        for (let i = 0; i < 4; i++) {
            indices.push(i, i + 4);
        }

        return {
            positions: points,
            indices,
            normals: Array(points.length).fill(new Vec3(0, 1, 0)),
            primitiveType: gfx.PrimitiveMode.LINE_LIST,
        };
    }
}

export default new ControllerShape();