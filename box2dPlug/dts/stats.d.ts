declare class Stats {
    REVISION: number;
    domElement: HTMLDivElement;
    setMode(value: number): void;
    begin(): void;
    end(): number;
    update(): void;
}