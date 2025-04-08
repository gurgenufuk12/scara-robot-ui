declare module "three/examples/jsm/loaders/OBJLoader" {
    import { Loader } from "three";
    import { LoadingManager } from "three";
    import { Group } from "three";
  
    export class OBJLoader extends Loader {
      constructor(manager?: LoadingManager);
      load(
        url: string,
        onLoad: (object: Group) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
      parse(data: string): Group;
    }
  }