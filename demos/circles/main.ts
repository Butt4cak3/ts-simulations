import { Scene } from "hovl/scene";
import { Circle } from "hovl/shapes";

class CirclesScene extends Scene {
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.shapes = [
      new Circle(1, {
        translate: { x: 2, y: 2 }
      }).setStyle({ fillColor: "#00ff00" }),
      new Circle(1, {
        translate: { x: 8, y: 8 }
      }).setStyle({ fillColor: "#0000ff" })
    ];
  }

  protected update(time: number): void {
    this.shapes[0].translate.x = 5 + Math.sin(time) * 3;
    this.shapes[1].translate.y = 5 + Math.sin(time) * 3;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new CirclesScene(canvas);

  scene.setCanvasSize(600, 600);
  scene.setViewport(0, 0, 10);

  scene.start();
});
