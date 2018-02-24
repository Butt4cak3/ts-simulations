import { Vector } from "hovl/vector";
import { Shape } from "hovl/shapes";

export interface Viewport {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
}

export interface Point {
  x: number;
  y: number;
}

export abstract class Scene {
  public readonly context: CanvasRenderingContext2D;

  protected shapes: Shape[] = [];

  private readonly canvas: HTMLCanvasElement;
  private viewport?: Viewport;
  private aspectRatio: number;

  public get width(): number {
    return this.canvas.width;
  }

  public get height(): number {
    return this.canvas.height;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.aspectRatio = this.canvas.width / this.canvas.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      this.context = ctx;
    } else {
      throw new Error("No canvas found");
    }
  }

  public setCanvasSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.aspectRatio = this.canvas.width / this.canvas.height;
  }

  public setViewport(x: number, y: number, width: number) {
    const scale = this.canvas.width / width;
    const height = width / this.aspectRatio;

    this.viewport = {
      x,
      y,
      w: width,
      h: height,
      scale: scale
    };
  }

  public toCanvasSpace(len: number): number;
  public toCanvasSpace(vec: Vector): Point;
  public toCanvasSpace(vec: Vector | number) {
    if (!this.viewport) {
      throw new Error("Please set the viewport first");
    }

    if (vec instanceof Vector) {
      const { x, y, scale } = this.viewport;

      return {
        x: (vec.x - x) * scale,
        y: (vec.y - y) * scale
      };
    } else {
      return vec * this.viewport.scale;
    }
  }

  public start(): void {
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      const time = now - start;
      const dt = now - last;
      last = now;
      this.frame(time, dt);
      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private frame(time: number, dt: number): void {
    this.update.call(null, time, dt);
    this.render();
  }

  protected abstract update(time: number, dt: number): void;

  protected render(): void {
    this.clear();

    for (const shape of this.shapes) {
      shape.draw(this);
    }
  }
}