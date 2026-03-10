class ModelBase {

  constructor(source: any){
    this.hydrate(this, source);
  }

  private hydrate<T>(target: T, source: Partial<T>) {
    Object.keys(source).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        (target as any)[key] = (source as any)[key];
      }
    });
  }

  jsonyfy<T>(){
    const output: Record<string, any> = {};
    Object.keys(this).forEach( key =>{
      output[key] = (this as any)[key];
    });
    return output;
  }
}

export default ModelBase;
