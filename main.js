import {square, doubleSquare, cube} from './models.js';
import {drawPolygon} from './draw.js';
import {Camera} from './camera.js';
import {Vec} from './math.js'

function toPoint(values) {
    return {
        x:values[0],
        y:values[1],
        z:values[2],
    }
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

function toMesh(shape) {
    return shape.map(toPolygon);
}
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const mesh = toMesh(cube);
let position = {x: 0, y: 0, z: 0};
let rotation = {x: 0, y: 0, z: 0};
let mouseDown = false;

const camera = new Camera();
camera.pos.z = 300;
camera.zoom = 12;

context.strokeStyle = '#fff';

function rotate(point, rotation) {
    const sin = new Vec(
        Math.sin(rotation.x),
        Math.sin(rotation.y),
        Math.sin(rotation.z));

    const cos = new Vec(
        Math.cos(rotation.x),
        Math.cos(rotation.y),
        Math.cos(rotation.z));

    let temp1, temp2;

    temp1 = cos.x * point.y + sin.x * point.z;
    temp2 = -sin.x * point.y + cos.x * point.z;
    point.y = temp1;
    point.z = temp2;

    temp1 = cos.y * point.x + sin.y * point.z;
    temp2 = -sin.y * point.x + cos.y * point.z;
    point.x = temp1;
    point.z = temp2;

    temp1 = cos.z * point.x + sin.z * point.y;
    temp2 = -sin.z * point.x + cos.z * point.y;
    point.x = temp1;
    point.y = temp2;
}

function offset(point, position) {
    point.x += position.x;
    point.y += position.y;
    point.z += position.z;
}

function drawMesh(mesh) {
    mesh.forEach(polygon =>{
        const projectedPolygon = polygon.map(point => ({...point}));
        
        projectedPolygon.forEach(point => {
            rotate(point, rotation)
            offset(point, position);
            camera.transform(point);
        });

        drawPolygon(projectedPolygon, context);
    });
}

function animate(time) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    //position.x = Math.sin(time / 300) * 100;
    //position.y = Math.cos(time / 300) * 100;
    //camera.pos.z += 0.1;
    drawMesh(mesh);
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', function(){
    this.mouseDown = true;
});
canvas.addEventListener('mouseup', function(){
    this.mouseDown = false;
});
canvas.addEventListener('mouseleave', function(){
    this.mouseDown = false;
});
canvas.addEventListener('mousemove', function(e){
    if (this.mouseDown) {
        if (e.shiftKey) {
            rotation.y += e.movementX / -100;
            rotation.x += e.movementY / -100;
        } else {
            position.x += e.movementX;
            position.y += e.movementY;
        }
    }
   
});
canvas.addEventListener('mousewheel', function(e){
    position.z += e.deltaY / 10;
    if (position.z < -120) {
        position.z = -120;
    }
    console.log(position.z);
});

animate(0);
