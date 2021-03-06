import { Shape } from "hovl/shapes";

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export abstract class Scene {
  public readonly context: CanvasRenderingContext2D;
  public simulationInterval: number = 10;

  protected shapes: Shape[] = [];

  private readonly canvas: HTMLCanvasElement;
  private viewport: Viewport = { x: 0, y: 0, width: 0, height: 0, scale: 1 };
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

    this.setViewport(0, 0, 1);
  }

  public setCanvasSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.aspectRatio = this.canvas.width / this.canvas.height;

    this.setViewport(this.viewport.x, this.viewport.y, this.viewport.width);
  }

  public setViewport(x: number, y: number, width: number) {
    const scale = this.canvas.width / width;
    const height = width / this.aspectRatio;

    this.viewport = { x, y, width, height, scale };
    this.context.setTransform(scale, 0, 0, scale, -x * scale, -y * scale);
  }

  public start(): void {
    this.startSimulation();
    this.startRender();
  }

  private startSimulation(): void {
    const start = performance.now();
    let last = start;

    const step = () => {
      window.setTimeout(step, this.simulationInterval);

      const now = performance.now();
      const time = now - start;
      const dt = now - last;
      last = now;
      this.update(time / 1000, dt / 1000);
    };

    window.setTimeout(step, this.simulationInterval);
  }

  private startRender(): void {
    const frame = () => {
      this.frame();
      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  }

  public clear(): void {
    this.context.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
  }

  private frame(): void {
    this.render();
  }

  protected abstract update(time: number, dt: number): void;

  protected render(): void {
    this.clear();

    for (const shape of this.shapes) {
      shape.draw(this.context);
    }
  }
}
