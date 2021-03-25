export class VariableUtil {

  private static _instance: VariableUtil;

  public static Instance(createSpan: Function, setModelMaker: Function, getModelMaker: Function): VariableUtil {
    return this._instance || (this._instance = new this(createSpan, setModelMaker, getModelMaker));
  }

  createSpan: Function;
  getModelMaker: Function;
  setModelMaker: Function;

  constructor(createSpan: Function, setModelMaker: Function, getModelMaker: Function) {
    this.createSpan = createSpan;
    this.setModelMaker = setModelMaker;
    this.getModelMaker = getModelMaker;
  }

  validateVariable(line: string, index: number) {
    var errors = '';

    var reg: RegExp = new RegExp(/^(\s*declare\s+)(.*)\s+(entero|cadena|logico|fecha|real)\s*;\s*/gsi);

    line = line.replace(/(\s+)?,(\s+)?/g, ',');

    const matchVariables = reg.exec(line);

    if (!matchVariables) {

      this.createSpan('color-compiled', '[fecha] Compilando linea ' + (index + 1));

      if (!/\s*;\s*$/.test(line)) {
        errors += '[fecha] Error falta ";"\n';
        this.setModelMaker(this.getModelMaker(index + 1, 'Error falta ";"'));
      }

      if (!/\w*(entero|cadena|logico|fecha|real);\w*$/.test(line)){
        errors += '[fecha] Error no contiene un tipo de dato valido\n';
        this.setModelMaker(this.getModelMaker(index + 1, 'Error no contiene un tipo de dato valido'));
      }

    } else {

      if (!matchVariables[2]) {
        errors += 'Error no hay una variable asignada\n';
        this.createSpan('color-compiled', '[fecha] Compilando linea ' + (index + 1));
        this.setModelMaker(this.getModelMaker(index + 1, 'Error no hay una variable asignada'));
      }
      else {
        const error = this.validateAllVariable(matchVariables[2], index);
        if (error) {
          this.createSpan('color-compiled', '[fecha] Compilando linea ' + (index + 1));
          errors += error;
        }
      }

    }

    if (errors) {
      this.createSpan('color-red', errors);
    } else {
      this.createSpan('color-blue', '[fecha] Compilación exitosa de la linea ' + (index + 1));
    }

  }

  validateAllVariable(splited: string, index: number): string {
    if (splited.toString().includes(',')) {
      const error = this.validateMultiVariable(splited, index);
      return error;
    } else {
      const opts = this.validateOptionsVariable(splited);
      if(opts) this.setModelMaker(this.getModelMaker(index + 1, opts.replace('[fecha]', '')));
      return opts;
    }
  }

  validateOptionsVariable(variable: string): string {
    variable = variable.trim();
    if (/^(?:(?!([a-zA-Z]))(.*))*$/.test(variable)) return '[fecha] Error nombre de variable no inicia con una letra "' + variable + '"\n';
    else if (/^([a-zA-Z])(\s+)(\w+)$/.test(variable)) return '[fecha] Error nombre no debe contener espacios "' + variable + '"\n';
    else if (/(?:(?!(\w+)).+)$/.test(variable)) return '[fecha] Error nombre de variable no debe contener caracteres especiales "' + variable + '"\n';
    else if (/^(declare|entero|cadena|logico|fecha|real|entonces|mq|finmq|para|finpara|haga|recibe|si|finsi|sino|function|Inicio|Fin|envia|recibe|llamar)$/.test(variable)) return '[fecha] Error nombre de variable no debe contener palabras reservadas "' + variable + '"\n';
    else if (!variable || variable.length <= 0 || variable.length > 15) return '[fecha] Error sobrepasa el límite establecido de 15 caracteres "' + variable + '"\n';
    else return null;
  }

  validateMultiVariable(variables: string, index: number): string {
    const splitedVar = variables.toString().trim().split(',');
    var errors: string = '';
    splitedVar.forEach(item => {
      const opts = this.validateOptionsVariable(item);
      if (opts){
        errors += opts;
        this.setModelMaker(this.getModelMaker(index + 1, opts.replace('[fecha]', '')));
      }
    });

    return errors;
  }

}
