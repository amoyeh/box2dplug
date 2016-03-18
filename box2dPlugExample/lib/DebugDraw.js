box2d.DebugDraw = function (canvas, settings) {
    box2d.b2Draw.call(this);
    this.m_canvas = canvas;
    this.m_ctx = (this.m_canvas.getContext("2d"));
    this.m_settings = settings;
    this.m30 = function (value) {
        return Math.round(value * 3000) / 100;
    }
}
goog.inherits(box2d.DebugDraw, box2d.b2Draw);
box2d.DebugDraw.prototype.PushTransform = function (xf) {
    var ctx = this.m_ctx;
    ctx.save();
    ctx.scale(30, 30);
    ctx.translate(xf.p.x, xf.p.y);
    ctx.rotate(xf.q.GetAngle());
}
box2d.DebugDraw.prototype.PopTransform = function (xf) {
    var ctx = this.m_ctx;
    ctx.restore();
}
//draw outsize purple border of the items
box2d.DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
    if (!vertexCount) return;
    var ctx = this.m_ctx;
    ctx.save();
    ctx.scale(30, 30);
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertexCount; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
    ctx.restore();
};
//draw polygons with physic existence
box2d.DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
    if (!vertexCount) return;
    var ctx = this.m_ctx;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertexCount; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = color.MakeStyleString(0.5);
    ctx.fill();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
};
box2d.DebugDraw.prototype.DrawCircle = function (center, radius, color) {
    if (!radius) return;
    var ctx = this.m_ctx;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true);
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
};
//draw circle with physic existence
box2d.DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
    if (!radius) return;
    var ctx = this.m_ctx;
    var cx = center.x;
    var cy = center.y;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, box2d.b2_pi * 2, true);
    ctx.moveTo(cx, cy);
    ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
    ctx.fillStyle = color.MakeStyleString(0.5);
    ctx.fill();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
};
box2d.DebugDraw.prototype.DrawParticles = function (centers, radius, colors, count) {
    var ctx = this.m_ctx;
    ctx.save();
    ctx.scale(30, 30);
    var diameter = 2 * radius;
    if (colors !== null) {
        for (var i = 0; i < count; ++i) {
            var center = centers[i];
            var color = colors[i];
            ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (color.a / 255.0) + ')';
            ctx.fillRect(center.x - radius, center.y - radius, diameter, diameter);
        }
    }
    else {
        ctx.fillStyle = 'rgba(30,30,30,0.5)';
        ctx.beginPath();
        for (var i = 0; i < count; ++i) {
            var center = centers[i];
            ctx.rect(center.x - radius, center.y - radius, diameter, diameter);
        }
        ctx.fill();
    }
    ctx.restore();
}
box2d.DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
    var ctx = this.m_ctx;
    ctx.beginPath();
    ctx.strokeStyle = color.MakeStyleString(1);
    //drawing edges
    if (ctx.strokeStyle == "#80e680" || ctx.strokeStyle == "#e6b3b3" || ctx.strokeStyle == "#999999") {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = 0.03;
        ctx.stroke();
    }
    //drawing guides such as joints
    if (ctx.strokeStyle == "#80cccc") {
        ctx.moveTo(this.m30(p1.x), this.m30(p1.y));
        ctx.lineTo(this.m30(p2.x), this.m30(p2.y));
        ctx.lineWidth = 1;
        ctx.stroke();
    }

};
//drawing the red and green transform points
box2d.DebugDraw.prototype.DrawTransform = function (xf) {
    var ctx = this.m_ctx;
    this.PushTransform(xf);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0.5, 0);
    ctx.strokeStyle = box2d.b2Color.RED.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 0.5);
    ctx.strokeStyle = box2d.b2Color.GREEN.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
    this.PopTransform(xf);
};
box2d.DebugDraw.prototype.DrawPoint = function (p, size, color) {
    var ctx = this.m_ctx;
    ctx.fillStyle = color.MakeStyleString();
    size *= this.m_settings.viewZoom;
    size /= this.m_settings.canvasScale;
    var hsize = size / 2;
    ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
    //console.log("--DrawPoint");
}
box2d.DebugDraw.prototype.DrawAABB = function (aabb, color) {
    var ctx = this.m_ctx;
    ctx.strokeStyle = color.MakeStyleString();
    var x = aabb.lowerBound.x;
    var y = aabb.lowerBound.y;
    var w = aabb.upperBound.x - aabb.lowerBound.x;
    var h = aabb.upperBound.y - aabb.lowerBound.y;
    ctx.lineWidth = 0.03;
    ctx.strokeRect(x, y, w, h);
    //console.log("--DrawAABB");
}

box2d.DebugDraw.prototype.drawOverLine = function (x1, y1, x2, y2, lineWidth, color) {
    if (color == null) color = "#EEEEEE";
    if (lineWidth == null) lineWidth = 1;
    this.overCtx.strokeStyle = color;
    this.overCtx.lineWidth = lineWidth;
    this.overCtx.beginPath();
    this.overCtx.moveTo(x1, y1);
    this.overCtx.lineTo(x2, y2);
    this.overCtx.stroke();
    this.overCtx.closePath();
}
box2d.DebugDraw.prototype.drawBuoyancy = function (bc, lineWidth, color) {
    if (color == null) color = "#9999EE";
    if (lineWidth == null) lineWidth = 2;
    this.overCtx.strokeStyle = color;
    this.overCtx.lineWidth = lineWidth;
    var len = 100;
    var x1 = bc.normal.x * bc.offset + bc.normal.y * len;
    var y1 = bc.normal.y * bc.offset - bc.normal.x * len;
    var x2 = bc.normal.x * bc.offset - bc.normal.y * len;
    var y2 = bc.normal.y * bc.offset + bc.normal.x * len;
    x1 = Math.round(x1 * 30);
    y1 = Math.round(y1 * 30);
    x2 = Math.round(x2 * 30);
    y2 = Math.round(y2 * 30);
    this.overCtx.beginPath();
    this.overCtx.moveTo(x1, y1);
    this.overCtx.lineTo(x2, y2);
    this.overCtx.stroke();
    this.overCtx.closePath();
}
box2d.DebugDraw.prototype.drawOverCircle = function (x, y, radius, lineWidth, color) {
    if (color == null) color = "#EEEEEE";
    if (lineWidth == null) lineWidth = 1;
    this.overCtx.strokeStyle = color;
    this.overCtx.lineWidth = lineWidth;
    this.overCtx.beginPath();
    this.overCtx.moveTo(x, y);
    this.overCtx.arc(x, y, radius, 0, 2 * Math.PI);
    this.overCtx.stroke();
    this.overCtx.closePath();
}
box2d.DebugDraw.prototype.drawOverRect = function (x, y, w, h, lineWidth, color) {
    if (color == null) color = "#EEEEEE";
    if (lineWidth == null) lineWidth = 1;
    this.overCtx.strokeStyle = color;
    this.overCtx.lineWidth = lineWidth;
    this.overCtx.beginPath();
    this.overCtx.rect(x, y, w, h);
    this.overCtx.stroke();
    this.overCtx.closePath();
}
box2d.DebugDraw.prototype.clearOverCanvas = function () {
    var w = this.overCtx.canvas.width;
    var h = this.overCtx.canvas.height;
    this.overCtx.clearRect(0, 0, w, h);
}